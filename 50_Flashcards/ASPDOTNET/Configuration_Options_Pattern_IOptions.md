---
noteId: 1791448209950
---

Phương pháp an toàn và Strongly-typed nhất để đọc cấu hình phân cấp từ `appsettings.json` trong ASP.NET Core là gì?

---

- **Phương pháp chuẩn mực:** Sử dụng **Options Pattern (`IOptions<T>`)**. Ánh xạ section trong JSON thành một class POCO C# tương ứng.
- **Lợi ích cốt lõi:**
  - Hỗ trợ kiểm tra kiểu tĩnh (Strongly-typed) ngay lúc biên dịch, tránh gõ nhầm chuỗi magic string.
  - Hỗ trợ reload tự động khi file cấu hình đổi qua `IOptionsSnapshot<T>` (Scoped) hoặc `IOptionsMonitor<T>` (Singleton).

---

Extra: Cú pháp đăng ký trong `Program.cs`: `builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));`.
