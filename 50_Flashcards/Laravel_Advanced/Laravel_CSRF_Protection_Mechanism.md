---
noteId: 1791469635211
---

Cơ chế bảo vệ CSRF trong Laravel hoạt động như thế nào và mã lỗi HTTP nào trả về khi token không hợp lệ?

---

- **Cơ chế xác thực:** Directive `@csrf` sinh trường ẩn `_token` khớp với Session; Middleware `VerifyCsrfToken` đối soát token trên mỗi POST/PUT/DELETE.
- **Mã lỗi phát sinh:** Trả về mã lỗi HTTP 419 Page Expired nếu token bị thiếu, hết hạn hoặc sai lệch.

---

Extra: Với API hoặc AJAX request, token được gửi qua HTTP Header `X-CSRF-TOKEN` hoặc `X-XSRF-TOKEN` lấy từ cookie đã mã hóa.
