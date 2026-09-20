---
noteId: 1789565951402
---

Trong cấu trúc vật lý của một Tuple Header (PostgreSQL), trường ẩn nào xác định Transaction đã sinh ra và Transaction đã cập nhật/xóa hàng đó?

---

- **`xmin`**: Transaction ID của giao dịch đã chèn (`INSERT`) Tuple.
- **`xmax`**: Transaction ID của giao dịch đã cập nhật (`UPDATE`) hoặc xóa (`DELETE`) Tuple ($xmax = 0$ nếu hàng vẫn còn hiệu lực).

---

Extra: Khi một hàng bị khóa bằng `SELECT FOR UPDATE`, ID của transaction giữ khóa cũng được lưu tạm thời vào trường `xmax`.
