---
noteId: 1789871821705
---

Trong Clean Architecture, tại sao Controller không bao giờ được phép gọi trực tiếp Repository mà phải qua Service Layer?

---

- **Ngăn rò rỉ nghiệp vụ**: Tránh phân tán Business Invariants ra tầng Controller; giữ tầng Service độc lập với giao thức truyền thông (HTTP, gRPC, CLI) để dễ tái sử dụng và kiểm thử.

---

Extra: Controller chỉ lo parse HTTP/DTO và trả mã trạng thái; Repository chỉ lo SQL/ORM và cấu trúc bảng; Service / Use Case sở hữu 100% Domain Logic và Invariants.
