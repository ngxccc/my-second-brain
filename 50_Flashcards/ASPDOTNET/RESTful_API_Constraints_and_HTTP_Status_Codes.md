---
noteId: 1790774286631
---

Trong RESTful API của ASP.NET Core, ý nghĩa chuẩn xác của 6 mã trạng thái HTTP kinh điển là gì?

---

- **`200 OK`**: Thực thi thành công cho thao tác Đọc (`GET`) hoặc Cập nhật (`PUT`).
- **`201 Created`**: Tạo mới thành công (`POST`). Bắt buộc kèm Header `Location` dẫn tới URI vừa tạo.
- **`204 No Content`**: Thực thi thành công nhưng cố tình không trả về nội dung body (chuẩn cho `DELETE`).
- **`400 Bad Request`**: Dữ liệu gửi lên sai định dạng hoặc vi phạm Validation.
- **`404 Not Found`**: Không tìm thấy tài nguyên theo ID yêu cầu trong Database.
- **`500 Internal Server Error`**: Ngoại lệ ngoài ý muốn phát sinh phía máy chủ.

---

Extra: Sử dụng các hàm trợ giúp của `ControllerBase`: `Ok()`, `CreatedAtAction()`, `NoContent()`, `BadRequest()`, `NotFound()`.
