---
noteId: 1790159214004
---

[Phỏng vấn Git]: "Sau khi `git rebase main` thành công, bạn nhận ra đã rebase nhầm. Hai commit cũ `B` và `C` có bị xóa không? Có thể dùng `git reset HEAD~1` để quay lại trạng thái trước rebase không?"

---

- **Không bị xóa ngay**: Commit cũ `B` và `C` vẫn còn trong Git Object Store, nhưng có thể trở thành unreachable commits nếu không còn branch/tag nào trỏ tới.
- **Không dùng `git reset HEAD~1`**: Lệnh này chỉ lùi đúng 1 commit từ đỉnh hiện tại (ví dụ `C'` về `B'`), không đưa branch về commit gốc `C` trước rebase.
- **Cách đúng sau khi rebase đã hoàn tất**:
  1. Chạy `git reflog`.
  2. Tìm SHA của đỉnh branch cũ trước rebase (`C`).
  3. Chạy `git reset --hard <old-C-sha>`.
- **Nếu rebase đang chạy dở**: dùng `git rebase --abort`.

---

Extra: Rebase tạo commit mới (`B'`, `C'`) vì parent pointer thay đổi; SHA commit phụ thuộc vào tree, metadata, message và parent.
