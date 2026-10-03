---
noteId: 1790774286731
---

Tấn công CSRF lợi dụng hành vi nào của trình duyệt và ASP.NET Core phòng thủ bằng cách nào?

---

- **Bản chất CSRF**: Lừa trình duyệt tự động đính kèm Cookie xác thực hợp lệ khi gửi request ngầm đến server nạn nhân.
- **Cơ chế phòng thủ**: Tag Helper `<form>` tự động sinh token ẩn (`__RequestVerificationToken`); thuộc tính `[ValidateAntiForgeryToken]` đối chiếu token này với cookie.

---

Extra: Kẻ tấn công không thể đọc hoặc chèn được token ẩn hợp lệ từ trang web độc hại khác nguồn (Same-Origin Policy bảo vệ), giúp server chặn request giả mạo.
