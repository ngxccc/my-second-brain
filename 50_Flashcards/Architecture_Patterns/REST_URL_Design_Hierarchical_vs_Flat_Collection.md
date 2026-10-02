---
noteId: 1790738820445
---

Khi thiết kế RESTful API cho tài nguyên nhiều quan hệ (ví dụ: Suất chiếu `shows`), so sánh Hierarchical URL vs Flat Collection with Query Filters?

---

- **Hierarchical (`/movies/{id}/shows`):** Dùng khi tài nguyên con không thể tồn tại độc lập mà bị sở hữu tuyệt đối bởi cha (Strong Composition). Nhược điểm: URL dài, cứng nhắc khi lọc theo chiều khác (ví dụ: tìm suất chiếu theo rạp thay vì theo phim).
- **Flat Collection (`/shows?movieId=X&cinemaId=Y`):** Chuẩn mực linh hoạt; hỗ trợ lọc đa chiều, dễ phân trang và tối ưu hóa câu truy vấn Database.

---

Extra: Quy tắc ngón tay cái: Dùng **Path Parameter** (`/parents/:id/children`) để định danh quyền sở hữu và phân cấp độc quyền; Dùng **Query Parameter** (`?filter=value`) để tìm kiếm, phân trang, sắp xếp và lọc thuộc tính đa chiều.
