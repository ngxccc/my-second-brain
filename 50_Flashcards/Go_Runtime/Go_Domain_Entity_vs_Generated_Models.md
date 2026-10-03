---
noteId: 1790738820534
---

Trong Clean Architecture / DDD với Go, tại sao Domain Entity phải viết thủ công trong khi Database Model có thể sinh tự động?

---

- **Tính thuần khiết của Domain**: Tầng nghiệp vụ cốt lõi không được phụ thuộc vào database hay thư viện bên ngoài để bảo toàn Business Invariants.
- **Tách biệt ranh giới**: Tầng Repository sinh tự động (qua `sqlc`) để khớp schema DB, sau đó thực hiện mapping hai chiều với Domain Entity.

---

Extra: Tránh antipattern: Dùng 1 Struct ôm đồm đủ loại tags (`json:"..." db:"..." gorm:"..."`), biến Domain Entity thành nô lệ của DB.
