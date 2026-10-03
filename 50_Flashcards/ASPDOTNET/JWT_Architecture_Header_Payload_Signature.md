---
noteId: 1790761561334
---

Ba phần cấu thành của JSON Web Token (JWT) được ngăn cách bởi dấu chấm là gì?

---

- **Header & Payload**: `Header` chứa thuật toán mã hóa (`alg`); `Payload` chứa các Claims của người dùng (`sub`, `roles`, `exp`).
- **Signature**: Chữ ký số tạo từ `HMACSHA256(Header + '.' + Payload, SecretKey)` để bảo đảm tính toàn vẹn.

---

Extra: Server không cần lưu Session trong RAM/Redis; mỗi request đến server chỉ cần tính toán lại chữ ký để xác thực token (Stateless Authentication).
