---
noteId: 1790774286731
---

Tấn công CSRF lợi dụng điều gì của trình duyệt, và ASP.NET Core ngăn chặn nó bằng cơ chế nào?

---

- **Bản chất CSRF:** Kẻ gian lừa người dùng bấm vào web độc hại. Web độc hại ngầm gửi request `POST /admin/delete` về server bạn. Trình duyệt **tự động đính kèm Cookie đăng nhập hợp lệ** của người dùng, khiến server tưởng đó là lệnh thật của nạn nhân.
- **Cơ chế Antiforgery Token phòng thủ:**
  - Tag Helper `<form method="post">` tự động sinh 1 token ẩn `<input type="hidden" name="__RequestVerificationToken">` và 1 cookie song song.
  - Thuộc tính `[ValidateAntiForgeryToken]` trên Controller đối chiếu 2 token này.
  - Web độc hại của kẻ gian **hoàn toàn không thể đọc hoặc chèn được token ẩn hợp lệ** vào form body -> Server chặn ngay lập tức.

---

Extra: Tag Helper `<form>` trong ASP.NET Core mặc định TỰ ĐỘNG chèn token chống CSRF mà không cần gõ hàm thủ công.
