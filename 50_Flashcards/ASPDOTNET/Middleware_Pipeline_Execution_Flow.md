---
noteId: 1790761561383
---

Trong ASP.NET Core Middleware Pipeline, điểm khác biệt bản chất giữa `app.Use()` và `app.Run()` là gì?

---

- **`app.Use()`**: Đăng ký middleware thông thường, có thể gọi `await next()` để chuyển giao request sang middleware kế tiếp trong luồng hai chiều.
- **`app.Run()`**: Đăng ký Terminal Middleware (điểm cuối), trực tiếp xử lý và ngắt pipeline, không bao giờ gọi middleware phía sau.

---

Extra: Thứ tự đăng ký middleware trong Program.cs mang tính sống còn: UseAuthentication() bắt buộc phải đứng trước UseAuthorization(). Response đi ngược qua pipeline trước khi về client.
