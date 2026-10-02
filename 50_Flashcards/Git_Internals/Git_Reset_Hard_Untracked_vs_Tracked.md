---
noteId: 1789915064958
---

Khi thực thi lệnh `git reset --hard HEAD~1`, các tập tin mới tạo chưa từng được `git add` (Untracked files) có bị xóa khỏi ổ cứng không? Còn các sửa đổi trên các tập tin đã được theo dõi (Tracked files) thì sao?

---

- **Untracked files:** **KHÔNG HỀ BỊ XÓA!** Git coi đây là dữ liệu ngoài luồng của người dùng và không tự ý can thiệp. Chúng vẫn nằm nguyên trên ổ cứng (chỉ có lệnh `git clean -f` mới xóa).
- **Tracked files:** Mọi sửa đổi chưa commit trên các file đã được Git theo dõi sẽ bị **ghi đè và xóa sổ vĩnh viễn**, không thể khôi phục lại bằng bất kỳ lệnh nào kể cả `git reflog`.

---

Extra: `git reset` bản chất chỉ di chuyển con trỏ `HEAD` và can thiệp vào những gì Git đã quản lý (Tracked state), không bao giờ tự ý dọn dẹp các file rác ngoài luồng.
