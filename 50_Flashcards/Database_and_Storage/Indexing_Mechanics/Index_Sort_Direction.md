---
noteId: 1783153909180
---

Khi tạo Composite B-Tree Index `(created_at DESC, id ASC)` trong PostgreSQL, tại sao việc chỉ định rõ chiều sắp xếp (`ASC`/`DESC`) lại quan trọng đối với các truy vấn phân trang?

---

Vì B-Tree Index mặc định có thể duyệt xuôi hoặc ngược, nhưng **chỉ duyệt hiệu quả một chiều cố định cho toàn bộ tuple**.

Nếu câu lệnh `ORDER BY created_at DESC, id ASC` mà Index là `(created_at, id)` (mặc định cả hai đều `ASC`), Database Engine **không thể dùng Index để sắp xếp hai cột ngược chiều nhau** và bắt buộc phải dùng thêm bước **Sort Node trong bộ nhớ RAM** (gây chậm và tốn tài nguyên).

---

Extra: Luôn khai báo chiều sắp xếp của Index trùng khớp chính xác với mệnh đề `ORDER BY` của câu truy vấn phân trang có điều kiện đa cột.
