---
noteId: 1791469635067
---

File `bootstrap/app.php` đảm nhận vai trò trung tâm nào trong kiến trúc Slim Skeleton của Laravel hiện đại?

---

- **Điểm cấu hình hợp nhất:** Đăng ký và nạp toàn bộ cấu hình Routing (`web`, `api`), Middleware pipeline, và Exception handling tập trung.
- **Thay thế Kernel cũ:** Loại bỏ hoàn toàn sự phân mảnh giữa `Kernel.php` và `RouteServiceProvider` từ các phiên bản tiền nhiệm.

---

Extra: Cú pháp chuẩn trong `bootstrap/app.php`: `Application::configure()->withRouting()->withMiddleware()->withExceptions()->create()`.
