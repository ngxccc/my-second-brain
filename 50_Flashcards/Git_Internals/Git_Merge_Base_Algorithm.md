---
noteId: 1790159213930
---

Git sử dụng cơ chế nào trên đồ thị DAG để tìm điểm phân nhánh chung (Merge Base) giữa hai nhánh?

---

- **Bitwise Topological Coloring**: Gán cờ nhị phân cho 2 nhánh rồi duyệt ngược DAG; commit chung gần nhất nhận đủ cờ của cả 2 bên là Merge Base.

---

Extra: Dùng bảng nhị phân `commit-graph` và Generation Numbers để cắt tỉa cây duyệt. Trường hợp Criss-Cross Merge có nhiều Merge Base, Git tự tạo Virtual Merge Base để làm điểm tựa Three-Way Merge.
