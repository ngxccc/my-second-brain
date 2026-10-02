---
noteId: 1790761561433
---

Trong ASP.NET Core MVC, so sánh Partial View và View Component về kiến trúc và trường hợp bắt buộc sử dụng?

---

- **Partial View:** Đơn thuần là template Razor dùng chung; không có C# class xử lý logic riêng; phụ thuộc hoàn toàn vào Model do Controller cha truyền xuống.
- **View Component:** Một mini-controller độc lập gồm 1 C# class kế thừa `ViewComponent` và 1 Razor View; có thể tự Dependency Inject Service/DB để lấy dữ liệu độc lập.
- **Khi nào bắt buộc dùng View Component:** Khi render các widget độc lập dữ liệu (như Giỏ hàng, Menu điều hướng động, Đăng nhập widget) xuất hiện ở nhiều trang khác nhau.

---

Extra: View Component không tham gia vào vòng đời Model Binding và không nhận trực tiếp HTTP Request như một Controller thông thường; nó chỉ được thực thi khi đang render trang HTML.
