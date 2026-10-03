---
noteId: 1790761561506
---

Tại sao `ISession` trong ASP.NET Core không hỗ trợ lưu trữ Complex Object và giải pháp chuẩn hóa là gì?

---

- **Hạn chế byte thô**: `ISession` chỉ lưu mảng byte (`Set`), chuỗi (`SetString`) hoặc số nguyên (`GetInt32`) để tương thích với mọi Distributed Cache (Redis, SQL Server).
- **Giải pháp Extension Methods**: Viết hàm mở rộng dùng `System.Text.Json` để Serialize đối tượng thành JSON string khi lưu (`SetJson`) và Deserialize khi đọc (`GetJson`).

---

Extra: Cú pháp: `HttpContext.Session.SetJson("Cart", cart)` và `session.GetJson<Cart>("Cart")`. Cần lưu ý Circular Reference trong Domain Model khi serialize.
