---
noteId: 1790159213930
---

Git giải quyết bài toán tìm điểm phân nhánh chung (Merge Base / Lowest Common Ancestor) trên đồ thị DAG bằng cơ chế gì?

---

- **Cơ chế sơn cờ Bitwise:** Gán `FLAG_1` cho nhánh 1, `FLAG_2` cho nhánh 2; duyệt ngược đồ thị; commit nào nhận đủ cả 2 cờ (`FLAG_1 | FLAG_2`) là nút `COMMON`.
- **Điểm Merge Base:** Là nút `COMMON` gần 2 đỉnh nhánh nhất theo topo.
- **Tối ưu hóa:** Dùng bảng nhị phân `commit-graph` và Generation Numbers để cắt tỉa (prune) cây duyệt mà không cần tải commit object từ đĩa.

---

Extra: Trong trường hợp **Criss-Cross Merge** (hai nhánh merge chéo nhau tạo ra nhiều Merge Base), Git Recursive/ORT sẽ tự động tạo một **Virtual Merge Base** (commit ảo gộp các Merge Base đó lại) để làm điểm tựa Three-Way Merge.
