---
noteId: 1784116411428
---

"Vòng lặp địa ngục" (Hell Loop) trong thuật toán SM-2 là gì? Nêu giải pháp khắc phục khi lập trình thuật toán này.

---

- **Vòng lặp địa ngục (Hell Loop):** Hiện tượng xảy ra khi một từ vựng quá khó, người dùng bấm "Sai" liên tục khiến hệ số độ dễ (Easiness Factor - EF) bị trừ dồn dập. Nếu EF rơi xuống dưới 1.0, khoảng cách ôn tập tiếp theo (Interval) sẽ dậm chân tại chỗ hoặc bị âm, khiến người dùng bị kẹt mãi mãi trong việc ôn tập từ đó.
- **Giải pháp khắc phục:** Chốt chặn giới hạn dưới của EF tối thiểu ở mức **1.3** bằng câu lệnh clamping (ví dụ: `easiness = Math.max(1.3, easiness)`).
