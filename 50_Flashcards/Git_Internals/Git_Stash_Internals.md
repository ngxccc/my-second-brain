---
noteId: 1790159213980
---

Bản chất bên dưới của `git stash` tạo ra bao nhiêu commit và liên kết với nhau như thế nào?

---

- **Không có vùng nhớ tạm riêng:** `git stash` tạo commit tạm trỏ vào `refs/stash`.
- **2 Commit mặc định:**
  1. Commit 1: Ảnh chụp Staging Area (parent là `HEAD`).
  2. Commit 2: Ảnh chụp Working Directory (merge commit có 2 cha: `HEAD` và Commit 1).
- **3 Commit (với `-u`):** Thêm 1 commit con lưu riêng các file Untracked.

---

Extra: Dùng `git stash apply --index` để phục hồi chính xác cả những file đang nằm ở Staging Area thay vì dồn hết về Working Directory.
