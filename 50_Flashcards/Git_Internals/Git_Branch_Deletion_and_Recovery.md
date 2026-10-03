---
noteId: 1790159213882
---

Khi xóa một nhánh bằng `git branch -D`, dữ liệu commit có bị mất khỏi Git Object Store không và làm thế nào để khôi phục?

---

- **Không mất commit**: Xóa branch chỉ xóa con trỏ 41 bytes trong `.git/refs/heads/`; các commit object vẫn nằm nguyên trong `.git/objects/`.
- **Khôi phục qua Reflog**: Chạy `git reflog` lấy lại Commit SHA của đỉnh nhánh cũ, rồi tạo lại bằng `git branch <tên-nhánh> <commit-sha>`.

---

Extra: Cờ `-d` xóa an toàn (chặn nếu chưa merge); `-D` ép xóa vô điều kiện. Các commit mồ côi (dangling) được `git gc` giữ tối thiểu 30-90 ngày.
