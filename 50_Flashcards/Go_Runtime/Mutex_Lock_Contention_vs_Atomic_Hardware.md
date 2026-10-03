---
noteId: 1790265532917
---

Tại sao `atomic.AddInt64` lại đạt thông lượng cao hơn nhiều so với `sync.Mutex` khi hàng ngàn Goroutines cùng cập nhật biến đếm?

---

- **Lệnh máy `LOCK XADD`**: Atomic được CPU xử lý trực tiếp tại L1 Cache controller mà không qua hệ điều hành hay Go Runtime.
- **Không tốn Context Switch**: `sync.Mutex` khi tranh chấp phải chuyển Goroutine sang trạng thái ngủ (`_Gwaiting`), tốn chi phí đỗ và đánh thức luồng.

---

Extra: Dưới tải đa luồng cực cao, nhiều CPU Cores gọi atomic liên tục lên 1 biến có thể gây Cache Line Bouncing qua QPI/UPI bus, tạo ra giới hạn trần thông lượng vật lý.
