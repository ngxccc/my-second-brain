---
noteId: 1790843467144
---

Tại sao không dùng số trung bình (Mean) để đo Latency và ý nghĩa của mốc $p95$ là gì?

---

- **Bẫy số trung bình**: Bị các request nhanh kéo thấp, che giấu hoàn toàn các spike chậm do GC pause hay Disk I/O.
- **Ý nghĩa $p95$**: Chuẩn cam kết SLA/SLO, bảo đảm 95% request phản hồi nhanh hơn mốc thời gian này.

---

Extra: Trong Microservices, xác suất người dùng dính phải $p99$ tăng vọt lên 40-60% khi gọi chuỗi 20-50 dịch vụ. Metric chuẩn mực luôn kết hợp cả Throughput và Percentile.
