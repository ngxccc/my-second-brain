---
noteId: 1790265532844
---

Mutex Sharding (Striped Partitioning) giải quyết bài toán Lock Contention trong Concurrent Cache/Map như thế nào?

---

- **Vấn đề Single Lock:** Một Mutex bảo vệ toàn bộ cấu trúc dữ liệu khiến mọi goroutine/thread đều tranh chấp vào một điểm nghẽn duy nhất.
- **Giải pháp Sharding:** Chia map thành $N$ mảng con độc lập (thường $N = 2^k$, ví dụ 32 hoặc 64 shards), mỗi shard có Mutex riêng.
- **Định tuyến:** Dùng hàm băm (`hash(key) % N`) để phân bổ key vào shard tương ứng, giảm xác suất tranh chấp khóa đi $N$ lần.

---

Extra: Trong thực tế, số lượng Shards ($N$) thường được chọn là lũy thừa của 2 (ví dụ 16, 32, 64) để thay thế phép chia lấy dư `%` bằng phép toán bitwise `& (N - 1)`, tiết kiệm chu kỳ lệnh máy của CPU.
