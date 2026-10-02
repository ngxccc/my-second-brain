---
noteId: 1783153909247
---

Trong PostgreSQL 18+, kỹ thuật tối ưu hóa nào cho phép truy vấn chỉ lọc trên `col2` nhưng vẫn tận dụng được Composite Index `(col1, col2)`?

---

Cơ chế **Index Skip Scan**.

Bộ máy lưu trữ sẽ "nhảy cóc" qua các giá trị phân biệt của `col1` để tìm kiếm `col2` mà không cần quét toàn bộ bảng (Full Table Scan).

---

Extra: Đặc biệt hiệu quả khi `col1` có Low Cardinality (ít giá trị phân biệt, ví dụ: status enum) và rất chậm nếu `col1` có High Cardinality (ví dụ: user_id).
