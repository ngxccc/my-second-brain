---
noteId: 1789871821731
---

[Phỏng vấn Backend / System Design]: "Khi lưu trữ đơn hàng thành công vào Database và cần gửi tin nhắn sang Message Broker (Kafka/RabbitMQ), tại sao việc gọi trực tiếp `broker.Publish()` ngay sau câu lệnh `db.Commit()` lại là một Anti-Pattern nguy hiểm? Mẫu thiết kế nào giải quyết triệt để vấn đề này?"

---

- **Nguy cơ Dual-Write (Bất đồng nhất dữ liệu):**
  - Không tồn tại một Distributed Transaction tự nhiên giữa DB và Message Broker.
  - Nếu `db.Commit()` thành công nhưng ngay lúc đó mạng chập chờn hoặc Broker bị sập khiến `broker.Publish()` thất bại $\rightarrow$ Đơn hàng đã lưu trong DB nhưng không có tin nhắn nào được gửi đi (Data Inconsistency / Silent Failure).
  - Ngược lại nếu `broker.Publish()` trước khi commit DB, nếu DB bị Rollback thì khách hàng đã nhận được thông báo giả mạo.

- **Giải pháp triệt để:** **Transactional Outbox Pattern**.
  - Lưu sự kiện cần gửi vào một bảng `outbox` nằm trong **CÙNG MỘT ACID TRANSACTION** với câu lệnh lưu đơn hàng.
  - Một Worker riêng biệt sẽ đọc bảng `outbox` và publish sang Broker (kèm cơ chế Retry có bảo đảm At-Least-Once delivery).

---

Extra: Nếu Database hỗ trợ CDC (Change Data Capture như Debezium đọc Postgres WAL), hệ thống có thể stream bảng outbox sang Kafka mà không cần định kỳ Polling DB.
