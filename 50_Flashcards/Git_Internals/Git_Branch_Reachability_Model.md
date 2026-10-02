---
noteId: 1790159213904
---

Nếu Branch trong Git chỉ là một con trỏ trỏ vào commit đỉnh, vậy Git biết những commit nào "thuộc về" branch đó bằng cách nào?

---

Git không lưu sẵn danh sách commit của một branch. Git suy ra bằng **Reachability**:

1. Bắt đầu từ commit đỉnh mà branch đang trỏ tới (`feature_tip`).
2. Lần ngược qua con trỏ `parent` của từng commit.
3. Dừng ở Initial Commit hoặc Merge Base tùy phép so sánh.

Vì vậy, branch là nhãn dán ở commit mới nhất, còn lịch sử của branch là tập commit có thể truy cập được khi đi ngược theo chuỗi `parent`.

---

Extra: Commit mới luôn trỏ về commit cũ qua `parent pointer`. Commit cũ không trỏ tới commit mới vì object cũ là bất biến và SHA sẽ thay đổi nếu sửa nội dung.
