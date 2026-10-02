---
noteId: 1790738820534
---

Trong kiến trúc Go chuyên nghiệp (Clean Architecture / DDD), tại sao Domain Entity luôn được định nghĩa thủ công bằng tay (Plain Struct), trong khi Database Model và API DTO lại có thể sinh tự động bằng công cụ (CodeGen như `sqlc`, `oapi-codegen`)?

---

- **Tính thuần khiết của tầng nghiệp vụ (Domain Purity):**
  - Tầng Domain là trái tim của hệ thống, chứa các quy tắc bất biến (Business Invariants). Nó **tuyệt đối không được phụ thuộc vào bất kỳ công nghệ hay framework bên ngoài nào** (Database, JSON, gRPC, HTTP).
  - Định nghĩa thủ công giúp kỹ sư kiểm soát 100% kiểu dữ liệu, đóng gói phương thức và không bị phụ thuộc vào mã tự sinh (Generated Code).
- **Ranh giới phân tách (Separation of Concerns):**
  - **Tầng Database (Repository):** Dùng `sqlc` đọc SQL schema để sinh ra các struct DB tự động (ví dụ: `AccountRow`), tối ưu hóa tốc độ và giảm thiểu lỗi gõ sai tên cột.
  - **Tầng API (Transport):** Dùng công cụ sinh DTO request/response từ OpenAPI spec.
  - Sau đó, tầng Repository/Handler chỉ làm nhiệm vụ ánh xạ (Mapping) giữa DB Model $\leftrightarrow$ Domain Entity $\leftrightarrow$ DTO.

---

Extra: Tránh bẫy Anti-pattern kinh điển: Dùng 1 Struct duy nhất cõng đủ loại Tags (`json:"..." db:"..." gorm:"..." validate:"..."`). Điều này vi phạm nguyên lý Single Responsibility và biến Domain Entity thành "nô lệ" của cấu trúc bảng database.
