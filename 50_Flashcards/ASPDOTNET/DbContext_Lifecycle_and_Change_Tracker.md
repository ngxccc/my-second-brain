---
noteId: 1790761561233
---

Vòng đời tiêu chuẩn của `DbContext` trong Web API và cơ chế Change Tracker hoạt động ra sao?

---

- **Vòng đời Scoped:** `DbContext` luôn được đăng ký dưới dạng `Scoped` (mỗi HTTP Request có 1 instance riêng, tự động giải phóng khi kết thúc request).
- **Change Tracker:** Tự động theo dõi các Entity được nạp vào bộ nhớ qua các trạng thái (`Added`, `Modified`, `Deleted`, `Unchanged`) để sinh câu lệnh SQL tương ứng khi gọi `SaveChangesAsync()`.

---

Extra: Để tối ưu hiệu năng cho các truy vấn chỉ đọc (Read-only queries), sử dụng `.AsNoTracking()` để ngắt Change Tracker, giúp tiết kiệm bộ nhớ RAM và thời gian CPU.
