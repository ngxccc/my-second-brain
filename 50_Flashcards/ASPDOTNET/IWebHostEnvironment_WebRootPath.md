---
noteId: 1791448210028
---

Để lấy đường dẫn vật lý trỏ đến thư mục tài nguyên tĩnh `wwwroot` trên ổ cứng server, Interface nào bắt buộc phải được inject vào Controller?

---

- **Interface bắt buộc:** **`IWebHostEnvironment`** (thuộc namespace `Microsoft.AspNetCore.Hosting`).
- **Thuộc tính sử dụng:** **`env.WebRootPath`** trả về đường dẫn tuyệt đối tới thư mục `wwwroot`. Dùng hàm `Path.Combine(env.WebRootPath, "uploads", fileName)` để lưu file upload an toàn.

---

Extra: Phân biệt: `ContentRootPath` trỏ đến thư mục gốc của project (chứa code, appsettings), còn `WebRootPath` trỏ đến `wwwroot` chứa file tĩnh.
