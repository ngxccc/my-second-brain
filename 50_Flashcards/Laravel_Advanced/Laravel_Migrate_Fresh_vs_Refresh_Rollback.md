---
noteId: 1791469635545
---

Sự khác biệt cốt lõi về cơ chế hoạt động giữa `php artisan migrate:fresh` và `php artisan migrate:refresh` là gì?

---

- **`migrate:fresh`:** Trực tiếp DROP toàn bộ tất cả các bảng trong Database (bỏ qua hàm `down()`), sau đó chạy lại lệnh `migrate` từ đầu.
- **`migrate:refresh`:** Lần lượt thực thi hàm `down()` của toàn bộ các migration đã chạy để rollback, sau đó mới thực thi lại hàm `up()`.

---

Extra: `migrate:fresh` nhanh hơn và tránh được lỗi xung đột khóa ngoại khi viết hàm `down()` thiếu cẩn thận trong môi trường Local Development.
