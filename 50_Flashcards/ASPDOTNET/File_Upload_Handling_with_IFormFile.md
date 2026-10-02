---
noteId: 1790761561280
---

Trong ASP.NET Core, làm thế nào để tiếp nhận và lưu trữ file tải lên bằng interface `IFormFile`, và các biện pháp bảo mật tối thiểu là gì?

---

- **Tiếp nhận file qua `IFormFile`:**
  - Trên Form HTML bắt buộc phải có thuộc tính mã hóa: `enctype="multipart/form-data"` và phương thức `method="post"`.
  - Trên Action Controller, khai báo tham số hoặc property trong Model có kiểu `IFormFile fileUpload`.
- **Quy trình lưu trữ an toàn trên Server:**
  1. **Kiểm tra hợp lệ:** Kiểm tra `fileUpload != null && fileUpload.Length > 0`. Kiểm tra kích thước file để ngăn tấn công làm tràn đĩa cứng (DoS).
  2. **Kiểm tra phần mở rộng (Extension Whitelist):** Chỉ chấp nhận các đuôi file an toàn (ví dụ: `.jpg`, `.png`, `.pdf`), tuyệt đối cấm các file thực thi (`.exe`, `.dll`, `.cshtml`, `.php`).
  3. **Đổi tên file ngẫu nhiên:** Không bao giờ dùng tên file gốc từ client (`fileUpload.FileName`). Bắt buộc sinh tên mới duy nhất bằng `Guid.NewGuid().ToString() + Path.GetExtension(fileUpload.FileName)` để chống ghi đè file hoặc chèn mã độc Path Traversal.
  4. **Lưu file bất đồng bộ:**
     ```csharp
     var filePath = Path.Combine(webHostEnvironment.WebRootPath, "uploads", newFileName);
     using (var stream = new FileStream(filePath, FileMode.Create)) {
         await fileUpload.CopyToAsync(stream);
     }
     ```

---

Extra: Không bao giờ lưu file trực tiếp vào thư mục gốc của ứng dụng; lưu trong `wwwroot/uploads` nếu công khai hoặc lưu ngoài `wwwroot` kèm Controller phân quyền nếu là tài liệu bảo mật.
