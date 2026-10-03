---
noteId: 1790774286756
---

Khi mở rộng nhiều Server (Scale Out), tại sao Session mặc định bị mất và giải pháp chuẩn Cloud là gì?

---

- **Nguyên nhân lỗi**: Session mặc định lưu trong RAM của từng máy; Load Balancer điều phối request sang server khác sẽ không tìm thấy session cũ.
- **Giải pháp Distributed Cache**: Tách session lưu tập trung vào Redis Server qua `AddStackExchangeRedisCache()`, mọi instance đều đọc/ghi chung một nguồn.

---

Extra: Sticky Session trên Load Balancer ép client về cùng 1 server nhưng không cân bằng tải đều và mất dữ liệu khi server đó sập. Web API hiện đại ưu tiên dùng JWT Stateless.
