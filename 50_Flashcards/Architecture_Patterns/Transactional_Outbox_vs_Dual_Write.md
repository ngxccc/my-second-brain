---
noteId: 1789871821731
---

Tại sao gọi `broker.Publish()` ngay sau câu lệnh `db.Commit()` là một Anti-Pattern nguy hiểm và giải pháp triệt để là gì?

---

- **Rủi ro Dual-Write**: Không có distributed transaction; nếu commit DB thành công nhưng broker sập/lỗi mạng thì mất sự kiện vĩnh viễn (Data Inconsistency).
- **Transactional Outbox**: Ghi sự kiện vào bảng `outbox` trong cùng ACID transaction với dữ liệu nghiệp vụ, rồi dùng Worker/CDC stream sang Broker với bảo đảm At-Least-Once.

---

Extra: Dùng Debezium đọc Postgres WAL để stream bảng outbox sang Kafka mà không cần định kỳ polling DB.
