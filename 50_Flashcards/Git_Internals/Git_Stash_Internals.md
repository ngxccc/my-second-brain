---
noteId: 1790159213980
---

Bản chất bên dưới của `git stash` tạo ra bao nhiêu commit ẩn trong Git Object Store?

---

- **2 Commit mặc định**: 1 commit lưu ảnh chụp Staging Area (parent là `HEAD`) và 1 merge commit lưu ảnh chụp Working Directory (có 2 parent).

---

Extra: Dùng `git stash -u` sẽ tạo thêm commit thứ 3 lưu file Untracked. Dùng `git stash apply --index` để phục hồi chính xác cả những file đang nằm ở Staging Area.
