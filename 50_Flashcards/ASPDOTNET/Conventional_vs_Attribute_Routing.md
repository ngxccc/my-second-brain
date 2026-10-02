---
noteId: 1790761561131
---

Trong ASP.NET Core MVC, Conventional Routing và Attribute Routing khác nhau như thế nào về cơ chế ánh xạ URL và phạm vi áp dụng?

---

- **Conventional Routing (Định tuyến theo quy ước):**
  - Định nghĩa tập trung tại `Program.cs` thông qua một mẫu URL chung (Pattern), ví dụ: `app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");`.
  - Hệ thống dựa vào các biến token `{controller}` và `{action}` trích xuất từ URL để tự động tìm kiếm Controller và Action tương ứng.
  - Phù hợp nhất cho các ứng dụng giao diện **MVC truyền thống (Razor Views)** có cấu trúc URL chuẩn mực, đồng nhất toàn hệ thống.
- **Attribute Routing (Định tuyến qua thuộc tính):**
  - Gắn trực tiếp các thuộc tính (Attributes) lên trên đầu Controller và Action, ví dụ: `[Route("api/[controller]")]` và `[HttpGet("{id:int}")]`.
  - URL được ánh xạ chính xác đến từng phương thức cụ thể mà không phụ thuộc vào quy ước đặt tên class hay hàm.
  - Bắt buộc và chuẩn mực cho **RESTful Web API** vì API đòi hỏi các mẫu URI phân cấp chi tiết, gắn chặt với HTTP Verbs (`[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]`) và Route Constraints (`{id:int}`).

---

Extra: Trong MVC, nếu một Action vừa được khai báo Attribute Routing vừa nằm trong vùng Conventional Routing, Attribute Routing sẽ luôn ghi đè (Override) và chiếm quyền ưu tiên tuyệt đối.
