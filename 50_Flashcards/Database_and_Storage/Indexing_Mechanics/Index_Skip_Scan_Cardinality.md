---
noteId: 1783153909146
---

Tại sao Index Skip Scan sẽ biến thành thảm họa hiệu năng nếu cột dẫn đầu (`col1`) trong Composite Index `(col1, col2)` có Cardinality cao?

---

Vì số lần "nhảy cóc" (B-Tree traversals) tỉ lệ thuận trực tiếp với số lượng giá trị phân biệt của `col1`.

Nếu `col1` có 1.000.000 giá trị khác nhau, Database Engine sẽ phải thực hiện tới **1.000.000 lần duyệt nhánh cây B-Tree riêng biệt**, chậm hơn nhiều so với việc chỉ quét một lần toàn bộ bảng (Sequential Scan).

---

Extra: Chỉ kỳ vọng Index Skip Scan hoạt động hiệu quả khi cột đứng trước là tập hợp hằng số nhỏ (ví dụ: role, status, gender, is_active).
