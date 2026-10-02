---
noteId: 1790761561206
---

Trong Entity Framework Core, hai phương pháp nạp dữ liệu mẫu (Data Seeding) qua Migration (`modelBuilder.Entity().HasData()`) và nạp qua `Program.cs` khác nhau thế nào?

---

- **Phương pháp 1: Model Seed Data với `HasData()` (Quản lý qua Migration):**
  - Khai báo trực tiếp trong phương thức `OnModelCreating` của `DbContext`:
    `modelBuilder.Entity<Category>().HasData(new Category { Id = 1, Name = "Soccer" });`
  - _Cơ chế:_ EF Core coi dữ liệu này như một phần của Schema. Khi chạy `migrations add`, dữ liệu được chuyển thành các câu lệnh `INSERT DATA` trong file migration.
  - _Đặc điểm:_ Bắt buộc phải chỉ định khóa chính cụ thể (`Id = 1`). Phù hợp cho **dữ liệu tĩnh/danh mục hệ thống (Lookup Data)** ít khi thay đổi (như danh sách Role `Admin/User`, tỉnh thành, danh mục gốc).
- **Phương pháp 2: Seed Data lúc khởi động trong `Program.cs`:**
  - Viết một static class `SeedData.EnsurePopulated(WebApplication app)` gọi lúc khởi động ứng dụng. Dùng `scope.ServiceProvider.GetRequiredService<AppDbContext>()` để kiểm tra: `if (!context.Products.Any()) { context.Products.AddRange(...); context.SaveChanges(); }`.
  - _Đặc điểm:_ Không làm phình to các file migration. Phù hợp cho **dữ liệu thử nghiệm số lượng lớn (Mock/Dummy Data)** khi phát triển hoặc chạy bài Lab.

---

Extra: Trong Lab 07, `SeedData.EnsurePopulated` được gọi ngay sau khi `app.Run()` để tự động gọi `context.Database.Migrate()` và chèn dữ liệu mẫu nếu database đang rỗng.
