---
noteId: 1789871405508
---

Theo nguyên lý Leftmost Prefix của B-Tree, bảng có Composite Index `(status, created_at)` thì câu query nào không tận dụng được Index?

---

- **Bỏ qua cột đầu**: Query chỉ lọc trên `created_at` mà thiếu `status` sẽ không dùng được Index (phải Full Table/Index Scan).
- **Nguyên lý phân cấp B-Tree**: B-Tree sắp xếp nhánh theo cột đầu tiên trước; nếu thiếu điểm neo `status`, engine không thể tìm kiếm nhị phân $O(\log N)$.

---

Extra: Trong PostgreSQL, nếu cardinality của cột đầu tiên cực kỳ thấp (ví dụ chỉ có 2 trạng thái), Postgres có thể dùng Index Skip Scan để cứu, nhưng quy tắc vàng vẫn luôn là: Cột lọc đẳng thức (`=`) phải đặt trước cột lọc khoảng (`>`, `<`).
