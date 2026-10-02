---
noteId: 1790159213954
---

Tại sao trên Shared Branch (`main`, `develop`) bắt buộc dùng `git revert` thay vì `git reset` để hủy bỏ commit lỗi?

---

- **Cấm `git reset`:** Lùi con trỏ `HEAD` và xóa commit $\rightarrow$ buộc phải `push --force`, làm gãy đồ thị DAG của đồng nghiệp và gây xung đột/hồi sinh commit khi họ `pull`.
- **Bắt buộc `git revert`:** Tạo một commit MỚI đảo ngược thay đổi, lịch sử luôn tăng dần (Append-only), đồng nghiệp `pull` về mượt mà không xung đột.

---

Extra: Khi revert một **Merge Commit** (commit có 2 parent), bắt buộc phải truyền cờ `git revert -m 1 <sha>` để chọn giữ lại đường đi của nhánh chính (Parent 1).
