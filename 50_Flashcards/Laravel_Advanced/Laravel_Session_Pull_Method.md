---
noteId: 1791469635867
---

Hành vi nguyên tử của phương thức `session()->pull($key, $default)` trong Laravel là gì?

---

- **Đọc và Hủy nguyên tử:** Trích xuất giá trị của key từ Session ra ngoài đồng thời xóa bỏ ngay lập tức key đó khỏi Session trong cùng một lệnh.
- **Mục đích sử dụng:** Thay thế cho chuỗi thao tác thủ công gồm 2 bước `$val = session()->get($key); session()->forget($key);`.

---

Extra: Phương thức này rất hữu ích cho các token xác thực dùng một lần (one-time tokens) hoặc thông điệp tạm thời cần tiêu thụ ngay.
