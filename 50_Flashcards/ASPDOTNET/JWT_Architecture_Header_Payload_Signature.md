---
noteId: 1790761561334
---

Ba phần cấu thành của JSON Web Token (JWT) và cơ chế Stateless Authentication vận hành như thế nào?

---

- **Cấu trúc 3 phần (Base64Url):**
  1. `Header`: Thuật toán mã hóa (`alg`) và loại token (`typ`).
  2. `Payload`: Các Claims người dùng (`sub`, `roles`, `exp`).
  3. `Signature`: Chữ ký số tạo từ `HMACSHA256(Header + '.' + Payload, SecretKey)`.
- **Cơ chế Stateless:** Server không cần lưu Session trong RAM/Redis; mỗi request đến server chỉ cần tính toán lại chữ ký để xác thực tính toàn vẹn của token.

---

Extra: Trong `Program.cs`, xác thực JWT được cấu hình qua: `builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)` với các tham số kiểm tra Issuer, Audience và SigningKey.
