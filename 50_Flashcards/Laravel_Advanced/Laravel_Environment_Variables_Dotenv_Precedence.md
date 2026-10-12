---
noteId: 1791469635441
---

Khi thay đổi thông số cấu hình trong file `.env` lúc ứng dụng đang chạy, tại sao cần khởi động lại server hoặc xóa cache?

---

- **Cơ chế nạp môi trường:** Laravel nạp biến `.env` vào bộ nhớ lúc boot; khi `config:cache` được bật, hàm `env()` sẽ luôn trả về `null` ngoài các file cấu hình.
- **Thao tác bắt buộc:** Phải chạy `php artisan config:clear` hoặc restart dev server (`php artisan serve`) để cập nhật biến môi trường mới.

---

Extra: Tuyệt đối không gọi trực tiếp hàm `env()` trong Controller hoặc Model trên production; luôn truy xuất qua hàm `config('services.key')`.
