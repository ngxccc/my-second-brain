---
noteId: 1790761561900
---

Làm thế nào để phân trang LINQ chuẩn hiệu năng cao và tránh bẫy 'In-Memory Paging' trong EF Core?

---

- **Chuẩn hiệu năng (`IQueryable`):** Áp dụng `.OrderBy().Skip((page - 1) * size).Take(size).ToListAsync()`. EF Core sẽ dịch trực tiếp thành mệnh đề SQL `OFFSET ... ROWS FETCH NEXT ... ROWS ONLY`.
- **Bẫy In-Memory Paging:** Gọi `.ToList()` trước khi gọi `.Skip().Take()`, khiến server kéo hàng triệu dòng dữ liệu vào RAM rồi mới cắt trang, gây tràn bộ nhớ.

---

Extra: Để hiển thị thanh điều hướng trang, cần gọi thêm `var totalCount = await context.Products.CountAsync();` trước khi áp dụng `Skip` và `Take` để tính toán tổng số trang (`TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)`).
