---
noteId: 1789914103776
---

Ý nghĩa của hai nhãn `OURS` và `THEIRS` bị đảo ngược như thế nào khi giải quyết xung đột trong `git rebase` so với `git merge`?

---

- **Trong Merge**: `OURS` là nhánh hiện tại của bạn (`HEAD`); `THEIRS` là nhánh sắp gộp vào.
- **Trong Rebase**: `OURS` là nhánh upstream làm gốc; code của bạn đang được đắp lên lại mang nhãn `THEIRS`.

---

Extra: Trong merge, conflict xử lý đúng 1 lần; trong rebase, conflict xảy ra từng commit một theo cơ chế Replay. Dùng `git rebase --abort` để hủy an toàn.
