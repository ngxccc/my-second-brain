---
noteId: 1791469635469
---

Trong một Form Request Class của Laravel, nhiệm vụ phân định của hai phương thức `authorize()` và `rules()` là gì?

---

- **`authorize()` (Phân quyền):** Trả về `boolean` xác định người dùng hiện tại có đủ thẩm quyền gửi request này hay không (trả về 403 Forbidden nếu `false`).
- **`rules()` (Ràng buộc dữ liệu):** Trả về mảng định nghĩa các quy tắc kiểm tra tính hợp lệ của dữ liệu đầu vào (`required`, `email`, `min`, `max`).

---

Extra: Tạo Form Request bằng lệnh `php artisan make:request StoreProductRequest`. Dữ liệu sạch được lấy qua `$request->validated()`.
