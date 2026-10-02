---
noteId: 1790843467169
---

So sánh mục tiêu kỹ thuật và kịch bản áp dụng của 3 mô hình tải k6: (1) Ramping (Load/Stress), (2) Burst (Spike/Flash Crowd), (3) Constant Rate (Soak)?

---

- **Ramping (Tăng dần):** Tìm điểm bẻ gãy (Breaking Point), quan sát độ trễ và tỷ lệ lỗi khi số lượng VUs tăng tuyến tính.
- **Burst/Spike (Đột biến):** Giả lập flash-sale hoặc vé mở bán; kiểm tra khả năng hấp thụ sốc, cơ chế tự co giãn (Auto-scaling) và Circuit Breaker.
- **Constant Rate (Tải đều cố định):** Chạy bền vững trong thời gian dài (Soak Test) để phát hiện Memory Leaks, cạn kiệt Connection Pool và suy thoái đĩa I/O.

---

Extra: Trong k6, kịch bản VU-based (`ramping-vus`) dễ bị bẫy "Coordinated Omission" (hệ thống phản hồi chậm khiến VU bị kẹt, vô tình làm giảm số request gửi đi). Kịch bản `constant-arrival-rate` khắc phục triệt để bằng cách luôn giữ tốc độ bắn request bất chấp server nhanh hay chậm.
