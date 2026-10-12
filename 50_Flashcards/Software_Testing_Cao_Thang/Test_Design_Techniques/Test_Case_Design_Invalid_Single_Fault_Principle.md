---
noteId: 1791469636260
---

Khi thiết kế ca kiểm thử cho các phân hoạch không hợp lệ, nguyên tắc cốt lõi cần tuân thủ là gì?

---

- **Nguyên tắc "Mỗi ca một lỗi" (Single Fault Principle)**: Chỉ chọn duy nhất một trường dữ liệu không hợp lệ cho mỗi ca kiểm thử; tất cả các trường còn lại bắt buộc phải mang giá trị hợp lệ.

---

Extra: Nếu nhập nhiều trường cùng không hợp lệ (ví dụ: vừa sai Username vừa sai Password), lỗi của trường này sẽ che giấu lỗi của trường kia (Error Masking), khiến việc thẩm định thông báo lỗi của từng trường bị vô hiệu.
