---
noteId: 1790843467144
---

Tại sao không dùng số trung bình (Mean/Average) để đo Latency? Ý nghĩa của $p95$ và rủi ro của $p99$ trong Microservices là gì?

---

- **Bẫy số trung bình:** Bị các request nhanh kéo thấp, che giấu hoàn toàn các spike chậm do GC, lock contention hoặc Disk I/O.
- **Ý nghĩa $p95$:** Chuẩn cam kết SLA/SLO (95% request phản hồi nhanh hơn mốc này).
- **Rủi ro $p99$ trong Microservices:** 1% request chậm nhất; nhưng khi một trang gọi chuỗi 20–50 service con, xác suất người dùng dính phải $p99$ tăng vọt lên tới 40%–60%.

---

Extra: Trong CV kỹ sư Backend, metric chuẩn mực luôn kết hợp cả Throughput và Percentile: "Đạt throughput > 1,500 RPS dưới p95 latency < 45ms".
