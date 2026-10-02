---
noteId: 1790761561081
---

Phân biệt bản chất Authentication và Authorization kèm mã lỗi HTTP tương ứng?

---

- **Authentication (Xác thực):** Trả lời câu hỏi _"Bạn là ai?"_ qua Credentials/Token. Mã lỗi khi thất bại: `401 Unauthorized`.
- **Authorization (Phân quyền):** Trả lời câu hỏi _"Bạn có quyền truy cập tài nguyên này không?"_ qua Roles/Permissions. Mã lỗi khi bị từ chối: `403 Forbidden`.

---

Extra: Trong ASP.NET Core, nếu người dùng chưa đăng nhập truy cập endpoint có `[Authorize]`, hệ thống Cookie Auth sẽ tự động redirect họ về trang `/Account/Login?ReturnUrl=...` thay vì trả mã 401 thô.
