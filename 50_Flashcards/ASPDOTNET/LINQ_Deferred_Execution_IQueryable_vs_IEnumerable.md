---
noteId: 1790761561355
---

Điểm khác biệt cốt lõi giữa `IQueryable<T>` và `IEnumerable<T>` trong Entity Framework Core là gì?

---

- **`IQueryable<T>`**: Lưu trữ Expression Tree; chỉ biên dịch thành SQL và lọc trực tiếp tại Database Server khi được duyệt (`ToListAsync()`).
- **`IEnumerable<T>`**: Làm việc trên RAM (In-Memory); kéo toàn bộ dữ liệu về máy chủ trước khi áp dụng bộ lọc LINQ, gây nghẽn băng thông và tràn RAM.

---

Extra: Luôn duy trì IQueryable khi xây dựng điều kiện tìm kiếm, sắp xếp và phân trang; chỉ gọi ToListAsync ở bước cuối cùng khi cần lấy dữ liệu ra ngoài.
