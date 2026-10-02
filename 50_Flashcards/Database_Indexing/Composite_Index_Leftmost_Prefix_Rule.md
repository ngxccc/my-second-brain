---
noteId: 1789871405508
---

Một bảng có Index composite trên 2 cột `(status, created_at)`. Câu query `WHERE created_at > '2026-01-01' AND status = 'ACTIVE'` có dùng được Index không? Còn câu query `WHERE created_at > '2026-01-01'` thì sao? Giải thích nguyên lý B-Tree bên dưới.

---

1. **Query 1: `WHERE created_at > ... AND status = 'ACTIVE'`**
   - **CÓ dùng được Index.** Thứ tự xuất hiện trong mệnh đề `WHERE` không quan trọng vì **Query Optimizer** của Database tự sắp xếp lại điều kiện để khớp với thứ tự của Index.

2. **Query 2: `WHERE created_at > ...` (Bỏ qua cột status)**
   - **KHÔNG dùng được Index** (hoặc bị Full Index/Table Scan rất chậm).
   - **Nguyên lý B-Tree (Leftmost Prefix Rule):** Các node của B-Tree Index được sắp xếp phân cấp: trước hết sắp theo cột đầu tiên (`status`), với mỗi giá trị `status` giống nhau thì mới sắp theo cột thứ hai (`created_at`). Nếu bỏ qua cột đầu, cây B-Tree không có điểm bắt đầu (Root/Branch) để thực hiện tìm kiếm nhị phân $O(\log N)$.

---

Extra: Trong PostgreSQL, nếu cardinality của cột đầu tiên cực kỳ thấp (ví dụ chỉ có 2 trạng thái), Postgres có thể dùng Index Skip Scan để cứu, nhưng quy tắc vàng vẫn luôn là: Cột lọc đẳng thức (`=`) phải đặt trước cột lọc khoảng (`>`, `<`).
