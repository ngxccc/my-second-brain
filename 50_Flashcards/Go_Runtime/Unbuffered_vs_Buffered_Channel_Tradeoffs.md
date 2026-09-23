---
noteId: 1790159214030
---

Unbuffered Channel (`make(chan T)`) và Buffered Channel (`make(chan T, N)`) trong Go khác nhau như thế nào về cơ chế Blocking, Context Switching, và Trade-off kiến trúc?

---

- **Unbuffered Channel (Capacity = 0):**
  - **Cơ chế:** Giao tiếp đồng bộ trao tận tay (Hand-to-Hand Handshake). Người gửi hoặc người nhận bị **Block ngay lập tức** cho đến khi phía đối diện sẵn sàng.
  - **Context Switch:** Diễn ra thường xuyên sau mỗi lượt truyền dữ liệu (chi phí ~100–500 ns/lần).
  - **Use Case:** Tín hiệu điều khiển (Graceful Shutdown, Signaling), đảm bảo 100% người nhận đã tiếp nhận dữ liệu trước khi đi tiếp.
- **Buffered Channel (Capacity = N > 0):**
  - **Cơ chế:** Giao tiếp bất đồng bộ thông qua Ring Buffer trên RAM. Người gửi chỉ bị Block khi buffer **ĐẦY (Full)**; người nhận chỉ bị Block khi buffer **RỖNG (Empty)**.
  - **Context Switch:** Giảm thiểu đáng kể, tối ưu hóa Throughput.
  - **Use Case:** Xử lý lưu lượng đột biến (Burst Traffic Absorption), mô hình Producer-Consumer, Worker Pool.

---

Extra: Cảnh báo kiến trúc: Không dùng Buffered Channel để "chữa cháy" cho Consumer quá chậm; nếu Producer tiếp tục đẩy nhanh hơn tốc độ tiêu thụ, buffer sẽ đầy và hệ thống vẫn bị nghẽn (Backpressure).
