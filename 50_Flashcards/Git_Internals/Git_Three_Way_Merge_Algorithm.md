---
noteId: 1789914103698
---

Trong thuật toán Three-Way Merge của Git, điều kiện nào dẫn tới CONFLICT thay vì Auto-merge?

---

- **Xung đột thay đổi**: Cả hai nhánh cùng sửa đổi trên cùng một dòng/vùng mã so với commit gốc `BASE` nhưng cho ra hai kết quả khác nhau.

---

Extra: Nếu một bên sửa so với `BASE` còn bên kia giữ nguyên (hoặc cả hai sửa giống hệt nhau), Git tự động gộp (Auto-merge). Kích hoạt `git config --global merge.conflictstyle diff3` để xem thêm đoạn mã gốc `BASE`.
