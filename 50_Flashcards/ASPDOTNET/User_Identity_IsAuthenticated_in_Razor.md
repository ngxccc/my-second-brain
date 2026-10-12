---
noteId: 1791448210078
---

Mục đích chính của việc kiểm tra `@User.Identity.IsAuthenticated` trong các file giao diện Razor (`.cshtml`) là gì?

---

- **Mục đích cốt lõi:** Điều khiển việc hiển thị giao diện UI có điều kiện theo trạng thái đăng nhập của người dùng.
- **Ví dụ điển hình trên Header/Navbar:**
  - Nếu `true`: Hiển thị lời chào `Xin chào, @User.Identity.Name!`, menu tài khoản và nút **Đăng xuất**.
  - Nếu `false`: Hiển thị nút **Đăng nhập** và **Đăng ký**.

---

Extra: Lưu ý: Đây chỉ là hiển thị giao diện (UI UX), muốn bảo vệ dữ liệu backend bắt buộc phải dùng `[Authorize]` trên Action/Controller.
