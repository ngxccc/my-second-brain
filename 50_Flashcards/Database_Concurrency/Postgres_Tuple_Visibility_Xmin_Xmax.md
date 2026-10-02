---
noteId: 1789565951402
---

PostgreSQL bảo đảm tính năng cô lập dữ liệu MVCC thông qua hai trường ẩn `xmin` và `xmax` trong Tuple như thế nào?

---

- **`xmin`:** Transaction ID (XID) của giao dịch đã tạo ra (INSERT) dòng dữ liệu này. Dòng chỉ hiển thị khi `xmin` đã commit trước Snapshot hiện tại.
- **`xmax`:** XID của giao dịch đã cập nhật hoặc xóa dòng dữ liệu này (UPDATE/DELETE). Nếu `xmax` chưa commit hoặc là 0, dòng vẫn còn hiệu lực.
- **Cơ chế UPDATE:** Thực chất là tạo một Tuple mới với `xmin` mới và ghi XID hiện tại vào `xmax` của Tuple cũ.

---

Extra: Khi một hàng bị khóa bằng `SELECT FOR UPDATE`, ID của transaction giữ khóa cũng được lưu tạm thời vào trường `xmax`.
