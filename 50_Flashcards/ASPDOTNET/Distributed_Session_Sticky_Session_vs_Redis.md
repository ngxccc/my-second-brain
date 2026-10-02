---
noteId: 1790774286756
---

Khi chạy nhiều Server (Scale Out), tại sao Session mặc định bị lỗi và 2 cách khắc phục là gì?

---

- **Nguyên nhân lỗi:** Session mặc định lưu **In-Memory** (trong RAM của từng server). Khi Load Balancer điều phối Request 1 vào Server A (lưu giỏ hàng), Request 2 vào Server B -> Server B không có Session trong RAM -> Người dùng bị mất sạch giỏ hàng.
- **Hai cách khắc phục:**
  - **Sticky Session (Cấu hình trên Load Balancer):** Luôn ép cùng 1 Client về đúng 1 Server ban đầu. _(Nhược điểm: Server chết là mất session, không cân bằng tải đều)._
  - **Distributed Cache (Chuẩn Cloud - Redis):** Tách Session lưu tập trung vào Redis Server qua `AddStackExchangeRedisCache()`. Mọi server đều đọc/ghi chung 1 nguồn.

---

Extra: Trong kiến trúc Microservices/Web API hiện đại, giải pháp tối ưu nhất là chuyển sang dùng JWT (Stateless) để không tốn bộ nhớ lưu Session.
