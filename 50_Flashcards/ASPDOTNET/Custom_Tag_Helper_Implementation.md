---
noteId: 1790761561156
---

Trong phương thức `Process` của Custom Tag Helper, vai trò của hai đối tượng `context` và `output` là gì?

---

- **`context`**: Cung cấp thông tin về thẻ HTML hiện tại trong file Razor (các thuộc tính HTML có sẵn, ID duy nhất của thẻ).
- **`output`**: Cho phép can thiệp và định hình lại mã HTML xuất ra (`output.TagName`, sửa class CSS, chèn nội dung HTML động).

---

Extra: Kế thừa lớp `TagHelper`. Để View nhận diện Tag Helper, bắt buộc đăng ký assembly trong file `_ViewImports.cshtml` qua cú pháp: `@addTagHelper *, AssemblyName`.
