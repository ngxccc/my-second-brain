---
noteId: 1791469635692
---

Lệnh `php artisan make:controller PostController --resource` tự động sinh ra 7 phương thức chuẩn RESTful nào?

---

- **Danh sách 7 Actions:** `index` (danh sách), `create` (form tạo), `store` (lưu mới), `show` (chi tiết), `edit` (form sửa), `update` (cập nhật), `destroy` (xóa).
- **Khai báo định tuyến:** Chỉ cần một dòng duy nhất `Route::resource('posts', PostController::class);` để map toàn bộ 7 endpoints.

---

Extra: Để giới hạn bớt actions nhằm tối ưu bề mặt API, dùng chained methods `only(['index', 'show'])` hoặc `except(['destroy'])`.
