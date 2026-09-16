---
noteId: 1783427811355
---

Tại sao đạt 100% Statement Coverage lại KHÔNG bảo đảm đạt 100% Decision Coverage? Nêu ví dụ phản chứng qua cấu trúc code.

---

Vì một nhánh rẽ có thể **không chứa câu lệnh thực thi nào bên trong** (ví dụ: câu lệnh `if (x > 0)` mà **không có khối `else`**).

Nếu ta chỉ chạy một test case với `x = 5` (nhánh True):

- Toàn bộ câu lệnh trong thân `if` đều được chạy $\rightarrow$ **100% Statement Coverage**.
- Nhưng nhánh khi `x <= 0` (nhánh False) không hề được kiểm tra $\rightarrow$ **Chỉ đạt 50% Decision Coverage**.

---

Extra: Lỗi logic thường ẩn nấp ở nhánh False bị bỏ quên (ví dụ: biến không được khởi tạo nếu không thỏa mãn điều kiện `if`).
