---
noteId: 1790265532844
---

Kỹ thuật Mutex Sharding (Striped Partitioning) giải quyết bài toán Lock Contention trong Concurrent Map như thế nào?

---

- **Phân mảnh khóa**: Chia map thành $N$ shard độc lập (mỗi shard có Mutex riêng) và dùng `hash(key) % N` để phân bổ, giảm xác suất tranh chấp khóa đi $N$ lần.

---

Extra: Trong thực tế, $N$ thường được chọn là lũy thừa của 2 để thay thế phép chia lấy dư `%` bằng phép toán bitwise `& (N - 1)`, tiết kiệm chu kỳ lệnh máy của CPU.
