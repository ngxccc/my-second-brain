---
noteId: 1790738820367
---

Để chống lỗ hổng Double-Approval (TOCTOU) khi 2 Admin cùng nhấn duyệt một đơn hàng, tầng Database cần phòng ngự như thế nào?

---

- **Atomic Conditional Update**: Chạy `UPDATE quotes SET status = 'APPROVED' WHERE id = :id AND status = 'NEGOTIATING'`; nếu `rows_affected == 0` thì hủy bỏ vì đã có người duyệt trước.

---

Extra: Lựa chọn thứ hai là dùng `SELECT ... FOR UPDATE` trong Transaction (Pessimistic Locking) để khóa độc quyền dòng dữ liệu, ép request sau phải chờ đọc trạng thái mới nhất.
