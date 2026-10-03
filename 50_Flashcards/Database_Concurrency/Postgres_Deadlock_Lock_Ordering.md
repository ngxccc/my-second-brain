---
noteId: 1789565951214
---

Nguyên tắc bất biến (Invariant) nào giúp lập trình viên triệt tiêu hoàn toàn nguy cơ Deadlock khi khóa nhiều bản ghi?

---

- **Lock Ordering Invariant**: Luôn sắp xếp thứ tự khóa tài nguyên theo một chiều cố định (ví dụ theo chiều tăng dần của ID) trên mọi luồng giao dịch.

---

Extra: Hiện tượng Deadlock xảy ra khi Tx1 giữ A chờ B, còn Tx2 giữ B chờ A $\rightarrow$ Chờ nhau vĩnh viễn đến khi timeout. Luôn sort ID trước khi thực hiện `SELECT ... FOR UPDATE`.
