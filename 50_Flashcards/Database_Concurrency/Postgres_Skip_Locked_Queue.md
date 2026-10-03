---
noteId: 1789565951291
---

Làm thế nào để nhiều Worker cùng quét bảng `outbox_events` xử lý song song mà không bị tranh chấp Lock hoặc đứng chờ nhau?

---

- **`SELECT ... FOR UPDATE SKIP LOCKED`**: Khóa hàng cần xử lý và lập tức bỏ qua các hàng đang bị Worker khác khóa, loại bỏ hoàn toàn thời gian chờ.

---

Extra: Mệnh đề này biến bảng quan hệ thành một Message Queue hiệu năng cao:

```sql
SELECT * FROM outbox_events WHERE status = 'PENDING'
ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED;
```
