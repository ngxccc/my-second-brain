---
noteId: 1791469635792
---

Phương thức nào trong Route cho phép ràng buộc tham số URL chỉ chấp nhận các chữ số?

---

- **Phương thức ràng buộc:** Dùng `->whereNumber('id')` hoặc regex tổng quát `->where('id', '[0-9]+')`.
- **Hành vi từ chối:** Nếu tham số trên URL không khớp regex, Laravel tự động trả về phản hồi HTTP 404 Not Found.

---

Extra: Ngoài ra còn có `whereAlpha('name')` chỉ nhận chữ cái, `whereAlphaNumeric('slug')`, và `whereIn('role', ['admin', 'user'])`.
