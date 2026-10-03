---
noteId: 1789871406159
---

Hai kỹ thuật cốt lõi giúp hệ thống High-Throughput giảm áp lực Garbage Collector là gì?

---

- **Object Pooling**: Dùng `sync.Pool` (Go) hoặc `ArrayPool` (.NET) để tái sử dụng buffer thay vì cấp phát mới.
- **Pre-allocation & Zero-Copy**: Cấp phát trước dung lượng (`make([]T, 0, cap)`) và dùng slice/span trỏ trực tiếp trên buffer có sẵn.

---

Extra: Trong Go, dùng `go test -benchmem` để đo chỉ số `allocs/op` với mục tiêu kéo về 0 trên hot-path.
