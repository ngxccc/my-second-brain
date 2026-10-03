---
noteId: 1790738820315
---

Làm thế nào để biến một thao tác Non-Idempotent (như `POST /payments/charge`) thành Idempotent?

---

- **Idempotency Key Pattern**: Client gửi UUID duy nhất qua header `Idempotency-Key`; Server dùng khóa nguyên tử lưu key, nếu đã xử lý thì trả ngay kết quả cũ trong cache.

---

Extra: Trong HTTP chuẩn, các method `GET`, `PUT`, `DELETE` có tính Idempotent tự nhiên; trong khi `POST` và `PATCH` bắt buộc phải được bảo vệ bằng Idempotency Key hoặc FSM Guard.
