---
noteId: 1789914103698
---

Trong thuật toán Three-Way Merge của Git, cơ chế so sánh giữa 3 điểm `BASE`, `OURS`, và `THEIRS` diễn ra như thế nào? Khi nào Git tự động gộp (Auto-merge) và khi nào bắt buộc xảy ra CONFLICT?

---

- **Ba điểm so sánh:**
  - `BASE`: Điểm commit tổ tiên chung gần nhất trước khi 2 nhánh rẽ đôi.
  - `OURS`: Trạng thái mã trên nhánh hiện tại (`HEAD`).
  - `THEIRS`: Trạng thái mã trên nhánh đang được gộp vào.
- **Auto-merge:** Nếu một dòng chỉ bị sửa đổi bởi một bên so với `BASE` (bên kia giữ nguyên), hoặc cả hai cùng sửa giống hệt nhau $\rightarrow$ Git tự động gộp thành công.
- **CONFLICT:** Khi cả hai nhánh cùng sửa đổi trên cùng một dòng/vùng mã so với `BASE` nhưng cho ra **hai kết quả khác nhau** $\rightarrow$ Git không thể suy diễn logic nghiệp vụ nên dừng lại và yêu cầu con người giải quyết.

---

Extra: Kích hoạt `git config --global merge.conflictstyle diff3` sẽ giúp hiển thị thêm đoạn mã gốc của `BASE` ở giữa dấu `||||||| base`, giúp việc phân tích nguồn gốc xung đột dễ dàng hơn.
