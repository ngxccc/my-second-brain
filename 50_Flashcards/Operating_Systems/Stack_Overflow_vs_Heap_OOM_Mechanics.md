---
noteId: 1789871406183
---

Điểm khác biệt bản chất giữa lỗi Stack Overflow và Heap Out-Of-Memory (OOM) là gì?

---

- **Stack Overflow**: Con trỏ phần cứng `RSP` vượt quá giới hạn kích thước Stack Frame (do đệ quy sâu hoặc biến cục bộ quá lớn).
- **Heap OOM**: Trình cấp phát yêu cầu thêm bộ nhớ nhưng hệ điều hành từ chối cấp phát (do rò rỉ bộ nhớ hoặc tải payload quá lớn).

---

Extra: Stack Overflow vi phạm ranh giới con trỏ phần cứng; Heap OOM cạn kiệt tài nguyên bộ nhớ hệ thống.
