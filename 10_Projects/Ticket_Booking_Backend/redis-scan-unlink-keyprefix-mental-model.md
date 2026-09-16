# Mental Model: Redis Concurrency, Non-blocking Iteration (SCAN), Async Memory Reclaim (UNLINK) & KeyPrefix Isolation

> **Category**: Distributed Systems / Caching / Testing Concurrency  
> **Tags**: `#redis` `#concurrency` `#mental-model` `#ioredis` `#performance` `#test-isolation`  
> **Status**: Permanent Note (Atomic Knowledge)

---

## 1. Single-Threaded Event Loop & The Danger of `KEYS *`

### 1.1. Bản chất Kiến trúc Redis Single-Threaded

Redis xử lý toàn bộ command pipeline (đọc socket, parse command, thực thi logic, trả về socket) trên **một luồng đơn duy nhất (Single-Threaded Event Loop)** dựa trên I/O Multiplexing (`epoll` / `kqueue`).

$$\text{Latency of Other Requests} \ge \text{Execution Time of Running Command}$$

```
Client 1 (Worker 1) ───[ KEYS * (100k keys, takes 80ms) ]───► [ Redis Single Thread ] (BLOCKED)
Client 2 (Worker 2) ───[ GET booking:seat:123 ]───────────────► [ Socket Queue ]      (WAITING...)
Client 3 (Worker 3) ───[ SET lock:payment ]────────────────────► [ Socket Queue ]      (WAITING...)
Client 4 (Worker 4) ───[ INCR show:count ]─────────────────────► [ Socket Queue ]      (TIMEOUT 524!)
```

### 1.2. Thảm họa của `KEYS *` trong Parallel Testing / High Concurrency

- **Độ phức tạp**: $O(N)$ với $N$ là tổng số key trong toàn bộ keyspace (database).
- **Cơ chế**: Quét tuyến tính qua toàn bộ hashtable Redis trong một lệnh duy nhất.
- **Hệ quả**:
  - Khi 8 worker test chạy song song, chỉ cần 1 worker gọi `KEYS *` lúc teardown, 7 worker còn lại lập tức bị giật lag, drop kết nối hoặc gặp lỗi timeout (`524 Timeout / Stream isn't writeable`).

---

## 2. Giải pháp Duyệt Không Khóa: `SCAN` (Cursor-based Non-blocking Iteration)

### 2.1. Cơ chế Hoạt động của `SCAN`

`SCAN` phân rã quá trình quét toàn bộ keyspace thành nhiều bước nhảy nhỏ độc lập, sử dụng **con trỏ (`cursor`)**:

$$\text{SCAN } \langle\text{cursor}\rangle \text{ [MATCH pattern] [COUNT count]}$$

```
Step 1: SCAN 0 MATCH "test:*" COUNT 100 ──► Trả về: [cursor: "42", keys: ["key1", "key2"]]
───► Redis nhường Event Loop cho các Client khác xử lý lệnh ◄───
Step 2: SCAN 42 MATCH "test:*" COUNT 100 ──► Trả về: [cursor: "128", keys: ["key3"]]
───► Redis nhường Event Loop cho các Client khác xử lý lệnh ◄───
Step 3: SCAN 128 MATCH "test:*" COUNT 100 ──► Trả về: [cursor: "0", keys: []] (Hoàn tất)
```

### 2.2. So sánh Kỹ thuật: `KEYS *` vs `SCAN`

| Tiêu chí                       | `KEYS *`                              | `SCAN`                                                 |
| :----------------------------- | :------------------------------------ | :----------------------------------------------------- |
| **Độ phức tạp thời gian**      | $O(N)$ (Atomic Blocking)              | $O(1)$ mỗi bước nhảy, tổng thể $O(N)$ phân tán         |
| **Tác động lên Event Loop**    | Khóa cứng luồng đơn đến khi quét xong | Hoàn toàn **Non-blocking**, nhường luồng giữa các bước |
| **Độ an toàn Production / CI** | ⛔ Tuyệt đối cấm sử dụng              | ✅ Tiêu chuẩn bắt buộc                                 |
| **Trạng thái kết thúc**        | Một lần trả về toàn bộ mảng           | Dừng khi `cursor === "0"`                              |

---

## 3. Tại sao Dùng `UNLINK` Thay vì `DEL`? (Async Memory Reclamation)

### 3.1. Điểm nghẽn của `DEL`

- `DEL` là lệnh **đồng bộ (Synchronous)**.
- Khi xóa một key chứa cấu trúc dữ liệu lớn (Hash có 50.000 fields, Set hàng triệu phần tử, hoặc mảng 100 keys cùng lúc), `DEL` sẽ tính toán thu hồi và giải phóng bộ nhớ (memory deallocation / `free()`) ngay trên Main Thread $\rightarrow$ **Gây nghẽn Redis**.

### 3.2. Sức mạnh của `UNLINK` (Lazy Background Deallocation)

`UNLINK` tách rời 2 giai đoạn:

1. **Giai đoạn 1 (Main Thread - Microsecond)**: Xóa key khỏi keyspace hashtable ngay lập tức. Key xem như đã biến mất với mọi client.
2. **Giai đoạn 2 (Background Bio Thread)**: Đưa con trỏ bộ nhớ (memory pointer) vào hàng đợi để thread phụ giải phóng bộ nhớ ngầm (`lazyfree`).

$$\text{Latency of UNLINK} = O(1) \quad (\text{Main Thread time regardless of data size})$$

```
[ UNLINK key1 key2 ] ──► [ Main Thread ]: Tách key khỏi keyspace (0.01ms) ──► Trả lời OK cho Client
                                  │
                                  ▼
                         [ Background Thread ]: Thu hồi RAM / free(memory) (Bất đồng bộ)
```

---

## 4. Xử lý Cạm bẫy "Nhân đôi Tiền tố" (IoRedis Double-Prefixing Bug)

### 4.1. Cơ chế Prefix Injection của `ioredis`

Khi client `ioredis` được khởi tạo với cấu hình `keyPrefix: "test:test_123:"`:

1. Mọi lệnh ghi/đọc (`get`, `set`, `del`, `unlink`) đều được `ioredis` tự động chèn prefix:
   ```
   redis.get("user")  ──► Gửi xuống Redis: "test:test_123:user"
   ```
2. Với lệnh `SCAN`:
   ```ts
   redis.scan(cursor, "MATCH", "*", "COUNT", 100);
   ```
   - `ioredis` biến đổi pattern thành: `MATCH test:test_123:*`.
   - Redis server tìm các key khớp và trả về tên key **nguyên bản trên server** (đã có sẵn prefix):
     ```json
     ["test:test_123:booking_1", "test:test_123:idempotency_2"]
     ```

### 4.2. Cạm bẫy Nhân đôi Tiền tố (Double-Prefixing)

Nếu truyền trực tiếp mảng kết quả của `SCAN` vào `redis.unlink(...keys)`:

$$\text{ioredis} \xrightarrow{\text{pre-pend prefix}} \text{UNLINK test:test\_123:}\mathbf{test:test\_123:booking\_1}$$

$\Rightarrow$ **Hậu quả**: Key cần xóa là `test:test_123:booking_1`, nhưng lệnh gửi xuống lại là xóa key `test:test_123:test:test_123:booking_1` $\rightarrow$ **Xóa trượt, rác Redis không bao giờ được giải phóng!**

### 4.3. Giải pháp Bất biến (Prefix Stripping Invariant)

```ts
export async function cleanScopedRedisKeys(redis: Redis): Promise<void> {
  const prefix = redis.options.keyPrefix ?? "";
  let cursor = "0";

  try {
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        "*",
        "COUNT",
        100,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        // Strip keyPrefix before calling unlink because ioredis automatically re-applies it to arguments.
        const strippedKeys = prefix
          ? keys.map((k) => (k.startsWith(prefix) ? k.slice(prefix.length) : k))
          : keys;
        await redis.unlink(...strippedKeys).catch(() => undefined);
      }
    } while (cursor !== "0");
  } catch {
    // Fail-open: ignore Redis cleanup errors if Redis server is offline during test teardown.
  }
}
```

---

## 5. Tổng kết Kiến trúc & Bất biến Cốt lõi (Mental Checklist)

1. **Non-blocking Cleanup**: Luôn dùng `SCAN` + `COUNT` thay cho `KEYS *` khi dọn rác định kỳ hoặc test teardown.
2. **Asynchronous Memory Reclaim**: Dùng `UNLINK` thay vì `DEL` khi xóa theo lô (batch deletion) để bảo vệ main thread latency.
3. **Prefix Discipline**: Khi dùng client-side prefixing (`ioredis`), luôn cắt prefix trả về từ `SCAN` trước khi chuyển tiếp sang các hàm write/delete khác.
4. **Resilience (Fail-open)**: Teardown logic đối với cache/queue phải bọc fail-open để không làm sập chu trình dọn dẹp cơ sở dữ liệu chính (PostgreSQL).
