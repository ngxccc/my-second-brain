---
noteId: 1789871406159
---

[Phỏng vấn Backend]: "Trong các ứng dụng High-Throughput (chịu tải cao), tại sao các kỹ sư Senior luôn tìm cách tối ưu hóa để dữ liệu nằm trên STACK thay vì HEAP? Trade-off (đánh đổi) ở đây là gì?"

---

- **Lý do tối ưu trên Stack:**
  1. **Triệt tiêu áp lực Garbage Collector (Zero-GC pressure):** Stack giải phóng tức thì theo hàm ($O(1)$), không làm kích hoạt các chu kỳ quét GC (Stop-The-World / GC Pacing) $\rightarrow$ Giữ cho độ trễ **$p99$ Latency** luôn ổn định ở mức thấp.
  2. **Tối ưu hóa phần cứng (CPU Cache Locality):** Stack là vùng nhớ liên tục, luôn nằm sẵn trong **L1/L2 Cache** (truy cập ~1ns), trong khi Heap phân tán, CPU phải liên tục tra cứu con trỏ (Pointer chasing) dẫn đến **CPU Cache Miss**.

- **Trade-off (Đánh đổi):**
  - Kích thước Stack có hạn, không thể chứa cấu trúc dữ liệu khổng lồ.
  - Vòng đời dữ liệu bị ràng buộc chặt chẽ trong Scope của hàm, không thể chia sẻ trạng thái dùng chung (Shared State) giữa nhiều luồng hoặc lưu trữ lâu dài.

---

Extra: Trong Go, kỹ sư dùng `go test -benchmem` để đo chỉ số `allocs/op` (số lần cấp phát Heap trên mỗi thao tác). Mục tiêu tối ưu high-throughput là kéo `allocs/op` về bằng **0**.
