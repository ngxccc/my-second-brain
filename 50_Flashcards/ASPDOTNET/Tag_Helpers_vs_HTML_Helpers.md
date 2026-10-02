---
noteId: 1790761561533
---

Tại sao Tag Helpers trở thành chuẩn mực hiện đại thay thế HTML Helpers trong ASP.NET Core?

---

- **HTML Helpers:** Dùng cú pháp C# xen lẫn HTML (`@Html.TextBoxFor(m => m.Name)`), phá vỡ trải nghiệm viết giao diện và khó hỗ trợ auto-complete cho Frontend.
- **Tag Helpers:** Viết tự nhiên như các thuộc tính HTML chuẩn (`<input asp-for="Name" />`), tích hợp mượt mà với các framework UI và hỗ trợ công cụ kiểm tra tĩnh (IntelliSense) vượt trội.

---

Extra: Để kích hoạt toàn bộ Tag Helpers mặc định trong project, file `Views/_ViewImports.cshtml` bắt buộc phải chứa chỉ thị: `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers`.
