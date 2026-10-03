---
noteId: 1790761561280
---

Hai bước bảo mật tối thiểu bắt buộc khi tiếp nhận file tải lên qua `IFormFile` trong ASP.NET Core là gì?

---

- **Kiểm tra Extension Whitelist**: Chỉ chấp nhận đuôi file an toàn (`.jpg`, `.png`, `.pdf`), tuyệt đối cấm file thực thi (`.exe`, `.cshtml`, `.dll`).
- **Đổi tên file ngẫu nhiên**: Luôn sinh tên ngẫu nhiên (`Guid.NewGuid() + extension`) thay vì dùng tên gốc từ client để chống ghi đè và Path Traversal.

---

Extra: Trên Form HTML bắt buộc có `enctype="multipart/form-data"`. Lưu file bất đồng bộ qua `await fileUpload.CopyToAsync(stream)`. Lưu ngoài wwwroot nếu cần bảo mật.
