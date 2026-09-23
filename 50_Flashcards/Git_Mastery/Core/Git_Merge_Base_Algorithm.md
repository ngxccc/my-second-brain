---
noteId: 1790159213930
---

Git tìm điểm commit phân nhánh (Merge Base / Common Ancestor) giữa 2 branch như thế nào? Có phải Git so sánh từng cặp commit cha một cách thủ công?

---

- **Không so sánh thủ công từng cặp**: Git giải quyết bài toán tìm **Lowest Common Ancestor (LCA)** trên đồ thị **DAG** bằng thuật toán duyệt BFS/Priority Queue kết hợp kỹ thuật **Sơn cờ Bitwise (Commit Flags)**:
  - Gán cờ `FLAG_1` cho nhánh 1, `FLAG_2` cho nhánh 2.
  - Lần ngược theo con trỏ `parent` và lan truyền cờ xuống các commit tổ tiên.
  - Commit nào nhận đủ cả hai cờ (`FLAG_1 | FLAG_2`) được đánh dấu là `COMMON` (Tổ tiên chung).
- **Điểm phân nhánh (Merge Base)** chính là nút `COMMON` gần hai đỉnh nhánh nhất về mặt topo.
- **Tối ưu hóa**: Git sử dụng bảng nhị phân `commit-graph` và **Generation Numbers** để cắt tỉa (pruning) việc duyệt, không cần tải lại toàn bộ object commit từ đĩa.

---

Extra: Trong trường hợp **Criss-Cross Merge** (hai nhánh merge chéo nhau tạo ra nhiều Merge Base), Git Recursive/ORT sẽ tự động tạo một **Virtual Merge Base** (commit ảo gộp các Merge Base đó lại) để làm điểm tựa Three-Way Merge.
