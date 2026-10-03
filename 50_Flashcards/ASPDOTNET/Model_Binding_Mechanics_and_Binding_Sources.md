---
noteId: 1790761561405
---

Bốn thuộc tính Binding Source chính trong ASP.NET Core lấy dữ liệu từ đâu?

---

- **`[FromQuery]` & `[FromRoute]`**: Lấy từ URL (chuỗi query sau dấu `?` hoặc path parameter trong route URL).
- **`[FromBody]` & `[FromForm]`**: Lấy từ HTTP Body (chuỗi JSON qua Body Formatters hoặc form `multipart/form-data`).

---

Extra: Trong Controller gắn `[ApiController]`, framework tự suy luận nguồn: Object phức tạp mặc định đọc từ [FromBody], kiểu nguyên thủy đọc từ [FromQuery] hoặc [FromRoute].
