---
noteId: 1789871406183
---

Khi nào một chương trình gặp lỗi Stack Overflow và khi nào gặp lỗi Heap Out-Of-Memory (OOM)?

---

- **Stack Overflow:** Xảy ra khi con trỏ `RSP` vượt quá giới hạn kích thước Stack Frame (do đệ quy vô hạn hoặc khai báo mảng cục bộ quá lớn trên Stack).
- **Heap Out-Of-Memory (OOM):** Xảy ra khi Runtime Allocator yêu cầu thêm bộ nhớ nhưng hệ điều hành từ chối cấp phát (do rò rỉ bộ nhớ Memory Leaks, giữ tham chiếu đối tượng không dùng, hoặc tải payload quá lớn vào RAM).

---

Extra: Stack Overflow xảy ra do vi phạm ranh giới con trỏ phần cứng (Hardware RSP limit), còn OOM xảy ra do cạn kiệt tài nguyên bộ nhớ hệ thống.
