---
noteId: 1790159213980
---

Bản chất bên dưới của `git stash` là gì? Có phải Git lưu các thay đổi vào một vùng nhớ tạm độc lập không?

---

- **Không có vùng nhớ tạm riêng**: `git stash` thực chất **tạo 2 (hoặc 3) commit tạm thời** gắn vào một con trỏ tham chiếu đặc biệt là `.git/refs/stash`.
- **Cấu trúc 2 Commit mặc định:**
  1. Commit 1: Lưu ảnh chụp của **Staging Area** (cha là `HEAD`).
  2. Commit 2: Lưu ảnh chụp của **Working Directory** (có 2 cha: `HEAD` và Commit 1).
- **Cấu trúc 3 Commit (khi dùng `git stash -u`):** Thêm 1 Commit thứ 3 lưu riêng các file **Untracked**.
- **Ngăn xếp `stash@{0}`, `stash@{1}`:** Được quản lý thông qua nhật ký `reflog` của con trỏ `refs/stash`.

---

Extra: Dùng `git stash apply --index` để phục hồi chính xác cả những file đang nằm ở Staging Area thay vì dồn hết về Working Directory.
