---
noteId: 1791469635594
---

Vai trò đối nghịch giữa phương thức `up()` và `down()` trong một tệp Migration của Laravel là gì?

---

- **Phương thức `up()`:** Thực thi các thao tác tạo mới hoặc thay đổi cấu trúc Database (tạo bảng, thêm cột, tạo index, gắn khóa ngoại).
- **Phương thức `down()`:** Đảo ngược chính xác các thao tác mà `up()` đã làm (xóa bảng `dropIfExists`, drop cột) phục vụ cho tác vụ rollback.

---

Extra: Nếu phương thức `down()` viết thiếu hoặc sai lệch logic đảo ngược, việc chạy lệnh `php artisan migrate:rollback` sẽ ném ngoại lệ SQL lỗi.
