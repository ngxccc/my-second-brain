---
noteId: 1790738820388
---

Khi thiết kế REST API, khi nào bắt buộc dùng mã HTTP `201 Created` và khi nào nên dùng `200 OK` cho một request `POST` có phát sinh bản ghi mới trong Database?

---

- **`201 Created` (Resource Creation - CRUD):**
  - Dùng khi mục đích chính của request là **sinh ra một Tài nguyên độc lập mới (New Resource)** trên một collection (ví dụ: `POST /api/v1/orders`, `POST /api/v1/products`).
  - Theo chuẩn RFC 9110, phản hồi nên đi kèm Header `Location: /api/v1/orders/{id}` để chỉ định URI của tài nguyên vừa tạo.
- **`200 OK` (RPC Action / State Transition):**
  - Dùng cho các endpoint thực thi một **Hành động Nghiệp vụ hoặc Chuyển đổi trạng thái** (ví dụ: `POST /api/v1/quotes/:id/approve-to-order`, `POST /api/v1/auth/login`, `POST /api/v1/payments/verify`).
  - Dù bên dưới có tạo bản ghi mới (như tạo `orders`, sinh `refresh_tokens`, ghi `audit_logs`), bản chất của request là xử lý logic và trả về kết quả trạng thái thành công.

---

Extra: Trong NestJS, decorator `@Post()` mặc định luôn trả về `201 Created`. Để trả về `200 OK` cho các Action endpoints, lập trình viên gắn thêm decorator `@HttpCode(HttpStatus.OK)`.
