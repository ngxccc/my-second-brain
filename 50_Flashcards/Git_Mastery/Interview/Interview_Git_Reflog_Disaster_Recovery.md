---
noteId: 1789914103802
---

[Phỏng vấn Git]: "Một lập trình viên lỡ tay gõ `git reset --hard HEAD~1` làm mất một commit chứa tính năng quan trọng chưa kịp đẩy lên remote. Commit đó có thực sự bị xóa khỏi máy không? Quy trình khôi phục lại 100% là gì?"

---

- **Bản chất:** Commit đó **CHƯA HỀ BỊ XÓA**. Nó chỉ biến thành một "commit mồ côi" (Unreachable commit) vì không còn branch nào trỏ tới. Git sẽ giữ commit này trong Object Store ít nhất 30 ngày trước khi `git gc` dọn dẹp.
- **Quy trình cứu hộ bằng `git reflog`:**
  1. Gõ `git reflog` để xem toàn bộ lịch sử di chuyển của con trỏ `HEAD`.
  2. Tìm commit hash ngay trước thời điểm reset (ví dụ: `HEAD@{1}: commit: Tính năng quan trọng` với hash `a1b2c3d`).
  3. Tạo một nhánh mới khôi phục ngay tại vị trí commit đó: `git checkout -b rescue-branch a1b2c3d`.

---

Extra: Phân biệt nhanh 3 cờ reset: `--soft` (chỉ lùi HEAD, giữ Staged), `--mixed` (lùi HEAD, hủy Staged, giữ File), `--hard` (lùi HEAD, xóa sạch cả Staged và File đĩa).
