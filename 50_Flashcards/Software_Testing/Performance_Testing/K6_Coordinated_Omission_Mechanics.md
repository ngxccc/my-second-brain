---
noteId: 1790867232694
---

Bản chất hiện tượng Coordinated Omission trong kiểm thử tải là gì, và tại sao nó tạo ra báo cáo percentile latency ($p95, p99$) "đẹp giả tạo"?

---

- **Bản chất cơ học:** Khi Server bị nghẽn hoặc dừng xử lý (GC pause, lock contention), các Virtual User trong Closed Model bị kẹt chờ phản hồi $\to$ k6 vô tình giảm tốc độ bắn request, làm giảm mạnh số lượng mẫu đo thu thập được trong giai đoạn nghẽn.
- **Bẫy thống kê:** Do số lượng mẫu đo chậm quá ít so với hàng nghìn mẫu đo mượt mà trước đó, thuật toán phân vị $p95, p99$ coi các mẫu chậm này là ngoại lai (outliers) và gạt bỏ $\to$ Latency tổng kết hiển thị vẫn xanh rờn dù thực tế ngoài đời hàng nghìn user đang tắc nghẽn.

---

Extra: Khắc phục triệt để bằng Open Model (`constant-arrival-rate`, `ramping-arrival-rate`) — giữ cố định tần suất bắn request và điều động thêm `maxVUs` để duy trì áp lực thực tế.
