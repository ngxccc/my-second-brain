---
noteId: 1789871405609
---

Tại sao việc cấp phát biến cục bộ trên Stack lại nhanh hơn gấp nhiều lần so với cấp phát đối tượng trên Heap ở cấp độ phần cứng CPU?

---

- **Stack:** Cấp phát chỉ tốn **1 lệnh máy CPU** cộng/trừ con trỏ thanh ghi Stack Pointer (`SUB/ADD RSP`). Vùng nhớ liên tục, nằm sẵn trong **L1/L2 CPU Cache**. Thu hồi tức thì khi hàm return với chi phí $O(1)$, không cần Garbage Collector.
- **Heap:** Quản lý bằng phần mềm qua Runtime Memory Allocator. Phải tìm kiếm ô nhớ trống (Free List), xử lý phân mảnh (Fragmentation), đồng bộ khóa luồng (Locks), và phải tốn tài nguyên GC quét dọn sau này.

---

Extra: Trả về con trỏ biến cục bộ (`&x`) sẽ kích hoạt **Escape Analysis** đẩy biến lên Heap (lệnh `runtime.newobject`) để tránh lỗi Dangling Pointer khi Stack Frame bị hủy.
