---
noteId: 1790774286588
---

Gắn thuộc tính `[ApiController]` lên Controller giúp tự động hóa hai hành vi cốt lõi nào?

---

- **Tự động bắt lỗi Validation**: Tự chặn request và trả về mã `400 Bad Request` (ProblemDetails) nếu dữ liệu sai ràng buộc mà không cần check `ModelState.IsValid`.
- **Tự động suy luận Binding**: Tự đọc Object phức tạp từ JSON Body và biến đơn giản từ URL Query/Route; bắt buộc dùng Attribute Routing.

---

Extra: Tiêu chuẩn hóa định dạng lỗi theo RFC 7807 ProblemDetails. Ngăn chặn việc gọi nhầm qua cơ chế routing của trang web MVC truyền thống.
