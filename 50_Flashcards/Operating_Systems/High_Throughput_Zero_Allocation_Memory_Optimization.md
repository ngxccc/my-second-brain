---
noteId: 1789871406159
---

Trong hệ thống xử lý hàng trăm nghìn requests/giây, làm thế nào để tối ưu hóa bộ nhớ tránh quá tải Garbage Collector?

---

- **Tái sử dụng bộ nhớ (Object Pooling):** Dùng `sync.Pool` (Go) hoặc ArrayPool (C#/.NET) để tái sử dụng buffer/struct thay vì cấp phát mới.
- **Zero-Allocation Practices:** Tránh ép kiểu interface (Boxing), sử dụng slice/span trỏ trực tiếp trên buffer có sẵn thay vì copy chuỗi.
- **Memory Pre-allocation:** Cấp phát trước kích thước Slice/Map (`make([]T, 0, capacity)`) để loại bỏ hoàn toàn các lần co giãn tái cấp phát bộ nhớ.

---

Extra: Trong Go, kỹ sư dùng `go test -benchmem` để đo chỉ số `allocs/op` (số lần cấp phát Heap trên mỗi thao tác). Mục tiêu tối ưu high-throughput là kéo `allocs/op` về bằng **0**.
