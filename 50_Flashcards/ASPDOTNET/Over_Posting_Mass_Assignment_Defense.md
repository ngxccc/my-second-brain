---
noteId: 1790774286831
---

Lỗ hổng Over-Posting (Mass Assignment) là gì và tại sao ViewModel/DTO là giải pháp phòng thủ triệt để?

---

- **Bản chất lỗ hổng**: Action bind trực tiếp Domain Entity (`Edit(User user)`); kẻ tấn công chèn thêm trường nhạy cảm (`"IsAdmin": true`) và Model Binder tự động lưu vào DB.
- **Phòng thủ bằng DTO**: Chỉ bind class DTO chứa các trường cho phép sửa (`EditProfileDto`), sau đó đọc Entity từ DB lên và gán đúng các trường an toàn.

---

Extra: Nguyên tắc bất biến: Domain Entity chỉ nằm ở tầng Core/Database; dữ liệu đi từ HTTP request vào bắt buộc phải qua ViewModel hoặc Input DTO.
