---
noteId: 1790761561156
---

Làm thế nào để tạo một Custom Tag Helper trong ASP.NET Core (ví dụ PageLinkTagHelper trong Lab 04) và phương thức `Process` / `ProcessAsync` hoạt động ra sao?

---

- **Cấu trúc của một Custom Tag Helper:**
  - Kế thừa lớp cơ sở `TagHelper` từ namespace `Microsoft.AspNetCore.Razor.TagHelpers`.
  - Sử dụng thuộc tính `[HtmlTargetElement("div", Attributes = "page-model")]` để chỉ định thẻ HTML và thuộc tính kích hoạt Tag Helper.
  - Khai báo các thuộc tính C# (Properties) tương ứng với các thuộc tính HTML để Razor Engine tự động gán dữ liệu vào.
- **Phương thức `Process` / `ProcessAsync(TagHelperContext context, TagHelperOutput output)`:**
  - **`context`**: Chứa thông tin về thẻ HTML hiện tại trong file Razor (các thuộc tính HTML có sẵn, ID duy nhất của thẻ).
  - **`output`**: Đối tượng cho phép lập trình viên can thiệp và định hình lại mã HTML xuất ra:
    - `output.TagName = "ul"`: Đổi tên thẻ cha (ví dụ đổi từ `div` thành `ul` cho phân trang Bootstrap).
    - `output.Attributes.SetAttribute("class", "pagination")`: Thêm hoặc sửa class CSS.
    - `output.Content.AppendHtml(builder.ToString())`: Chèn nội dung HTML động được sinh ra bằng C# vào bên trong thẻ.

---

Extra: Để View nhận diện được Custom Tag Helper, bắt buộc phải đăng ký tên assembly của project vào file `_ViewImports.cshtml`: `@addTagHelper *, SportsStore.WebUI`.
