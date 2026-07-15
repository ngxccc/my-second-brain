---
noteId: 1784116411698
---

Giải thích cách áp dụng Tư duy hệ thống để xử lý bài toán tải cao (High Traffic Twitter/X clone) từ nguồn.

---

- **Vấn đề (Reinforcing Loop):** Ghi DB trực tiếp $\rightarrow$ nghẽn connection pool $\rightarrow$ sập hệ thống.
- **Giải pháp có tư duy hệ thống:**
  1. Dùng **Message Queue** (RabbitMQ/Kafka) làm bộ đệm hấp thụ request đột biến.
  2. Trả trạng thái `202 Accepted` ngay lập tức để tối ưu trải nghiệm người dùng (UX/Interface).
  3. Dùng **Workers** kéo dần tin nhắn từ Queue để ghi DB theo lô (batch write) giúp ổn định DB.
  4. Dùng **Redis** cache cho Newsfeed đọc nhiều nhất.
