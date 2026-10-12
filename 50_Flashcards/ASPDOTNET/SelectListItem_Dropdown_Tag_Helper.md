---
noteId: 1791448210061
---

Giao diện `IEnumerable<SelectListItem>` thường được truyền từ Controller sang View để làm gì, và Tag Helper nào tiêu thụ nó?

---

- **Mục đích cốt lõi:** Truyền danh sách dữ liệu cho thẻ Dropdown List từ Controller sang View (mỗi mục gồm `Value`, `Text`, `Selected`).
- **Cách dùng trên Razor View:** Gắn vào Tag Helper `<select asp-for="CategoryId" asp-items="Model.Categories"></select>`, framework tự động lặp và sinh các thẻ `<option value="...">...</option>`.

---

Extra: Thường được khởi tạo trong Controller bằng cú pháp: `new SelectList(categories, "Id", "Name")`.
