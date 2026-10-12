---
noteId: 1791469635517
---

Trong kiến trúc Laravel 11+, Middleware Alias được đăng ký ở đâu và bằng phương thức cấu hình nào?

---

- **Vị trí đăng ký:** Đăng ký tập trung trong tệp `bootstrap/app.php` bên trong closure `withMiddleware(function (Middleware $middleware) { ... })`.
- **Cú pháp gán Alias:** Sử dụng `$middleware->alias(['admin' => CheckAdmin::class]);` để đặt tên định danh cho middleware sử dụng trong routing.

---

Extra: Có thể đăng ký middleware toàn cục bằng `$middleware->append(...)` hoặc thêm vào nhóm web/api bằng `$middleware->web(append: [...])`.
