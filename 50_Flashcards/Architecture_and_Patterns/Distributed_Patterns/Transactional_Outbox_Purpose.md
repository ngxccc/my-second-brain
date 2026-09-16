---
noteId: 1783153909330
---

Mô hình Transactional Outbox Pattern giải quyết bài toán gì trong hệ thống kiến trúc phân tán hoặc Microservices?

---

Giải quyết triệt để **Bài toán Ghi Kép (Dual-Write Problem)** giữa Database và Message Broker (hoặc Email/Third-party Service).

Thay vì vừa ghi vào Database vừa gọi API bên ngoài (dễ gây lỗi mất nhất quán nếu 1 trong 2 bước sập), ứng dụng sẽ **ghi dữ liệu nghiệp vụ và sự kiện outbox vào chung một ACID Database Transaction**, sau đó có Worker quét bảng và gửi đi sau.

---

Extra: Bảo đảm tính chất gửi tin **At-Least-Once Delivery**: Không bao giờ bị mất sự kiện ngay cả khi server bị sập nguồn đột ngột.
