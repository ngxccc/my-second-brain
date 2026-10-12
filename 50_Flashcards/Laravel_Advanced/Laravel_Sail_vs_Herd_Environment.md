---
noteId: 1791469635817
---

Tiêu chí quyết định lựa chọn môi trường phát triển giữa Laravel Sail và Laravel Herd là gì?

---

- **Laravel Sail:** Chạy trên Docker container, đảm bảo môi trường đồng nhất 100% giữa các thành viên nhóm và production (yêu cầu cấu hình RAM >= 8GB).
- **Laravel Herd:** Chạy trực tiếp native trên macOS/Windows, siêu nhẹ, khởi động tức thì, không phụ thuộc Docker daemon.

---

Extra: Sail khởi chạy ngầm bằng lệnh `./vendor/bin/sail up -d`, còn Herd quản lý các phiên bản PHP qua giao diện GUI.
