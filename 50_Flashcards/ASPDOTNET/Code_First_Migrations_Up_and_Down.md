---
noteId: 1790761561106
---

Vai trò của phương thức `Up()` và `Down()` trong file EF Core Migration là gì?

---

- **`Up()`:** Chứa các thao tác DDL (tạo bảng, thêm cột, tạo index) để nâng cấp Schema Database lên phiên bản mới nhất.
- **`Down()`:** Chứa các thao tác đảo ngược (xóa bảng, bỏ cột) để rollback Database về trạng thái ngay trước đó khi xảy ra sự cố.

---

Extra: Phương thức `modelBuilder.Entity<Product>().HasData(...)` trong `OnModelCreating` dùng để nạp dữ liệu mồi (Data Seeding) và cũng được quản lý thông qua file Migration.
