---
noteId: 1791469635234
---

Model Factory và Database Seeder phối hợp với nhau như thế nào để sinh dữ liệu giả lập có hệ thống?

---

- **Model Factory:** Đóng vai trò bản vẽ thiết kế (Blueprint) định nghĩa cấu trúc dữ liệu giả lập cho từng Model bằng thư viện `fake()`.
- **Database Seeder:** Đóng vai trò điều phối viên, gọi Factory để bơm số lượng bản ghi mong muốn vào Database qua lệnh `db:seed`.

---

Extra: Cú pháp phối hợp chuẩn trong `DatabaseSeeder.php`: `Product::factory()->count(50)->create();`. Chạy qua CLI: `php artisan db:seed`.
