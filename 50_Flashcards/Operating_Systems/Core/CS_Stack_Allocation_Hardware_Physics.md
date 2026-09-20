---
noteId: 1789871406088
---

Ở cấp độ kiến trúc phần cứng CPU và Hệ điều hành, tại sao Stack Frame của một hàm lại được cấp phát và giải phóng tức thì với độ phức tạp $O(1)$ mà không bao giờ bị phân mảnh (Fragmentation)?

---

Vì Stack hoạt động hoàn toàn dựa trên cấu trúc ngăn xếp LIFO và được điều khiển trực tiếp bởi **thanh ghi phần cứng CPU Stack Pointer (như `RSP`)**:

- **Cấp phát:** Chỉ là **1 phép tính số học** trừ giá trị thanh ghi (`SUB RSP, N`) để kéo con trỏ đỉnh Stack xuống.
- **Giải phóng:** Khi hàm return, CPU cộng trả lại giá trị con trỏ (`ADD RSP, N`). Toàn bộ ô nhớ cũ bị hủy bỏ ngay lập tức trong **1 chu kỳ xung nhịp**.
- **Không phân mảnh:** Vùng nhớ Stack luôn liên tục (Contiguous), chỉ đẩy vào ở đỉnh và rút ra ở đỉnh, không có khái niệm tạo ra "lỗ hổng" trống ở giữa như Heap.

---

Extra: Dữ liệu Stack nằm gọn trong **CPU Cache L1/L2** nhờ tính cục bộ không gian (Spatial Locality), cho tốc độ truy cập đạt đỉnh (~1 nano giây).
