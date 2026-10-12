---
noteId: 1791469636210
---

Phân hoạch tương đương cho trường Repassword (Xác nhận mật khẩu) bao gồm những lớp nào?

---

- **Lớp hợp lệ**: Chuỗi ký tự trùng khớp hoàn toàn từng ký tự (kể cả chữ hoa/thường) với Password đã nhập.
- **Lớp không hợp lệ**: Chuỗi khác với Password (sai khác chữ hoa/thường, thừa/thiếu ký tự, sai khoảng trắng) hoặc để trống.

---

Extra: Trường Repassword không cần kiểm tra lại các ràng buộc độ dài hay ký tự đặc biệt của Password, mà chỉ tập trung kiểm tra tính nhất quán (Consistency Check) giữa hai chuỗi.
