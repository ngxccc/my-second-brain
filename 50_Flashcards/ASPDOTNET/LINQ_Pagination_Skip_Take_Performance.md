---
noteId: 1790761561900
---

Làm thế nào để phân trang LINQ chuẩn hiệu năng cao và tránh bẫy In-Memory Paging trong EF Core?

---

- **Chuẩn hiệu năng (IQueryable)**: Áp dụng `.OrderBy().Skip((page - 1) * size).Take(size).ToListAsync()`; EF Core dịch trực tiếp thành SQL `OFFSET ... FETCH NEXT`.
- **Bẫy In-Memory Paging**: Tuyệt đối không gọi `.ToList()` trước khi gọi `.Skip().Take()`, vì nó kéo hàng triệu dòng về RAM máy chủ rồi mới cắt trang.

---

Extra: Để hiển thị thanh phân trang UI, gọi `await context.Products.CountAsync()` trước khi Skip/Take để tính tổng số trang: `TotalPages = ceil(totalCount / pageSize)`.
