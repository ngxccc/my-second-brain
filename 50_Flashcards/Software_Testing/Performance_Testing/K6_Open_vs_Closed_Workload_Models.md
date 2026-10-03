---
noteId: 1790867232811
---

Điểm khác biệt cốt lõi về tốc độ gửi request giữa Open Model và Closed Model trong k6 là gì?

---

- **Closed Model**: Tốc độ gửi bị ràng buộc bởi Response Time của Server; chỉ gửi request tiếp khi lượt trước đã xong.
- **Open Model**: Gửi request theo lịch trình cố định (Arrival Rate) bất kể Server nhanh hay chậm, tự tăng VU để bù trễ.

---

Extra: Closed Model phù hợp ứng dụng nội bộ (ERP, CRM); Open Model bắt buộc cho Public API/E-commerce để tránh Coordinated Omission (k6 tự giảm tải khi server chậm).
