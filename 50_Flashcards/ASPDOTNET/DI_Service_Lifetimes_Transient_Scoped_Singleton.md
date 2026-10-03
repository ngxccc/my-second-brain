---
noteId: 1790761561256
---

Ba cấp độ vòng đời Service trong Dependency Injection của ASP.NET Core khác nhau như thế nào?

---

- **Transient vs Scoped**: Transient tạo instance mới mỗi lần yêu cầu; Scoped tạo 1 instance duy nhất cho mỗi HTTP Request (chuẩn cho DbContext).
- **Singleton**: Tạo 1 instance duy nhất trong suốt vòng đời của toàn bộ ứng dụng (dùng cho in-memory cache, background worker).

---

Extra: Tránh lỗi Captive Dependency khi inject service có vòng đời ngắn (Scoped/Transient) vào service sống lâu (Singleton). Container tự động dọn dẹp các service IDisposable khi hết vòng đời.
