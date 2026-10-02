---
noteId: 1790738820315
---

Idempotency là gì và làm sao để biến một thao tác Non-Idempotent (như `POST /payments/charge`) thành Idempotent?

---

- **Bản chất Idempotency:** Dù client gọi 1 lần hay $N$ lần với cùng tham số, trạng thái tài nguyên trên server và kết quả trả về không đổi.
- **Giải pháp Idempotency Key:**
  - Client sinh mã UUID duy nhất gắn vào Header (`Idempotency-Key`).
  - Server lưu key vào Redis/Database kèm khóa nguyên tử (Atomic Lock/Unique Constraint).
  - Nếu key đã xử lý: trả ngay kết quả đã lưu trong cache mà không thực thi thanh toán lần 2.

---

Extra: Trong HTTP chuẩn, các method `GET`, `PUT`, `DELETE`, `HEAD` có tính chất Idempotent tự nhiên; trong khi `POST` và `PATCH` là Non-Idempotent và bắt buộc phải được bảo vệ bằng Idempotency Key hoặc FSM Guard.
