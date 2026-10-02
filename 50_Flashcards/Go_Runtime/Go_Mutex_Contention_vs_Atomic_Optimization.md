---
noteId: 1790265532941
---

Trong một dịch vụ Ingestion xử lý 10.000 requests/giây, hệ thống gặp hiện tượng CPU tăng vọt và độ trễ tăng cao dù nghiệp vụ chỉ là đếm tổng số bản tin nhận được. Nguyên nhân gốc rễ là gì và phương án refactor tối ưu là gì?

---

- **Nguyên nhân gốc rễ (Lock Contention):**
  - Sử dụng một `sync.Mutex` dùng chung cho toàn bộ các Goroutines để bảo vệ biến đếm `counter++`.
  - Phép toán `counter++` vốn gồm 3 chỉ thị máy (Read-Modify-Write). Việc bọc Mutex khiến 10.000 Goroutines phải xếp hàng tuần tự.
  - Khi hàng ngàn Goroutines bị chặn, Go Scheduler tiêu tốn phần lớn chu kỳ CPU vào việc chuyển trạng thái Goroutine (`_Grunnable` $\leftrightarrow$ `_Gwaiting`) và quản lý hàng đợi Futex/Semaphore thay vì thực thi logic có ích.
- **Phương án Refactor tối ưu:**
  - Thay thế `sync.Mutex` bằng thư viện `sync/atomic`: sử dụng `atomic.AddInt64(&counter, 1)`.
  - Lợi ích: Triệt tiêu hoàn toàn hiện tượng Lock Contention; chuyển đổi việc đồng bộ hóa từ phần mềm (Go Runtime) xuống phần cứng (chỉ lệnh CPU `LOCK XADD`), đẩy throughput lên hàng trăm triệu thao tác mỗi giây.

---

Extra: Tránh bẫy Antipattern: Giữ Mutex trong khi thực hiện các tác vụ tốn thời gian như parse JSON, tính toán nặng hoặc gọi mạng/I/O. Vùng tranh chấp (Critical Section) phải luôn được thu hẹp về mức tối thiểu tuyệt đối.
