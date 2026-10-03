---
noteId: 1789915064958
---

Khi thực thi `git reset --hard HEAD~1`, số phận của tập tin Untracked và Tracked khác nhau như thế nào?

---

- **Untracked files (An toàn)**: Git không quản lý nên giữ nguyên vẹn trên đĩa (chỉ bị xóa khi chạy `git clean -f`).
- **Tracked files (Mất vĩnh viễn)**: Mọi sửa đổi chưa commit trên các file đã theo dõi sẽ bị ghi đè xóa sổ, không thể cứu bằng `reflog`.

---

Extra: `git reset` bản chất chỉ di chuyển con trỏ `HEAD` và can thiệp vào những gì Git đã quản lý (Tracked state), không bao giờ tự ý dọn dẹp các file ngoài luồng.
