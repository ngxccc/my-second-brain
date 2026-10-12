---
noteId: 1791469635340
---

Sự khác biệt về chiến lược bảo mật giữa `$fillable` và `$guarded` trong Eloquent Model khi nhận dữ liệu mảng là gì?

---

- **`$fillable` (Whitelist):** Chỉ định danh sách tường minh các trường ĐƯỢC PHÉP gán hàng loạt (an toàn, khuyến nghị sử dụng).
- **`$guarded` (Blacklist):** Chỉ định các trường BỊ CẤM gán hàng loạt (ví dụ `['id', 'is_admin']`), tất cả các trường còn lại đều được gán.

---

Extra: Nếu truyền trường không nằm trong `$fillable` khi gọi `Product::create($data)`, Eloquent sẽ âm thầm bỏ qua trường đó để phòng thủ Mass Assignment.
