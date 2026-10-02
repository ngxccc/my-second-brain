---
noteId: 1790950898715
---

Tại sao Redis là hệ thống Single-threaded trong xử lý Command nhưng vẫn có thể phục vụ hơn 100,000 kết nối đồng thời với hiệu năng cực cao?

---

- **Network Layer (I/O Multiplexing):** Sử dụng cơ chế `epoll` (Linux) / `kqueue` (macOS) để 1 luồng duy nhất theo dõi hàng chục ngàn Socket File Descriptors (FDs) mà không tốn CPU chờ đợi và không tiêu tốn RAM cho Thread Stacks.
- **Execution Layer (In-Memory Access):** Toàn bộ dữ liệu nằm trên RAM, mỗi thao tác `processCommand` diễn ra ở tốc độ sub-microsecond (~50ns) và tận dụng tối đa L1/L2/L3 CPU Cache Locality.
- **Zero Concurrency Overhead:** Hoàn toàn loại bỏ chi phí **Thread Context Switching** và không bao giờ gặp **Lock Contention** (không dùng Mutex/Spinlock trên dữ liệu).

---

Extra: Từ Redis 6.0, tính năng `io-threads` được bổ sung để đọc/ghi socket song song, nhưng Command Execution Engine vẫn là Single-threaded 100%.
