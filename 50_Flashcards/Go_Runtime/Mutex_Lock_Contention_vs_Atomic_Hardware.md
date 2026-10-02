---
noteId: 1790265532917
---

Tại sao `sync/atomic` (ví dụ `atomic.AddInt64`) lại đạt thông lượng cao hơn và độ trễ thấp hơn gấp 3-4 lần so với `sync.Mutex` khi hàng ngàn Goroutines đồng thời cập nhật một biến số nguyên?

---

- **Bản chất phần cứng của Atomic (`~13 ns/op`):**
  - Go compiler dịch `atomic.AddInt64` thành đúng một chỉ lệnh máy x86-64 duy nhất: `LOCK XADD`.
  - Chỉ lệnh này được giải quyết trực tiếp tại bộ điều khiển L1 Cache phần cứng bên trong nhân CPU.
  - Hoàn toàn không qua trung gian của hệ điều hành hay Go Runtime Scheduler.
- **Chi phí ẩn của `sync.Mutex` (`~47 ns/op`):**
  - **Fast-path:** Dùng thuật toán CAS (Compare-And-Swap) để chiếm giữ lock.
  - **Active Spinning:** Nếu lock bị chiếm, Goroutine phải chạy vòng lặp tích cực (Spin) tối đa 4 lần trên CPU để rình mở lock.
  - **Slow-path & Parking:** Nếu tiếp tục thất bại, Go Runtime phải chuyển Goroutine từ trạng thái `_Grunnable` sang `_Gwaiting` (ngủ đông) và đưa vào hàng đợi Semaphores.
  - **Unparking:** Khi `Unlock()`, Runtime phải đánh thức Goroutine dậy (`runtime_Semrelease`), tiêu tốn chu kỳ Context Switch nội bộ của Go Scheduler.

---

Extra: Dưới tải đa luồng cao, nếu nhiều CPU Cores cùng liên tục gọi atomic lên một biến chung, hiện tượng **Cache Line Bouncing** (giao thức MESI liên tục gửi tín hiệu hủy Cache Line 64-byte qua Infinity Fabric / QPI Bus) có thể xuất hiện, tạo ra giới hạn trần vật lý cho throughput của một ô nhớ.
