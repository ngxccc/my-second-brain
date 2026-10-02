---
noteId: 1783153909297
---

Phân biệt ranh giới trách nhiệm giữa Service Layer và Repository Pattern trong Clean Architecture?

---

- **Service Layer:** Sở hữu Business Rules, Orchestration, Transaction Boundaries và Domain Invariants. Không chứa chi tiết truy vấn DB cụ thể.
- **Repository:** Đóng vai trò bộ sưu tập dữ liệu trừu tượng (In-memory collection illusion), ẩn giấu chi tiết ORM (Prisma/TypeORM/GORM/SQL) và cung cấp phương thức truy xuất dữ liệu nguyên tử.

---

Extra: Repository Pattern tăng tính đóng gói và dễ viết Unit Test giả lập (Mocking) nhưng tốn nhiều file trung gian; Fat Service tối ưu hóa tốc độ triển khai và linh hoạt khi viết câu query phức tạp nhưng bị phụ thuộc chặt (tight coupling) vào ORM.
