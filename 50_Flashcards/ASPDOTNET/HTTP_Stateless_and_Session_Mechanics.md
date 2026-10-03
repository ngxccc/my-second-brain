---
noteId: 1790774286606
---

Cơ chế duy trì trạng thái Session trong ASP.NET Core kết hợp Cookie và Server RAM như thế nào?

---

- **Session ID qua Cookie**: Server sinh Session ID ngẫu nhiên gửi về Client qua Cookie HttpOnly (`.AspNetCore.Session`).
- **Dữ liệu thật trên Server**: Trạng thái (giỏ hàng, user) lưu trên RAM server hoặc Redis; mỗi request Client gửi Cookie kèm theo để Middleware tra cứu.

---

Extra: HTTP vốn hoàn toàn Stateless. Session dùng cơ chế thời gian trượt IdleTimeout (mặc định 20 phút), có request mới thì đồng hồ tự reset về 20 phút.
