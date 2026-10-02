---
noteId: 1790867232811
---

Sự khác biệt bản chất giữa Open Workload Model và Closed Workload Model trong k6 là gì? Khi nào áp dụng mỗi loại?

---

- **Closed Model (Vòng lặp phụ thuộc):** Iteration tiếp theo chỉ chạy khi iteration trước đã nhận phản hồi; tốc độ gửi request bị ràng buộc bởi Response Time của Server. Áp dụng: Ứng dụng nội bộ (ERP, CRM) với số user cố định, hoặc kịch bản cướp lock tại $t=0$.
- **Open Model (Nhịp phát độc lập):** Request được kích hoạt theo lịch trình cố định (Arrival Rate) bất kể Server nhanh hay chậm; k6 tự tăng Virtual Users để bù đắp độ trễ. Áp dụng: Public API, E-commerce, Flash-Sale, Webhook, hoặc khi cần chứng thực cam kết Throughput (RPS) trong SLO.

---

Extra: Dùng sai Closed Model cho Public API sẽ dẫn đến lỗi Coordinated Omission (k6 tự giảm tải khi server chậm, làm sai lệch số liệu đo lường).
