---
noteId: 1790774286656
---

Tại sao `.AsNoTracking()` trong EF Core lại tăng tốc truy vấn, và khi nào TUYỆT ĐỐI KHÔNG được dùng?

---

- **Cơ chế tăng tốc:** Mặc định EF Core lưu bản sao Entity vào bộ nhớ **Change Tracker** để phát hiện thay đổi khi lưu. Gắn `.AsNoTracking()` sẽ tắt bỏ việc theo dõi này:
  - **Tiết kiệm RAM:** Không tốn bộ nhớ lưu snapshot theo dõi.
  - **Tăng tốc CPU:** Bỏ qua các phép băm và so sánh trạng thái (nhanh hơn 20-40% khi nạp danh sách lớn).
- **Tuyệt đối KHÔNG dùng khi:** Cần cập nhật hoặc chỉnh sửa bản ghi đó trong cùng 1 request (`db.SaveChanges()` sẽ hoàn toàn vô dụng vì context không hề theo dõi entity đó).

---

Extra: Dùng `.AsNoTracking()` cho tất cả các trang danh sách, báo cáo hoặc GET API chỉ để hiển thị dữ liệu.
