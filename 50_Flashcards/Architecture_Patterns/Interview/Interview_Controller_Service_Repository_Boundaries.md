---
noteId: 1789871821705
---

[Phỏng vấn Backend]: "Trong Clean Architecture / Domain-Driven Design, tại sao Controller không bao giờ được phép gọi trực tiếp Repository mà bắt buộc phải thông qua Service/Use Case Layer? Ranh giới trách nhiệm ở đây là gì?"

---

- **Ranh giới trách nhiệm (Separation of Concerns):**
  - **Controller:** Chỉ chịu trách nhiệm về Giao thức truyền thông (HTTP status, parse request body, validate cú pháp header/query).
  - **Repository:** Chỉ chịu trách nhiệm về Cơ chế lưu trữ (Persistence Mechanics: SQL queries, ORM, Table schema).
  - **Service / Use Case:** Chịu trách nhiệm về **Quy tắc nghiệp vụ thuần túy (Business Invariants & Domain Logic)**.

- **Hậu quả nếu Controller gọi thẳng Repository:**
  - Nghiệp vụ bị rò rỉ (Business Logic Leakage) rải rác khắp các Controller.
  - Khi cần đổi từ HTTP API sang gRPC, CLI hoặc Event Consumer, toàn bộ logic nghiệp vụ phải bị viết lại từ đầu.
  - Vi phạm nguyên lý **Single Responsibility** và làm mất khả năng viết Unit Test độc lập không cần DB.

---

Extra: Trong Clean Architecture, Domain Model và Use Case nằm ở trung tâm (Core), hoàn toàn không phụ thuộc vào Database hay Web Framework (Dependency Inversion Principle).
