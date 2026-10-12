---
noteId: 1791469635944
---

Khi áp dụng rule kiểm tra `confirmed` (ví dụ `password => 'confirmed'`), Laravel yêu cầu trường xác nhận trong Form phải đặt tên chính xác là gì?

---

- **Quy ước đặt tên bắt buộc:** Trường xác nhận phải mang tên `<field>_confirmation` (ví dụ trường `password` yêu cầu `password_confirmation`).
- **Cơ chế đối soát:** Validation tự động kiểm tra xem giá trị của hai trường này có hoàn toàn trùng khớp nhau hay không.

---

Extra: Nếu thiếu trường `password_confirmation` trong request payload, validation sẽ kích hoạt thất bại ngay lập tức mà không cần viết rule riêng.
