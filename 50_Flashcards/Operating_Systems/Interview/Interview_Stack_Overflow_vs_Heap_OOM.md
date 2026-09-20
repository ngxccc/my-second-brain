---
noteId: 1789871406183
---

[Phỏng vấn Backend]: "Khi nào một chương trình gặp lỗi Stack Overflow và khi nào gặp lỗi Out of Memory (OOM)? Hai lỗi này phản ánh sự cố ở hai vùng nhớ nào?"

---

1. **Stack Overflow (Xảy ra ở STACK):**
   - _Nguyên nhân:_ Đệ quy vô hạn (Infinite recursion), hàm lồng nhau quá sâu, hoặc khai báo biến mảng cục bộ có kích thước vượt quá giới hạn Stack của Thread (thường là 1MB–8MB trên OS, hoặc cạn kiệt stack mở rộng của Goroutine).
   - _Cơ chế:_ Con trỏ Stack Pointer (`RSP`) vượt ra ngoài ranh giới vùng nhớ được cấp cho Stack Frame (va vào Guard Page) $\rightarrow$ OS lập tức bắn tín hiệu Crash chương trình.

2. **Out of Memory - OOM (Xảy ra ở HEAP):**
   - _Nguyên nhân:_ Cấp phát dữ liệu động liên tục mà không giải phóng (Memory Leak), tải toàn bộ file dung lượng lớn vào RAM, hoặc tạo quá nhiều Object khiến Garbage Collector không thu hồi kịp.
   - _Cơ chế:_ Toàn bộ RAM vật lý và Swap Space bị cạn kiệt $\rightarrow$ Linux OS kích hoạt **OOM Killer** để cưỡng chế tiêu diệt (SIGKILL -9) Process ngốn nhiều RAM nhất.

---

Extra: Trong phỏng vấn, luôn chốt lại: Stack Overflow chết do vi phạm ranh giới con trỏ phần cứng, còn OOM chết do cạn kiệt tài nguyên bộ nhớ hệ thống.
