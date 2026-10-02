---
noteId: 1790774286831
---

Lỗ hổng Over-Posting (Mass Assignment) là gì, và tại sao ViewModel/DTO là giải pháp phòng thủ triệt để?

---

- **Bản chất lỗ hổng:** Action nhận trực tiếp Domain Entity làm tham số (`Edit(User user)`). Kẻ tấn công dùng Postman chèn thêm trường nhạy cảm (`"IsAdmin": true` hoặc `"Balance": 999999`) vào payload. Model Binder tự động gán giá trị này và lưu thẳng vào CSDL.
- **Phòng thủ bằng ViewModel/DTO:**
  - Tuyệt đối không bind trực tiếp Entity vào Action.
  - Tạo class DTO chỉ chứa đúng các trường cho phép sửa: `EditProfileDto { FullName, Email }`.
  - Action chỉ nhận DTO này, sau đó đọc Entity từ DB lên và gán đúng các trường an toàn.

---

Extra: Quy tắc sống còn: Domain Entity chỉ nằm ở tầng Core/Database, dữ liệu đi từ HTTP vào bắt buộc phải qua ViewModel/DTO.
