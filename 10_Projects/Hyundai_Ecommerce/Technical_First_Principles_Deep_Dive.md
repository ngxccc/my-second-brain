---
tags:
  [
    type/deep-dive,
    topic/backend-internals,
    topic/hyundai-ecommerce,
    career/interview-prep,
  ]
date: 2026-09-13
aliases:
  [Technical First Principles, Backend Internals 80/20, Architecture Deep Dive]
status: active
---

# Bản Chất Các Công Nghệ Cốt Lõi (Technical First-Principles Deep Dive)

Tài liệu phân tích nguyên lý vận hành của bốn thành phần hạ tầng trong dự án: PostgreSQL 18, Redis 8, BullMQ và cơ chế kiểm soát tương tranh.

---

## 0. Bản Đồ Ánh Xạ Mã Nguồn Thực Tế (Codebase Grounding Matrix)

Mọi nguyên lý được phân tích bắt nguồn trực tiếp từ các tệp mã nguồn trong hệ thống:

| Công nghệ và nguyên lý             | Tệp mã nguồn trong repo                                             | Vai trò và vị trí thực thi                                                                                                                                        |
| :--------------------------------- | :------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL MVCC và Transaction     | `backend/src/modules/quotes/quotes.service.ts`                      | Hàm `approveAndConvertToOrder`: bọc `db.transaction()` gồm các lệnh đọc báo giá, ghi đơn hàng, ghi dòng sản phẩm và cập nhật trạng thái báo giá thành `APPROVED`. |
| PostgreSQL Row-Lock `SKIP LOCKED`  | `backend/src/modules/outbox/outbox.service.ts`                      | Hàm `processOutbox`: truy vấn `.for("update", { skipLocked: true })` để lấy 10 sự kiện outbox chưa xử lý mà không gây nghẽn giữa các worker.                      |
| PostgreSQL JSONB và TipTap AST     | `backend/src/database/schemas/products.schema.ts`                   | Các cột `descriptionVi`, `descriptionEn` kiểu `jsonb().$type<JSONContent>()` lưu cây cú pháp trừu tượng của trình soạn thảo Rich Text TipTap.                     |
| Redis Infrastructure               | `backend/src/redis/redis.service.ts`                                | Client `ioredis` kết nối Redis 8, phục vụ bộ nhớ đệm, giới hạn tần suất và backend cho hàng đợi BullMQ.                                                           |
| Redis Refresh Token Rotation (RTR) | `backend/src/modules/auth/auth.service.ts`                          | Lưu trữ mã băm SHA-256 của Refresh Token và danh sách thu hồi nhằm ngăn chặn tấn công phát lại mã xác thực.                                                       |
| BullMQ Mail Queue                  | `backend/src/modules/auth/processors/mail.processor.ts`             | Worker `@Processor(QUEUE_NAMES.MAIL)` xử lý gửi thư điện tử bất đồng bộ với cơ chế thử lại trễ số mũ.                                                             |
| BullMQ Outbox Cleanup Queue        | `backend/src/modules/outbox/processors/outbox-cleanup.processor.ts` | Worker `@Processor(QUEUE_NAMES.OUTBOX)` định kỳ quét và thu dọn các bản ghi outbox đã xử lý thành công quá 7 ngày.                                                |
| Cơ chế tương tranh Outbox          | `backend/src/modules/outbox/outbox.service.ts`                      | Vòng lặp `setInterval` kết hợp câu lệnh PostgreSQL `SKIP LOCKED`, tận dụng vòng đời kết nối TCP của transaction.                                                  |

---

## 1. PostgreSQL: MVCC, WAL, B-Tree và Concurrency Locks

### 1.1. Cơ Chế MVCC (Multi-Version Concurrency Control)

#### Giới hạn của cơ chế khóa đọc-ghi truyền thống

Trong các hệ thống áp dụng khóa hai giai đoạn (2PL), giao dịch ghi sẽ khóa dữ liệu, buộc các giao dịch đọc phải chờ. Điều này làm nghẽn lưu lượng truy cập khi số lượng truy vấn đọc tăng cao.

#### Cách tiếp cận của PostgreSQL

PostgreSQL không ghi đè trực tiếp lên dữ liệu cũ khi cập nhật hoặc xóa, mà tạo ra một phiên bản dòng mới (tuple version).

Mỗi dòng mang hai trường định danh giao dịch ẩn:

- `xmin`: ID của transaction đã chèn dòng này.
- `xmax`: ID của transaction đã xóa hoặc cập nhật dòng này. Nếu dòng vẫn hợp lệ và chưa bị xóa, giá trị `xmax` là 0.

Khi thực hiện lệnh `UPDATE`:

1. PostgreSQL đánh dấu phiên bản dòng cũ với `xmax = current_tx_id`.
2. PostgreSQL chèn một phiên bản dòng mới với `xmin = current_tx_id` và `xmax = 0`.

```
[Phiên bản 1 (Cũ)]  --> xmin: 100, xmax: 105 (Đã bị transaction 105 thay thế)
[Phiên bản 2 (Mới)] --> xmin: 105, xmax: 0   (Phiên bản hợp lệ hiện tại)
```

#### Quy tắc đọc của bản chụp dữ liệu (Snapshot)

Ở mức cô lập `READ COMMITTED`, PostgreSQL tạo bản chụp dữ liệu ghi nhận danh sách transaction đang hoạt động tại thời điểm truy vấn bắt đầu.

- Giao dịch đọc chỉ thấy những dòng có `xmin` đã commit trước thời điểm snapshot và `xmax` bằng 0, hoặc chưa commit, hoặc commit sau thời điểm snapshot.
- Nhờ vậy, phiên đọc không bao giờ chặn phiên ghi và phiên ghi không chặn phiên đọc.

#### Vai trò của VACUUM

Các phiên bản dòng cũ không còn hiệu lực (Dead Tuples) tích tụ theo thời gian sẽ làm tăng dung lượng bảng trên đĩa cứng (table bloat). Tiến trình `autovacuum` định kỳ quét và giải phóng không gian của các dòng chết khi không còn snapshot nào cần truy cập đến chúng.

---

### 1.2. Write-Ahead Logging (WAL), Checkpoint và Phục Hồi Dữ Liệu

#### Chi phí ghi đĩa trực tiếp khi commit

Tệp dữ liệu bảng được phân chia thành các trang 8KB. Việc ghi các trang dữ liệu phân tán xuống đĩa sau mỗi lệnh `INSERT` hoặc `UPDATE` phát sinh chi phí truy xuất đĩa ngẫu nhiên (Random I/O) rất lớn, làm giảm thông lượng giao dịch.

#### Cơ chế ghi nhật ký tuần tự

PostgreSQL phân chia vùng nhớ thành hai khu vực:

1. Shared Buffer Pool: Lưu trữ các trang dữ liệu đọc từ đĩa. Các thao tác ghi cập nhật dữ liệu trực tiếp trên RAM, biến trang tương ứng thành trang bẩn (Dirty Page).
2. WAL Buffer: Ghi chép nhật ký thao tác dưới dạng luồng byte tuần tự.

```
Yêu cầu ghi -> Cập nhật trang bẩn trên Shared Buffer Pool
            -> Ghi nhật ký thao tác vào WAL Buffer
COMMIT      -> Xả WAL Buffer tuần tự xuống tệp WAL trên đĩa
            -> Trả kết quả thành công cho client
```

Mỗi bản ghi nhật ký mang một chỉ số tuần tự tăng dần (Log Sequence Number - LSN).

#### Checkpoint và mốc REDO Point

Để tránh việc tích tụ quá nhiều trang bẩn trên RAM, tiến trình `Checkpointer` định kỳ thực thi:

1. Xả các trang bẩn từ Shared Buffer Pool xuống các tệp bảng trên đĩa cứng.
2. Ghi bản ghi Checkpoint vào WAL, đánh dấu mốc bắt đầu khôi phục (REDO Point).
3. Cho phép dọn dẹp hoặc ghi đè các đoạn tệp WAL nằm trước mốc REDO Point.

#### Quy trình phục hồi khi máy chủ dừng đột ngột

Khi máy chủ dừng nguồn đột ngột, dữ liệu trên RAM mất. Trong quá trình khởi động lại:

1. PostgreSQL đọc tệp `pg_control` để xác định mốc REDO Point của lần Checkpoint gần nhất.
2. Hệ thống đọc tuần tự các bản ghi WAL từ mốc REDO Point trở đi và phát lại:
   - So sánh LSN của bản ghi WAL với LSN ghi trong phần đầu trang dữ liệu trên đĩa.
   - Nếu `WAL_LSN > Page_LSN`: Thao tác chưa được xả xuống đĩa trước khi dừng máy, PostgreSQL ghi đè cập nhật vào trang.
   - Nếu `WAL_LSN <= Page_LSN`: Thao tác đã được đồng bộ xuống đĩa trước đó, PostgreSQL bỏ qua.

---

### 1.3. B-Tree Index và Quy Tắc Tiền Tố Bên Trái

#### Đặc tính cấu trúc B-Tree

B-Tree sắp xếp dữ liệu theo thứ tự tăng dần với độ phức tạp tìm kiếm, thêm và xóa ở mức $O(\log N)$. Các nút lá liên kết hai chiều giúp các phép quét khoảng (`BETWEEN`, `>`, `<`) thực thi trực tiếp trên tầng lá mà không cần duyệt lại từ gốc.

#### Quy tắc tiền tố bên trái (Leftmost Prefix Rule)

Với chỉ mục kết hợp: `CREATE INDEX idx_status_created ON orders (status, created_at);`

Cây chỉ mục sắp xếp theo cột `status` trước, sau đó mới đến cột `created_at`.

- Truy vấn `WHERE status = 'PENDING' AND created_at > '2026-01-01'`: Sử dụng chỉ mục trên cả hai điều kiện.
- Truy vấn `WHERE status = 'PENDING'`: Sử dụng chỉ mục trên nhánh `status`.
- Truy vấn `WHERE created_at > '2026-01-01'`: Không tận dụng được cấu trúc cây phân nhánh theo `status`, buộc hệ thống phải quét toàn bộ bảng hoặc quét toàn bộ chỉ mục.

---

### 1.4. Khóa Tương Tranh: `FOR UPDATE` và `FOR UPDATE SKIP LOCKED`

#### Khóa chờ `SELECT ... FOR UPDATE`

Câu lệnh `SELECT ... FOR UPDATE` áp đặt khóa độc quyền lên các dòng dữ liệu được chọn. Giao dịch khác muốn truy cập cùng dòng dữ liệu này phải dừng chờ cho đến khi giao dịch đầu tiên hoàn tất commit hoặc rollback. Nếu nhiều worker cùng tranh chấp các bản ghi đầu trong hàng đợi, các worker phía sau sẽ bị nghẽn luồng.

#### Khóa bỏ qua `SELECT ... FOR UPDATE SKIP LOCKED`

Câu lệnh `SELECT ... FOR UPDATE SKIP LOCKED` tự động bỏ qua những dòng đang bị giao dịch khác khóa để lấy các dòng tự do tiếp theo. Cơ chế này loại bỏ tình trạng tranh chấp và dừng chờ giữa các tiến trình xử lý nền, phù hợp cho việc triển khai hàng đợi tác vụ trên PostgreSQL.

---

## 2. Redis: I/O Multiplexing và Các Tình Huống Sự Cố Bộ Nhớ Đệm

### 2.1. Yếu Tố Giúp Redis Đơn Luồng Đạt Thông Lượng Cao

Redis xử lý các lệnh đọc ghi trên một luồng chính duy nhất nhưng đạt thông lượng trên 100.000 yêu cầu mỗi giây nhờ ba yếu tố:

#### Thao tác trên bộ nhớ RAM

Thời gian truy xuất RAM dao động trong khoảng 50 đến 100 nanosecond, nhanh hơn nhiều so với việc đọc ghi đĩa cứng.

#### Không phát sinh chi phí chuyển đổi luồng

Kiến trúc đơn luồng không tiêu tốn chu kỳ CPU cho việc chuyển đổi ngữ cảnh và không cần dùng các cấu trúc khóa đồng bộ bộ nhớ như mutex hay spinlock.

#### Cơ chế I/O Multiplexing

Redis sử dụng lời gọi hệ thống `epoll` trên Linux để theo dõi hàng chục nghìn kết nối mạng trên cùng một luồng:

1. Lệnh `epoll_wait` chỉ đánh thức vòng lặp sự kiện khi có socket mạng sẵn sàng truyền nhận dữ liệu với độ phức tạp $O(1)$.
2. Vòng lặp đọc dữ liệu từ socket, thực thi lệnh trên cấu trúc dữ liệu bộ nhớ, rồi ghi kết quả vào bộ đệm đầu ra của kết nối.

---

### 2.2. Các Kịch Bản Sự Cố Bộ Nhớ Đệm và Phương Án Xử Lý

Trong mô hình Cache-Aside, ba tình huống sự cố sau thường gặp:

| Tình huống sự cố  | Biểu hiện                                                                                        | Nguyên nhân                                                                                      | Giải pháp xử lý                                                                                                                                 |
| :---------------- | :----------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Cache Penetration | Yêu cầu chọc thẳng xuống database với tần suất cao, bỏ qua bộ nhớ đệm.                           | Truy vấn các định danh không tồn tại ở cả cache lẫn database. Cache không có dữ liệu để nạp lại. | Lưu giá trị rỗng (`null`) vào Redis với TTL ngắn từ 30 đến 60 giây, hoặc sử dụng Bloom Filter để chặn trước các định danh không tồn tại.        |
| Cache Breakdown   | Một khóa có lưu lượng đọc lớn vừa hết hạn thì lập tức nhiều truy vấn cùng truy cập database.     | Khóa chứa dữ liệu có tần suất truy cập cao hết hạn đúng thời điểm cao điểm.                      | Dùng khóa phân tán ngắn hạn để chỉ cho phép một yêu cầu truy vấn database và nạp lại cache, hoặc dùng cơ chế hết hạn logic (refresh chạy ngầm). |
| Cache Avalanche   | Nhiều khóa khác nhau đồng loạt hết hạn tại cùng một thời điểm, khiến database chịu tải đột biến. | Các khóa được nạp dữ liệu với cùng một giá trị TTL cố định.                                      | Bổ sung khoảng thời gian ngẫu nhiên vào TTL (`TTL = Base_TTL + random(0, 300)`) để phân tán thời điểm hết hạn của các khóa.                     |

---

## 3. BullMQ: Cấu Trúc Dữ Liệu Hàng Đợi Trên Redis

BullMQ ánh xạ mô hình hàng đợi công việc lên các cấu trúc dữ liệu nguyên thủy của Redis.

### 3.1. Phân Bổ Trạng Thái Công Việc

Mỗi hàng đợi được tổ chức qua các khóa Redis:

- `bull:<queue>:<id>`: Hash lưu thông tin chi tiết của công việc (tên, dữ liệu đầu vào, số lần thử, dấu thời gian).
- `bull:<queue>:wait`: List chứa danh sách công việc đang chờ worker tiếp nhận.
- `bull:<queue>:active`: List chứa các công việc đang được worker xử lý.
- `bull:<queue>:delayed`: Sorted Set chứa các công việc hẹn giờ hoặc chờ thử lại, với điểm số là mốc thời gian cần chạy.
- `bull:<queue>:completed`: Sorted Set lưu trữ các công việc đã hoàn thành.
- `bull:<queue>:failed`: Sorted Set lưu trữ các công việc thất bại sau khi hết số lượt thử lại.
- `bull:<queue>:events`: Stream ghi nhận các sự kiện thay đổi trạng thái phục vụ việc theo dõi.

### 3.2. Tính Nguyên Tử Qua Lua Script

Việc chuyển công việc giữa các danh sách (như từ `wait` sang `active`) sử dụng các đoạn mã Lua Script thực thi trực tiếp trên Redis engine. Vì Redis chạy đơn luồng, script Lua đảm bảo thao tác di chuyển công việc diễn ra nguyên tử, loại trừ trường hợp hai worker nhận cùng một công việc.

### 3.3. Cơ Chế Tác Vụ Trễ và Thử Lại

- Tác vụ trễ: Công việc được đưa vào Sorted Set `delayed` với điểm số bằng thời gian hiện tại cộng độ trễ. Định kỳ, hệ thống dùng `ZRANGEBYSCORE` để lọc các công việc đến hạn và chuyển sang danh sách `wait`.
- Thử lại số mũ: Khi công việc gặp lỗi, khoảng thời gian trễ tăng dần theo hàm mũ $\text{delay} = \text{base\_delay} \times 2^{\text{attempts}}$ trước khi đưa lại vào danh sách chờ.

---

## 4. Concurrency: Đánh Đổi Giữa Khóa Redis và Khóa Cơ Sở Dữ Liệu

### 4.1. Phân Biệt Khóa Tối Ưu và Khóa An Toàn Dữ Liệu

Cần phân biệt rõ hai mục đích sử dụng khóa trong hệ thống phân tán:

1. Khóa tối ưu hiệu năng (Efficiency): Tránh lặp lại tác vụ tốn tài nguyên (như render video hay gửi email trùng lặp). Nếu khóa gặp sự cố, hệ thống chỉ tốn thêm tài nguyên tính toán mà không làm sai lệch dữ liệu. Khóa Redis đơn lẻ với thời gian sống (TTL) phù hợp cho mục đích này.
2. Khóa an toàn dữ liệu (Correctness): Ngăn chặn ghi đè làm sai lệch số dư tài khoản, hàng tồn kho hoặc trạng thái hợp đồng. Khóa dựa trên thời gian (wall-clock lease) của Redis tiềm ẩn rủi ro khi tiến trình bị tạm dừng (GC pause) hoặc có độ trễ mạng. Tầng lưu trữ cần trực tiếp tham gia kiểm soát (bằng số phiên bản, fencing token hoặc khóa của cơ sở dữ liệu).

### 4.2. Vấn Đề Của Khóa Phân Tán Dựa Trên Thời Gian

Trong môi trường mạng bất đồng bộ, khi Client 1 nhận khóa với thời hạn 10 giây nhưng gặp sự cố dừng tiến trình do Garbage Collection kéo dài 15 giây:

1. Khóa trên Redis hết hạn ở giây thứ 10.
2. Redis cấp khóa mới cho Client 2.
3. Client 2 ghi dữ liệu vào cơ sở dữ liệu.
4. Client 1 tiếp tục hoạt động và ghi dữ liệu, ghi đè lên kết quả của Client 2.

Để ngăn chặn tình trạng này, hệ thống lưu trữ phải kiểm tra Fencing Token tăng dần hoặc dùng cơ chế khóa cấp cơ sở dữ liệu.

### 4.3. Lý Do Lựa Chọn `SKIP LOCKED` Trong Dự Án

Tại `backend/src/modules/outbox/outbox.service.ts`, hệ thống sử dụng trực tiếp PostgreSQL `SELECT ... FOR UPDATE SKIP LOCKED` thay vì dựng cơ chế khóa phân tán trên Redis:

1. Khóa hàng của PostgreSQL gắn với phiên kết nối TCP của transaction. Nếu worker dừng đột ngột hoặc mất kết nối, PostgreSQL tự động giải phóng khóa ngay khi đứt socket, không cần chờ hết hạn thời gian như Redis.
2. Toàn bộ thao tác diễn ra trong cùng một transaction cơ sở dữ liệu, loại bỏ việc đồng bộ trạng thái giữa hai hệ thống tách biệt.
3. Giảm bớt số lượng dịch vụ phụ thuộc cho tác vụ điều phối outbox.

---

## 5. Câu Hỏi Phỏng Vấn Sát Thực Tế

### Câu 1: Cơ chế nào diễn ra ở tầng kết nối khi dùng transaction trong Drizzle và NestJS?

Drizzle lấy một kết nối riêng từ Connection Pool và gửi lệnh `BEGIN`. Các thao tác đọc ghi tiếp theo trong callback thực thi trên kết nối đó. Khi hàm hoàn tất, Drizzle gửi `COMMIT`, PostgreSQL xả bộ đệm WAL xuống đĩa và hoàn trả kết nối về pool. Nếu có lỗi, khối catch gửi `ROLLBACK` để hủy bỏ toàn bộ thao tác.

### Câu 2: Làm thế nào PostgreSQL xác định điểm bắt đầu khôi phục sau khi mất nguồn đột ngột?

PostgreSQL đọc tệp `pg_control` để lấy vị trí mốc Checkpoint gần nhất. Điểm này xác định mốc REDO Point, nơi toàn bộ trang bẩn trước đó đã nằm an toàn trên đĩa. PostgreSQL chỉ cần đọc và phát lại các bản ghi WAL từ mốc REDO Point trở đi, giúp hoàn tất khôi phục trong thời gian ngắn mà không phải duyệt lại toàn bộ nhật ký cũ.

### Câu 3: Mục đích của việc cấu hình TTL kèm Jitter trong Redis cache là gì?

Cấu hình TTL giúp giải phóng bộ nhớ, tránh tình trạng đầy RAM dẫn đến kích hoạt chính sách loại bỏ dữ liệu (eviction). Bổ sung Jitter (khoảng thời gian ngẫu nhiên) giúp phân tán thời điểm hết hạn của các khóa, tránh tình trạng hàng loạt khóa đồng loạt biến mất cùng một thời điểm gây quá tải đột biến cho cơ sở dữ liệu.

### Câu 4: Tiêu chí lựa chọn giữa khóa Redis và khóa cấp dòng trên PostgreSQL?

Khóa Redis phù hợp cho các tác vụ tối ưu hiệu năng giữa các tiến trình phân tán như giới hạn tần suất hoặc khử trùng lặp tác vụ định kỳ. Đối với các nghiệp vụ đòi hỏi tính an toàn dữ liệu như thanh toán, chuyển đổi trạng thái báo giá sang đơn hàng hoặc điều phối outbox, khóa cấp dòng của PostgreSQL (`SELECT FOR UPDATE / SKIP LOCKED`) phù hợp hơn nhờ gắn với giao dịch ACID và tự động giải phóng khi mất kết nối mạng.
