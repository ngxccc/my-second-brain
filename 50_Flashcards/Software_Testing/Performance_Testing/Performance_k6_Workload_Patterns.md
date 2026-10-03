---
noteId: 1790843467169
---

Mục tiêu kỹ thuật cốt lõi của mô hình Ramping Test và Spike Test trong k6 là gì?

---

- **Ramping (Tăng dần)**: Tìm điểm bẻ gãy (Breaking Point) của hệ thống khi số lượng Virtual Users tăng tuyến tính.
- **Spike (Đột biến)**: Kiểm tra khả năng hấp thụ sốc, cơ chế Auto-scaling và Circuit Breaker khi tải tăng vọt tức thì.

---

Extra: Soak Test (Constant Rate) chạy tải đều dài hạn để phát hiện Memory Leaks và cạn kiệt Connection Pool. Tránh bẫy Coordinated Omission bằng cách dùng kịch bản arrival-rate.
