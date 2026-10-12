---
noteId: 1791469635390
---

Theo quy ước mặc định của Eloquent ORM, tên Model, tên Table trong Database và Primary Key được ánh xạ như thế nào?

---

- **Model & Table:** Model là danh từ số ít ở dạng PascalCase (ví dụ `Product`), Table là danh từ số nhiều snake_case (ví dụ `products`).
- **Primary Key & Timestamps:** Mặc định cột khóa chính mang tên `id` kiểu số nguyên tự tăng, cùng hai cột thời gian `created_at` và `updated_at`.

---

Extra: Có thể ghi đè quy ước bằng các thuộc tính: `protected $table = 'my_table';`, `protected $primaryKey = 'uid';`, `public $timestamps = false;`.
