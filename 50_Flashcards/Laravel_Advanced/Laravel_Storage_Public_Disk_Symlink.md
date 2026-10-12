---
noteId: 1791469635895
---

Tại sao file tải lên thư mục `storage/app/public` không thể truy cập trực tiếp qua URL nếu chưa chạy lệnh `php artisan storage:link`?

---

- **Nguyên lý Web Server:** Web server chỉ mở quyền truy cập công khai vào thư mục gốc `public/`; thư mục `storage/` nằm ngoài document root để bảo mật.
- **Vai trò Symbolic Link:** Lệnh `storage:link` tạo liên kết mềm từ `public/storage` trỏ sang `storage/app/public`, cho phép browser tải file tĩnh.

---

Extra: Sau khi tạo symlink, URL công khai của file được sinh thông qua hàm helper `asset('storage/avatars/' . $filename)`.
