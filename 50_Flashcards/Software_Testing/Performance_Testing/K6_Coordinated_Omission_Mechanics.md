---
noteId: 1790867232694
---

Tại sao hiện tượng Coordinated Omission trong kiểm thử tải lại tạo ra báo cáo percentile latency 'đẹp giả tạo'?

---

- **Tự động giảm tải ngầm**: Server chậm khiến Virtual Users bị kẹt chờ $\rightarrow$ số mẫu đo chậm bị giảm mạnh, thuật toán $p95/p99$ gạt chúng thành ngoại lai (outliers).

---

Extra: Khắc phục triệt để bằng Open Workload Model (`constant-arrival-rate`) để luôn giữ cố định tần suất gửi request và điều động thêm `maxVUs` để duy trì áp lực thực tế.
