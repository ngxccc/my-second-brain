---
noteId: 1790761561506
---

Trong ASP.NET Core, tại sao `ISession` không hỗ trợ trực tiếp lưu trữ các đối tượng phức tạp (Complex Objects như `Cart`), và giải pháp chuẩn hóa thông qua Extension Methods với JSON hoạt động ra sao?

---

- **Hạn chế thiết kế của `ISession`:**
  - Interface `ISession` trong ASP.NET Core chỉ cung cấp các phương thức cấp thấp lưu trữ mảng byte thô: `Set(string key, byte[] value)`, `GetString(string key)`, và `GetInt32(string key)`.
  - Thiết kế này nhằm đảm bảo tính độc lập và khả năng tương thích cao với mọi hệ thống Cache phân tán (Distributed Cache như Redis, SQL Server Cache), tránh việc ép buộc serialization của .NET nhúng cứng vào core.
- **Giải pháp Extension Methods chuẩn hóa:**
  - Lập trình viên viết các phương thức mở rộng (Extension Methods) cho `ISession` sử dụng thư viện tuần tự hóa dữ liệu `System.Text.Json`:
    - **Lưu đối tượng (`SetJson<T>`):** Chuyển đổi đối tượng C# thành chuỗi JSON string (`JsonSerializer.Serialize(value)`), sau đó gọi `session.SetString(key, jsonString)`.
    - **Đọc đối tượng (`GetJson<T>`):** Lấy chuỗi JSON từ `session.GetString(key)`, nếu có dữ liệu thì giải mã ngược lại (`JsonSerializer.Deserialize<T>(jsonString)`).
- **Lợi ích thực tế:**
  - Giúp code Controller hoặc Service cực kỳ ngắn gọn, dễ đọc: `HttpContext.Session.SetJson("Cart", cart);` và `var cart = HttpContext.Session.GetJson<Cart>("Cart") ?? new Cart();`.

---

Extra: Khi sử dụng `System.Text.Json`, cần lưu ý các vấn đề về tham chiếu vòng (Circular Reference) hoặc các private setters trên properties của Domain Model nếu không có constructor phù hợp.
