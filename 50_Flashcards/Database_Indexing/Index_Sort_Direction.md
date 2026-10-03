---
noteId: 1783153909180
---

Khi Composite Index là `(created_at, id)` (mặc định ASC), tại sao truy vấn `ORDER BY created_at DESC, id ASC` lại gây suy giảm hiệu năng?

---

- **Xung đột chiều duyệt**: B-Tree chỉ duyệt hiệu quả một chiều cố định cho toàn bộ tuple; không thể vừa duyệt xuôi một cột vừa duyệt ngược cột kia.
- **Chi phí Sort Node**: Database Engine bắt buộc phải dùng thêm Sort Node trong RAM để sắp xếp lại kết quả thay vì tận dụng thứ tự sẵn có của Index.

---

Extra: Luôn khai báo chiều sắp xếp của Index trùng khớp chính xác với mệnh đề `ORDER BY` của câu truy vấn phân trang có điều kiện đa cột.
