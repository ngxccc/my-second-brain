---
noteId: 1789871406063
---

Tại sao việc trả về con trỏ trỏ tới một biến cục bộ trên Stack lại dẫn đến lỗi Dangling Pointer?

---

- **Stack Frame bị giải phóng**: Khi hàm return, con trỏ Stack Pointer thu hồi ô nhớ đó; con trỏ bên ngoài trỏ vào vùng nhớ tự do và sẽ bị hàm tiếp theo ghi đè.

---

Extra: Dẫn đến lỗi Undefined Behavior hoặc Segmentation Fault. Các ngôn ngữ như Go giải quyết triệt để bằng Escape Analysis để tự động chuyển biến lên Heap.
