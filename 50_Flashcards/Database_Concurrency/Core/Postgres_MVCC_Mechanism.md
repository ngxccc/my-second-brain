---
noteId: 1789565951238
---

Trong PostgreSQL, tại sao câu lệnh `SELECT` (đọc) không bao giờ bị khóa chờ bởi câu lệnh `UPDATE` (ghi) đang chạy đồng thời?

---

Nhờ cơ chế **MVCC (Multi-Version Concurrency Control)**.
Khi `UPDATE`, PostgreSQL **không sửa đè** mà giữ nguyên hàng cũ và ghi một Tuple phiên bản mới lên đĩa. Câu lệnh `SELECT` chụp Snapshot và đọc bản Tuple cũ hợp lệ $\rightarrow$ Không cần tranh chấp Lock.

---

Extra: Hệ quả vật lý là sinh ra **Dead Tuples** chiếm dụng đĩa và đòi hỏi tiến trình ngầm **AutoVacuum** phải quét dọn định kỳ.
