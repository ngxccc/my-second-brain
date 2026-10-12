---
noteId: 1791469635288
---

Trong Eloquent Model, quy ước đặt tên hàm Local Query Scope là gì và cú pháp gọi thực thi ở Controller như thế nào?

---

- **Quy ước định nghĩa:** Hàm trong Model bắt buộc phải có tiền tố `scope` theo dạng camelCase, ví dụ: `public function scopeActive($query)`.
- **Cú pháp gọi truy vấn:** Loại bỏ tiếp đầu ngữ `scope` khi gọi chuỗi truy vấn ngoài Controller, ví dụ: `Product::active()->get()`.

---

Extra: Local Scope giúp tái sử dụng các điều kiện lọc phức tạp (DRY), có thể nhận thêm tham số: `scopeOfType($query, $type)`.
