---
noteId: 1790761561355
---

Phân biệt cốt lõi giữa `IQueryable<T>` và `IEnumerable<T>` trong Entity Framework Core?

---

- **`IQueryable<T>`:** Lưu trữ biểu thức logic dưới dạng **Expression Tree**. Chỉ biên dịch thành SQL và thực thi tại Database khi được duyệt (`ToList()`, `FirstOrDefault()`). Bộ lọc `Where()` diễn ra trực tiếp tại Database Server.
- **`IEnumerable<T>`:** Làm việc trên bộ nhớ RAM (In-Memory). Dữ liệu được kéo toàn bộ về máy chủ trước khi áp dụng các bộ lọc LINQ, gây lãng phí băng thông và sập bộ nhớ nếu bảng lớn.

---

Extra: Quy tắc vàng: Luôn duy trì kiểu `IQueryable<T>` khi xây dựng điều kiện tìm kiếm, sắp xếp và phân trang; chỉ gọi `.ToListAsync()` ở bước cuối cùng khi cần lấy dữ liệu ra.
