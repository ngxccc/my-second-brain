---
noteId: 1790761561433
---

Trong ASP.NET Core MVC, so sánh kiến trúc giữa Partial View và View Component?

---

- **Partial View**: Đơn thuần là template Razor dùng chung, phụ thuộc 100% vào Model do Controller cha truyền xuống (không có class C# riêng).
- **View Component**: Mini-controller độc lập gồm 1 C# class kế thừa `ViewComponent` và Razor View, có thể tự inject DB/Service để lấy dữ liệu độc lập.

---

Extra: View Component bắt buộc cho widget độc lập xuất hiện ở nhiều trang (Giỏ hàng, Menu động). Nó không tham gia Model Binding và không nhận trực tiếp HTTP Request.
