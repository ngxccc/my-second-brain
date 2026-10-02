---
noteId: 1790738820367
---

Tại sao kiểm tra Finite State Machine (FSM) ở tầng ứng dụng vẫn bị lỗ hổng Double-Approval (TOCTOU) khi 2 Admin cùng nhấn duyệt, và cách phòng thủ chuẩn mực tại tầng Database là gì?

---

- **Lỗ hổng (TOCTOU Race Condition):** 2 requests đồng thời cùng đọc trạng thái `NEGOTIATING` trước khi bên nào kịp ghi nhận $\rightarrow$ cả 2 cùng vượt qua kiểm tra FSM và tạo 2 Đơn hàng độc lập.
- **Phòng thủ tại Database:**
  - **Cách 1 (Pessimistic Locking):** Dùng `SELECT ... FOR UPDATE` trong Transaction để khóa độc quyền dòng dữ liệu, ép request sau phải chờ đọc trạng thái mới nhất.
  - **Cách 2 (Atomic Conditional Update):** `UPDATE quotes SET status = 'APPROVED' WHERE id = $1 AND status = 'NEGOTIATING'`. Nếu `rows_affected == 0`, rollback toàn bộ.

---

Extra: Lựa chọn thay thế không dùng khóa dài là **Atomic Conditional Update**: `UPDATE quotes SET status = 'APPROVED' WHERE id = $1 AND status = 'NEGOTIATING'`. Nếu `rows_affected == 0`, hủy bỏ việc tạo Order.
