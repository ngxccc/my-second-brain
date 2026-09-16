---
noteId: 1789565951291
---

Làm thế nào để nhiều Worker cùng quét một bảng `outbox_events` để lấy Job xử lý song song mà không bao giờ bị tranh chấp Lock hoặc đứng chờ nhau?

---

Sử dụng mệnh đề **`SELECT ... FOR UPDATE SKIP LOCKED`**:

```sql
SELECT * FROM outbox_events
WHERE status = 'PENDING'
ORDER BY created_at ASC
LIMIT 1
FOR UPDATE SKIP LOCKED;
```

Khi Worker 1 khóa Job 1, Worker 2 đến gặp Job 1 bị khóa sẽ **bỏ qua ngay lập tức** (không xếp hàng chờ như `FOR UPDATE` thông thường) và nhảy thẳng sang khóa Job 2 để xử lý.

---

Extra: Mệnh đề `SKIP LOCKED` biến một bảng quan hệ PostgreSQL thông thường thành một Message Queue hiệu năng cao mà không cần đến RabbitMQ hay Redis.
