---
noteId: 1790738820486
---

Trong hệ quản trị CSDL giao dịch, hai cơ chế kỹ thuật cốt lõi nào bảo đảm tính Atomicity và Durability?

---

- **Atomicity**: Write-Ahead Logging (WAL) / Undo Log cho phép rollback toàn bộ thay đổi khi giao dịch bị lỗi.
- **Durability**: Ghi fsync WAL xuống đĩa trước khi trả về kết quả commit thành công.

---

Extra: Isolation được bảo đảm qua MVCC / 2PL; Consistency phụ thuộc Schema Constraints và Application Invariants. Mức cô lập mặc định trong Postgres là READ COMMITTED.
