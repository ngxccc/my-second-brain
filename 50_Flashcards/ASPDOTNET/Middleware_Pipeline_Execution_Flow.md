---
noteId: 1790761561383
---

Luồng đi của một HTTP Request trong kiến trúc ASP.NET Core Middleware Pipeline diễn ra như thế nào, và điểm khác biệt bản chất giữa `app.Use()` và `app.Run()` là gì?

---

- **Cơ chế Pipeline hai chiều (Bidirectional Pipeline):**
  - Mọi HTTP Request gửi tới ứng dụng được Kestrel Server tiếp nhận và đẩy tuần tự qua một chuỗi các Middleware đã đăng ký trong `Program.cs`.
  - Mỗi Middleware xử lý logic trước (Request Phase), sau đó gọi `await next()` để chuyển giao quyền thực thi cho Middleware tiếp theo.
  - Khi Middleware cuối cùng (Terminal Middleware hoặc Controller Action) sinh ra kết quả, HTTP Response sẽ đi ngược trở lại qua chuỗi Middleware đó (Response Phase) trước khi gửi về Client.
- **Phân biệt `app.Use()` và `app.Run()`:**
  - **`app.Use(async (context, next) => { ... })`**: Đăng ký một Middleware có khả năng gọi `next()` để chuyển giao Request sang Middleware kế tiếp.
  - **`app.Run(async context => { ... })`**: Đăng ký một **Terminal Middleware (Middleware điểm cuối)**. Nó trực tiếp xử lý và ngắt Pipeline, không bao giờ gọi tiếp các Middleware nằm bên dưới nó trong file cấu hình.

---

Extra: Thứ tự đăng ký Middleware trong `Program.cs` mang tính sống còn. Ví dụ: `app.UseAuthentication()` bắt buộc phải đứng TRƯỚC `app.UseAuthorization()`, vì hệ thống phải biết người dùng là ai trước khi kiểm tra quyền hạn.
