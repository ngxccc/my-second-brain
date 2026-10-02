---
noteId: 1790761561458
---

Tại sao các thực thể Domain trong Clean Architecture / Layered Architecture bắt buộc là POCO?

---

- **Bản chất POCO (Plain Old CLR Object):** Lớp C# thuần túy, không kế thừa từ bất kỳ class hay thư viện framework web bên ngoài nào.
- **Persistence Ignorance:** Tách biệt tuyệt đối logic nghiệp vụ cốt lõi khỏi chi tiết lưu trữ (Database/Web UI), giúp dễ dàng viết Unit Test và thay đổi công nghệ cơ sở dữ liệu mà không ảnh hưởng tới Domain.

---

Extra: Dù sau này Entity Framework Core có thể dùng các Data Annotations (`[Required]`, `[Key]`) trên Entity, chuẩn kiến trúc sạch (Clean Architecture) vẫn khuyến khích dùng Fluent API (`IEntityTypeConfiguration`) trong tầng Data để giữ Entity POCO hoàn toàn nguyên bản.
