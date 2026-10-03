---
noteId: 1790774286706
---

Điểm khác biệt cốt lõi giữa phân quyền theo Role và phân quyền theo Claim & Policy trong ASP.NET Core là gì?

---

- **Role-based**: Kiểm tra người dùng có thuộc nhóm vai trò không (`Roles = "Admin"`); dễ gây bùng nổ vai trò và hardcode rải rác khắp Controller.
- **Claims & Policy**: Policy tập trung các luật nghiệp vụ gom nhiều Claim lại (`Policy = "CanDelete"`); tách rời code Controller khỏi logic phân quyền.

---

Extra: User trong ASP.NET Core được biểu diễn bằng ClaimsPrincipal, chứa danh sách các Claim (ví dụ Department = "IT", Permission = "Invoice.Delete").
