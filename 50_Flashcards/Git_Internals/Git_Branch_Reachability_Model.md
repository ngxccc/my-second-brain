---
noteId: 1790159213904
---

Nếu Branch chỉ là con trỏ trỏ vào commit đỉnh, Git xác định tập hợp commit thuộc về branch đó bằng cơ chế gì?

---

- **Mô hình Reachability**: Git lần ngược chuỗi con trỏ `parent` từ commit đỉnh về quá khứ; toàn bộ các commit chạm tới được chính là lịch sử của branch.

---

Extra: Commit mới luôn trỏ về commit cũ qua `parent pointer`. Commit cũ không trỏ tới commit mới vì object trong Git là bất biến.
