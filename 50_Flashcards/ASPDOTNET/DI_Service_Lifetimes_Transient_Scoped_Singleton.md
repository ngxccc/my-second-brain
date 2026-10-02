---
noteId: 1790761561256
---

Ba cấp độ vòng đời Service trong Dependency Injection của ASP.NET Core khác nhau như thế nào?

---

- **Transient:** Cấp phát một instance mới mỗi lần được yêu cầu (nhẹ, không lưu trạng thái).
- **Scoped:** Cấp phát 1 instance duy nhất cho mỗi HTTP Request (chuẩn cho `DbContext` và Service tầng nghiệp vụ).
- **Singleton:** Tạo 1 instance duy nhất trong suốt vòng đời của toàn bộ ứng dụng (cho In-memory cache, background worker).

---

Extra: Trong ASP.NET Core, các service được đăng ký tại `builder.Services` trong `Program.cs`. Container chịu trách nhiệm tự động dọn dẹp các service implement `IDisposable` khi hết vòng đời.
