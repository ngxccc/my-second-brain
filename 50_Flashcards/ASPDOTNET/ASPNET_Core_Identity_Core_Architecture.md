---
noteId: 1790761561056
---

Hai thành phần trung tâm xử lý nghiệp vụ tài khoản và phiên đăng nhập trong ASP.NET Core Identity là gì?

---

- **`UserManager<TUser>`**: Quản lý nghiệp vụ tài khoản (tạo user, băm mật khẩu, đổi pass, gán role, sinh token reset email).
- **`SignInManager<TUser>`**: Quản lý phiên làm việc trên HTTP context (kiểm tra pass, phát hành Auth Cookie, đăng xuất, 2FA).

---

Extra: IdentityUser/IdentityRole là entity CSDL (sinh các bảng AspNetUsers, AspNetRoles). Identity băm mật khẩu bằng thuật toán an toàn PBKDF2 với muối ngẫu nhiên (Salt).
