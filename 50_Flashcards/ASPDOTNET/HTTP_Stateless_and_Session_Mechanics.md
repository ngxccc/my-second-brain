---
noteId: 1790774286606
---

Cơ chế duy trì trạng thái Session trong ASP.NET Core kết hợp Cookie và Server RAM như thế nào?

---

- **Bản chất:** Giao thức HTTP hoàn toàn **Stateless** (không nhớ client giữa các request).
- **Luồng hoạt động 3 bước:**
  1. **Sinh ID:** Server tạo chuỗi ngẫu nhiên **Session ID** và gửi về Client qua Cookie (`.AspNetCore.Session` có cờ `HttpOnly`).
  2. **Lưu dữ liệu:** Dữ liệu thật (giỏ hàng, user id) được lưu **trên Server RAM** (hoặc Redis), gắn với Session ID đó.
  3. **Khôi phục trạng thái:** Mỗi request tiếp theo, Client gửi kèm Cookie Session ID -> Middleware tra cứu RAM server để khôi phục lại trạng thái.

---

Extra: Session dùng cơ chế thời gian trượt (`IdleTimeout`, mặc định 20 phút). Có request mới thì bộ đếm giờ tự reset về 20 phút.
