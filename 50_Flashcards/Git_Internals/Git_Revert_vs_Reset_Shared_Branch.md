---
noteId: 1790159213954
---

Tại sao trên Shared Branch (`main`, `develop`) bắt buộc dùng `git revert` thay vì `git reset` để hủy bỏ commit lỗi?

---

- **Cấm `git reset`**: Lùi `HEAD` và xóa commit buộc phải `push --force`, làm gãy đồ thị DAG và gây xung đột lịch sử của đồng nghiệp.
- **Bắt buộc `git revert`**: Tạo một commit MỚI đảo ngược thay đổi (Append-only history), giúp mọi người `pull` về mượt mà không xung đột.

---

Extra: Khi revert một Merge Commit (có 2 parent), bắt buộc truyền cờ `git revert -m 1 <sha>` để chọn giữ lại đường đi của nhánh chính (Parent 1).
