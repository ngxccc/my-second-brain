---
noteId: 1790159213882
---

Lệnh `git branch -d` khác gì `-D`? Khi xóa một nhánh, commit có bị xóa mất không và làm sao để khôi phục nhánh đã xóa?

---

- **`-d` vs `-D`:**
  - `git branch -d`: Xóa an toàn. Git chặn xóa nếu nhánh chưa được merge.
  - `git branch -D`: Xóa ép buộc, bỏ qua kiểm tra merge.
- **Commit không hề bị mất:** Xóa branch chỉ xóa con trỏ 41 bytes trong `.git/refs/heads/`. Toàn bộ commit vẫn nằm nguyên trong `.git/objects/`.
- **Quy trình 2 bước khôi phục:**
  1. Chạy `git reflog` tìm lại Commit SHA cuối cùng của nhánh vừa xóa.
  2. Chạy `git branch <tên-nhánh> <commit-sha>` để tạo lại con trỏ branch.

---

Extra: Các commit mồ côi (Dangling Commits) vẫn tồn tại ít nhất 30 đến 90 ngày trước khi lệnh dọn rác ngầm `git gc` xóa vĩnh viễn.
