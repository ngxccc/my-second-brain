---
noteId: 1791469636092
---

Với quy tắc Password có ít nhất 2 ký tự đặc biệt, phân hoạch tương đương chia thành các lớp kiểm thử nào?

---

- **Lớp hợp lệ**: Mật khẩu chứa $\ge 2$ ký tự đặc biệt (ví dụ: `Abc@#1` có đúng 2 ký tự, hoặc `Abc@#$%1`).
- **Lớp không hợp lệ**: Mật khẩu chỉ có đúng 1 ký tự đặc biệt (`Abcdef@1`), không có ký tự đặc biệt nào (`Abcdef12`), hoặc để trống.

---

Extra: Kỹ thuật kiểm thử biên số lượng ký tự đặc biệt tại mốc 1 (fail) và 2 (pass) giúp ngăn ngừa lỗi lập trình đếm sót số lượng ký tự hợp lệ bằng regex.
