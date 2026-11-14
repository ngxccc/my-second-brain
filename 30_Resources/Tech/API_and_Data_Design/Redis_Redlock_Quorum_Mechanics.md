---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Redlock đổi tính đúng đắn lấy xác suất: cấp lock khi đa số node độc lập đồng ý trong một cửa sổ thời gian hợp lệ."
---

# Redis Redlock Quorum Mechanics

## TL;DR

- **Bản chất**: Cơ chế: ghi lock lên từng node, đếm số ack nhận được trong cửa sổ thời gian, rồi trừ hao clock drift trước khi kết luận.
- **Mục đích**: Giảm xác suất hai owner cùng lúc do failover, bằng cách không dựa vào replication giữa các node.
- **Điểm mấu chốt**: Giá trị của Redlock đến từ **N node độc lập**. Chạy nó trên một node thì thuật toán còn nguyên nhưng tính chất bảo vệ biến mất.

## Core Concept

Điều kiện để coi là đã lấy lock:

1. Gọi `SET key random_value NX PX ttl` trên **tất cả** N node, mỗi lệnh có timeout rất nhỏ so với TTL.
2. Đếm số node thành công, phải đạt quorum `floor(N/2) + 1` (N=5 thi quorum là 3).
3. Đo tổng thời gian `ΔT = T2 - T1`, phải nhỏ hơn TTL.
4. Thời gian giữ lock thực tế: `validity = TTL - ΔT - clock_drift`.
5. Nếu thất bại, phải gửi lệnh release tới **tất cả** node, kể cả node chưa cấp lock, để dọn key rác.

Chi tiết làm nên hoặc phá tính đúng đắn:

- `random_value` phải là token ngẫu nhiên riêng cho từng lần acquire. Release dùng Lua so sánh giá trị trước khi xóa.
- `retryDelay` cộng `retryJitter` để các client không retry đồng loạt và tạo bão lock.
- N node phải **hoàn toàn độc lập**, không master-slave với nhau. Nếu dùng chung một Redis cluster có replication thì quay lại đúng vấn đề mà Redlock sinh ra để tránh.
- TTL phải lớn hơn thời gian xử lý tối đa, nếu không phải gia hạn (watchdog) hoặc tách thành job idempotent.

Giới hạn: quorum không chặn được process pause. Nếu lock dùng cho correctness, xem [[Fencing_Token_Correctness_Requirement]].

## Practical Implementation

```ts
import Redis from "ioredis";
import Redlock from "redlock";

// N=5 node doc lap. Mot node thi khong con la Redlock.
const clients = [1, 2, 3, 4, 5].map(
  (i) => new Redis({ host: `redis-${i}.internal`, port: 6379 }),
);

const redlock = new Redlock(clients, {
  driftFactor: 0.01,
  retryCount: 3,
  retryDelay: 200,
  retryJitter: 50,
});

const lock = await redlock.acquire(["lock:order:123"], 10_000);
try {
  await doCriticalWork();
} finally {
  await lock.release();
}
```

## Điều kiện sai

- **"Khởi tạo Redlock với một Redis client vẫn là Redlock"** - sai về tính chất. Code chạy, API giống, nhưng mất toàn bộ khả năng chống failover. Đây là lỗi phổ biến khi copy cấu hình từ môi trường dev.
- **"Quorum đủ để không cần fencing"** - sai. Quorum chống failover, không chống process pause.
- **"TTL không cần trừ drift"** - sai. Đồng hồ các node lệch nhau thì cửa sổ hợp lệ hẹp hơn TTL danh nghĩa.
- **"Quên release trên node lỗi không sao"** - sai. Key rác trên node đó sẽ chặn lần acquire sau đến khi TTL hết.
- **"Redlock dùng cho giao dịch tiền mà không cần kiểm tra ở DB"** - sai và nguy hiểm. Kleppmann và antirez thống nhất điểm này: cần fencing ở tầng lưu trữ.

## Related Notes

- [[Distributed_Lock_Failure_Modes]] - ba đường hỏng mà Redlock chỉ giảm xác suất
- [[Fencing_Token_Correctness_Requirement]] - tầng bảo vệ bắt buộc cho giao dịch
- [[Redis_Redlock]] - điểm vào và bản đồ ba note
