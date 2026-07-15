---
noteId: 1784116411748
---

Phân biệt Stocks (Tích lũy), Flows (Dòng chảy) và Feedback Loops (Vòng lặp phản hồi) kèm ví dụ thực tế trong phần mềm.

---

**1. Stocks (Tích lũy):**
Tài nguyên tích tụ tại một thời điểm.

- _Ví dụ:_ Số tin nhắn chờ xử lý trong queue, CPU/RAM đang tiêu thụ, active DB connections.

**2. Flows (Dòng chảy):**
Tốc độ thay đổi tài nguyên tích lũy qua thời gian.

- _Ví dụ:_ Tốc độ đẩy request vào queue (Inflow), tốc độ workers xử lý ghi DB (Outflow).

**3. Vòng lặp phản hồi (Feedback Loops):**

- **Vòng lặp Tăng cường (Reinforcing Loop):** Đẩy nhanh thay đổi cấp số nhân. Ví dụ: DB nghẽn $\rightarrow$ query chậm $\rightarrow$ giữ connection lâu $\rightarrow$ nghẽn connection pool $\rightarrow$ sập hệ thống.
- **Vòng lặp Cân bằng (Balancing Loop):** Tự điều chỉnh về trạng thái ổn định. Ví dụ: Auto-scaling tự động tăng Pods, Rate Limiter tự động chặn request khi hàng đợi quá đầy.
