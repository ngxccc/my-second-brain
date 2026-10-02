---
noteId: 1790761561056
---

Kiến trúc của thư viện ASP.NET Core Identity bao gồm các thành phần cốt lõi nào?, và vai trò của từng thành phần là gì?

---

- **`IdentityUser` & `IdentityRole` (Mô hình thực thể):**
  - Là các lớp Entity đại diện cho bảng người dùng và vai trò trong CSDL. Kế thừa từ `IdentityDbContext` giúp EF Core tự động sinh ra các bảng chuẩn: `AspNetUsers`, `AspNetRoles`, `AspNetUserClaims`, `AspNetUserRoles`, `AspNetUserLogins`.
- **`UserManager<TUser>` (Quản lý nghiệp vụ người dùng):**
  - Cung cấp các API xử lý logic nghiệp vụ tài khoản: Tạo người dùng (`CreateAsync`), băm mật khẩu, đổi mật khẩu, kiểm tra email xác thực, gán người dùng vào vai trò (`AddToRoleAsync`), sinh token reset mật khẩu.
  - Độc lập hoàn toàn với giao diện và cookie HTTP.
- **`SignInManager<TUser>` (Quản lý phiên đăng nhập):**
  - Phụ trách việc xác thực thông tin đăng nhập và tạo phiên làm việc cho người dùng qua HTTP context.
  - Các hàm chính: `PasswordSignInAsync` (kiểm tra username/password và phát hành Auth Cookie), `SignOutAsync` (hủy cookie phiên), `TwoFactorSignInAsync`.
- **`RoleManager<TRole>` (Quản lý vai trò):**
  - Chịu trách nhiệm tạo mới, chỉnh sửa, xóa các quyền và nhóm quyền (Roles) trong cơ sở dữ liệu (`CreateAsync`, `RoleExistsAsync`).

---

Extra: ASP.NET Core Identity tự động tích hợp cơ chế bảo vệ tài khoản: Băm mật khẩu bằng thuật toán an toàn PBKDF2 với muối ngẫu nhiên (Salt) và tự động khóa tài khoản (Lockout) khi nhập sai mật khẩu quá số lần quy định.
