---
noteId: 1790738820388
---

Khi thiết kế REST API, khi nào dùng mã HTTP `201 Created` và khi nào nên dùng `200 OK` cho một request `POST`?

---

- **`201 Created`**: Dùng khi mục đích chính là sinh ra một Tài nguyên độc lập mới trên collection (thường kèm header `Location: /res/{id}`).
- **`200 OK`**: Dùng cho endpoint thực thi một Hành động nghiệp vụ hoặc Chuyển đổi trạng thái (như approve, login, verify).

---

Extra: Dù endpoint hành động có tạo bản ghi ngầm trong DB (như audit log, refresh token), bản chất request là xử lý logic và trả về kết quả thành công nên dùng 200 OK.
