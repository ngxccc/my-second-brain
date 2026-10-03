---
noteId: 1790774286656
---

Tại sao `.AsNoTracking()` trong EF Core lại tăng tốc truy vấn và khi nào tuyệt đối không được dùng?

---

- **Cơ chế tăng tốc**: Tắt bỏ Change Tracker của EF Core, tiết kiệm RAM lưu snapshot và giảm chu kỳ CPU so sánh trạng thái (nhanh hơn 20-40%).
- **Cấm dùng khi**: Cần cập nhật hoặc chỉnh sửa bản ghi đó trong cùng request (`SaveChanges()` sẽ không phát hiện thay đổi).

---

Extra: Luôn áp dụng .AsNoTracking() cho tất cả các trang hiển thị danh sách, báo cáo hoặc các GET API chỉ đọc dữ liệu.
