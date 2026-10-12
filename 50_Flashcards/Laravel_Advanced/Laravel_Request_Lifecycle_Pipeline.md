---
noteId: 1791469635670
---

Một HTTP Request gửi đến ứng dụng Laravel đi qua các trạm xử lý cốt lõi nào theo đúng thứ tự?

---

- **Tuyến đường xử lý:** Request đi qua `public/index.php` -> HTTP Kernel (`bootstrap/app.php`) -> Middleware pipeline -> Routing (`routes/web.php`) -> Controller.
- **Hoàn tất phản hồi:** Controller truy vấn Model/Database, trả dữ liệu qua View (Blade) hoặc Response (JSON) ngược lại client.

---

Extra: Middleware đóng vai trò bộ lọc tiền xử lý (authentication, CSRF, throttling) trước khi request chạm đến Controller logic.
