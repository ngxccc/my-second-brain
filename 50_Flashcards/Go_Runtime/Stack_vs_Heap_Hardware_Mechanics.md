---
noteId: 1789871405609
---

Về mặt phần cứng CPU, tại sao cấp phát biến trên Stack trong Go lại nhanh hơn nhiều so với trên Heap?

---

- **Stack $O(1)$**: Cấp phát và thu hồi chỉ bằng 1 phép toán CPU trên thanh ghi SP (`SUB/ADD RSP`); dữ liệu liên tục nằm sẵn trong L1/L2 Cache.
- **Heap Overhead**: Phải qua Runtime Memory Allocator tìm kiếm Free List, xử lý phân mảnh, tranh chấp khóa và tốn tài nguyên GC quét dọn.

---

Extra: Trả về con trỏ biến cục bộ (`&x`) kích hoạt Escape Analysis đẩy biến lên Heap qua `runtime.newobject` để tránh Dangling Pointer khi Stack Frame bị hủy.
