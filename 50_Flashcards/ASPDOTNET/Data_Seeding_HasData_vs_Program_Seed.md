---
noteId: 1790761561206
---

Trong EF Core, Data Seeding qua Migration (`HasData()`) và Seed qua `Program.cs` khác nhau thế nào?

---

- **`HasData()` (Migration)**: Dữ liệu biến thành các câu `INSERT` trong file migration; bắt buộc chỉ định ID cố định; phù hợp cho Lookup Data tĩnh (Roles, danh mục).
- **Seed qua `Program.cs`**: Chạy code kiểm tra và nạp dữ liệu lúc khởi động app; không làm phình file migration; phù hợp cho dữ liệu thử nghiệm lớn (Mock Data).

---

Extra: HasData() quản lý phiên bản dữ liệu như schema CSDL. Seed qua Program.cs dùng scope `serviceProvider.GetRequiredService<AppDbContext>()`.
