---
noteId: 1789565951402
---

Trong PostgreSQL MVCC, hai trường ẩn `xmin` và `xmax` quyết định khả năng nhìn thấy (Visibility) của một Tuple như thế nào?

---

- **`xmin` (Insert XID)**: Dòng chỉ hiển thị khi transaction tạo ra nó đã commit trước Snapshot hiện tại.
- **`xmax` (Delete/Update XID)**: Dòng còn hiệu lực nếu transaction xóa/sửa chưa commit hoặc bằng 0.

---

Extra: Khi thực hiện `UPDATE`, Postgres tạo một Tuple mới với `xmin` mới và ghi XID hiện tại vào `xmax` của Tuple cũ. Khi khóa bằng `FOR UPDATE`, XID giữ khóa cũng ghi tạm vào `xmax`.
