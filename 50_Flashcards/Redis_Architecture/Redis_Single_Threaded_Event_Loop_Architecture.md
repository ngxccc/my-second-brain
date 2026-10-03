---
noteId: 1790950898715
---

Tại sao Redis xử lý Command đơn luồng nhưng vẫn phục vụ hơn 100,000 requests/giây với độ trễ sub-millisecond?

---

- **I/O Multiplexing & RAM**: Sử dụng `epoll`/`kqueue` gom hàng chục ngàn socket phi chặn và toàn bộ dữ liệu nằm trực tiếp trên RAM.
- **Zero Concurrency Overhead**: Triệt tiêu hoàn toàn chi phí Thread Context Switching và không gặp Lock Contention (không dùng Mutex trên dữ liệu).

---

Extra: Từ Redis 6.0, `io-threads` được bổ sung để đọc/ghi socket song song, nhưng Command Execution Engine vẫn là đơn luồng 100%. Mỗi lệnh thực thi sub-microsecond (~50ns) và tận dụng tối đa CPU L1/L2 Cache Locality.
