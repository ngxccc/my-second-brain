---
noteId: 1790159213954
---

Shared Branch là gì? Tại sao trên Shared Branch bắt buộc phải dùng `git revert` thay vì `git reset` khi muốn hủy bỏ một commit lỗi đã push?

---

- **Shared Branch (Nhánh dùng chung):** Là nhánh công khai (`main`, `develop`, `release`) mà nhiều người cùng pull về máy để làm việc.
- **Tại sao cấm dùng `git reset`:**
  - `reset` lùi con trỏ và xóa commit khỏi lịch sử $\rightarrow$ bắt buộc phải dùng `push --force`.
  - Làm gãy đồ thị DAG trên máy của các đồng nghiệp, khi họ `pull` về sẽ gây lỗi commit hồi sinh hoặc xung đột nghiêm trọng.
- **Tại sao bắt buộc dùng `git revert`:**
  - `revert` không xóa quá khứ mà **tạo một commit MỚI** có nội dung đảo ngược hoàn toàn commit lỗi.
  - Lịch sử luôn tiến về phía trước (Append-only), đồng nghiệp chỉ cần `git pull` bình thường mà không phát sinh xung đột.

---

Extra: Khi revert một **Merge Commit** (commit có 2 parent), bắt buộc phải truyền cờ `git revert -m 1 <sha>` để chọn giữ lại đường đi của nhánh chính (Parent 1).
