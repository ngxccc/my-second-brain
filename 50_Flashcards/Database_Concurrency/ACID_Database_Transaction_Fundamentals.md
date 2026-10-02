---
noteId: 1790738820486
---

Bốn thuộc tính ACID trong Database giao dịch được bảo đảm bằng các cơ chế kỹ thuật nào?

---

- **Atomicity (Nguyên tử):** Đảm bảo qua Undo Log / Write-Ahead Logging (WAL) để rollback khi lỗi.
- **Consistency (Nhất quán):** Đảm bảo qua Foreign Keys, Unique Constraints và Application Rules.
- **Isolation (Cô lập):** Đảm bảo qua MVCC (Multi-Version Concurrency Control) và 2-Phase Locking (2PL).
- **Durability (Bền vững):** Đảm bảo qua việc ghi Redo Log / WAL xuống đĩa trước khi commit (Flush-to-disk).

---

Extra: Trong PostgreSQL, mức cô lập mặc định là `READ COMMITTED`. Để chống Race Condition tuyệt đối khi đọc-sửa-ghi, ta kết hợp thêm `SELECT ... FOR UPDATE` (Pessimistic Locking).
