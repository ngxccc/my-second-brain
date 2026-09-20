---
noteId: 1789566005003
---

[Phỏng vấn Git / DevOps]: "Khi giải quyết xung đột (Conflict) trong `git rebase` và `git merge`, có 2 điểm khác biệt chí mạng nào về cơ chế xảy ra và ý nghĩa của các nhãn `OURS` / `THEIRS`?"

---

1. **Tần suất & Cơ chế:**
   - `git merge`: Xảy ra **đúng 1 lần duy nhất** tại thời điểm gộp để tạo Merge Commit.
   - `git rebase`: Xảy ra **từng commit một** theo cơ chế Replay. Nếu nhánh có 5 commit cùng chạm vào vùng sửa đổi, bạn có thể phải resolve conflict 5 lần liên tiếp qua lệnh `git rebase --continue`.

2. **Ý nghĩa nhãn `OURS` / `THEIRS` bị đảo ngược trong Rebase:**
   - Trong `merge`: `HEAD` (`OURS`) là nhánh hiện tại của bạn; `THEIRS` là nhánh sắp gộp vào.
   - Trong `rebase`: Git chuyển sang nhánh upstream làm gốc (`HEAD/OURS`), rồi bốc từng commit của bạn đắp lên đỉnh. Vì vậy, code bạn viết lúc này lại mang nhãn **`THEIRS`**, còn nhánh gốc đích lại là **`OURS`**.

---

Extra: Nếu muốn hủy bỏ an toàn khi gặp bế tắc conflict: dùng `git merge --abort` hoặc `git rebase --abort` để đưa nhánh về trạng thái ban đầu.
