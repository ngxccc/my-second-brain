---
noteId: 1790159214004
---

Sau khi `git rebase main` hoàn tất và nhận ra đã rebase nhầm, tại sao không thể dùng `git reset HEAD~1` để hoàn tác và cách giải quyết chuẩn là gì?

---

- **Không dùng `HEAD~1`**: Rebase tạo các commit mới; lùi `HEAD~1` chỉ lùi 1 commit mới chứ không đưa nhánh về commit gốc trước rebase.
- **Hoàn tác chuẩn qua Reflog**: Chạy `git reflog` tìm SHA đỉnh cũ trước rebase, rồi chạy `git reset --hard <old-sha>`.

---

Extra: Nếu rebase đang chạy dở chưa xong, dùng `git rebase --abort`. Rebase thay đổi SHA vì parent pointer thay đổi.
