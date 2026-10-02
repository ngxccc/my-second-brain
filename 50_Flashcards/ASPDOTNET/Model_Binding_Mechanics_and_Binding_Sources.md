---
noteId: 1790761561405
---

Bốn thuộc tính Binding Source chính trong ASP.NET Core (`[FromQuery]`, `[FromRoute]`, `[FromBody]`, `[FromForm]`) lấy dữ liệu từ đâu?

---

- **`[FromQuery]`:** Lấy từ chuỗi truy vấn URL sau dấu chấm hỏi (`?page=1&size=20`).
- **`[FromRoute]`:** Lấy từ các tham số trong đường dẫn URL (`/users/{id}`).
- **`[FromBody]`:** Đọc từ HTTP Request Body thông qua định dạng JSON/XML (dùng Formatter).
- **`[FromForm]`:** Đọc từ dữ liệu form gửi lên qua `multipart/form-data` hoặc `application/x-www-form-urlencoded`.

---

Extra: Trong Controller gắn `[ApiController]`, ASP.NET Core tự động áp dụng quy tắc suy luận nguồn: Kiểu dữ liệu phức tạp mặc định đọc từ `[FromBody]`, kiểu dữ liệu nguyên thủy đọc từ `[FromQuery]` hoặc `[FromRoute]`.
