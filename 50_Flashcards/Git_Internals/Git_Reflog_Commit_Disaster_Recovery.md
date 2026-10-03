---
noteId: 1789914103802
---

Khi lỡ tay gõ `git reset --hard HEAD~1` làm mất một commit quan trọng chưa kịp đẩy lên remote, quy trình khôi phục lại 100% là gì?

---

- **Cứu hộ qua `git reflog`**: Chạy `git reflog` tìm commit SHA ngay trước thời điểm reset, sau đó tạo lại nhánh mới: `git checkout -b rescue-branch <sha>`.

---

Extra: Commit chưa hề bị xóa trên đĩa; nó chỉ biến thành unreachable commit trong Object Store ít nhất 30 ngày trước khi `git gc` dọn dẹp. Cờ reset: `--soft` (giữ Staged), `--mixed` (giữ File), `--hard` (xóa sạch cả File và Staged).
