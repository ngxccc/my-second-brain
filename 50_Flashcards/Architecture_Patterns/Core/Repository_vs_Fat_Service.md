---
noteId: 1783153909297
---

Điểm khác biệt cốt lõi trong cách Tầng Nghiệp vụ (Business Logic) tương tác với Cơ sở dữ liệu giữa Repository Pattern và Fat Service (Direct ORM) là gì?

---

- **Repository Pattern**: Tầng Service chỉ tương tác qua một **Interface trừu tượng** (ví dụ: `IUserRepository`). Toàn bộ chi tiết SQL/ORM được giấu kín bên dưới tầng Infrastructure $\rightarrow$ Đạt chuẩn _Persistence Ignorance_.
- **Fat Service**: Service gọi trực tiếp instance của ORM (ví dụ: `db.select().from(users)...`) ngay trong thân hàm để cắt giảm tối đa code boilerplate.

---

Extra: Repository Pattern tăng tính đóng gói và dễ viết Unit Test giả lập (Mocking) nhưng tốn nhiều file trung gian; Fat Service tối ưu hóa tốc độ triển khai và linh hoạt khi viết câu query phức tạp nhưng bị phụ thuộc chặt (tight coupling) vào ORM.
