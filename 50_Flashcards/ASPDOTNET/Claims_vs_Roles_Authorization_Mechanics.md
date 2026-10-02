---
noteId: 1790774286706
---

Sự khác biệt cốt lõi giữa phân quyền theo Role và phân quyền theo Claim & Policy là gì?

---

- **Role-based (`[Authorize(Roles = "Admin")]`):**
  - Kiểm tra xem user có thuộc nhóm vai trò đó không.
  - _Hạn chế:_ Bùng nổ vai trò (Role Explosion) khi nghiệp vụ phức tạp (`AdminView`, `AdminEdit`, `ManagerDeptA`...), code cứng Role rải rác khắp Controller.
- **Claims & Policy-based (`[Authorize(Policy = "CanDeleteInvoice")]`):**
  - **Claim:** Đặc điểm của user (ví dụ `Department = "IT"`, `Permission = "Invoice.Delete"`).
  - **Policy:** Luật nghiệp vụ tập trung trong `Program.cs` gom nhiều Claim lại.
  - _Lợi ích:_ Tách rời code Controller khỏi logic phân quyền. Nghiệp vụ đổi thì chỉ sửa trong Policy.

---

Extra: User trong ASP.NET Core được biểu diễn bằng `ClaimsPrincipal`, chứa danh sách các `Claim`.
