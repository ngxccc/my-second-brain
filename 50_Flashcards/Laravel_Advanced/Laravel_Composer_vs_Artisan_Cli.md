---
noteId: 1791469635092
---

Sự khác biệt cốt lõi về vai trò giữa Composer và Artisan CLI trong dự án Laravel là gì?

---

- **Composer:** Dependency manager quản lý các package PHP của bên thứ ba được khai báo trong `composer.json` và tải vào `vendor/`.
- **Artisan CLI:** Giao diện dòng lệnh nội bộ của Laravel giúp scaffold mã nguồn, chạy migration, quản lý cache và các tác vụ nền.

---

Extra: Composer cài đặt thư viện hệ thống (`composer require ...`), trong khi Artisan sinh code tự động (`php artisan make:...`).
