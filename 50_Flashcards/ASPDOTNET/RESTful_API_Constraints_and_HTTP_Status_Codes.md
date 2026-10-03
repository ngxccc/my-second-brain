---
noteId: 1790774286631
---

Ý nghĩa chuẩn xác của mã HTTP `201 Created` và `204 No Content` trong RESTful API là gì?

---

- **`201 Created`**: Tạo mới tài nguyên thành công (`POST`), bắt buộc đi kèm header `Location` dẫn tới URI của tài nguyên vừa tạo.
- **`204 No Content`**: Thực thi thành công nhưng cố tình không trả về nội dung body (chuẩn mực cho thao tác `DELETE`).

---

Extra: 200 OK dùng cho GET/PUT; 400 Bad Request cho lỗi validation; 404 Not Found khi không tìm thấy tài nguyên; 500 Internal Server Error cho ngoại lệ server.
