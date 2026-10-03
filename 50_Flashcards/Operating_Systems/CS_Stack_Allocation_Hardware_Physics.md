---
noteId: 1789871406088
---

Tại sao Stack Frame của hàm được cấp phát và giải phóng tức thì $O(1)$ mà không bao giờ bị phân mảnh bộ nhớ?

---

- **Chỉ thị số học trên thanh ghi SP**: Cấp phát và hủy chỉ bằng 1 phép toán CPU (`SUB/ADD RSP, N`) trong 1 chu kỳ xung nhịp; vùng nhớ luôn liên tục theo LIFO.

---

Extra: Dữ liệu Stack nằm trọn trong L1/L2 CPU Cache nhờ tính cục bộ không gian (Spatial Locality), cho tốc độ truy cập đạt đỉnh (~1ns).
