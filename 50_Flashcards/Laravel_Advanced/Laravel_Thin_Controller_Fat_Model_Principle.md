---
noteId: 1791469635917
---

Triết lý "Thin Controller, Fat Model" trong kiến trúc Laravel MVC phân định trách nhiệm như thế nào?

---

- **Thin Controller:** Chỉ làm nhiệm vụ điều hướng luồng (flow orchestration), tiếp nhận input đã validate, gọi Model/Action xử lý và trả về Response.
- **Fat Model / Services:** Đảm nhận toàn bộ Business Logic, tính toán phức tạp, query scopes và quan hệ dữ liệu.

---

Extra: Trong các hệ thống quy mô lớn, Business Logic tiếp tục được tách từ Model sang các lớp Action hoặc Service pattern chuyên biệt để tránh God Model.
