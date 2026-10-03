---
noteId: 1790774286857
---

Đánh đổi cốt lõi giữa Stateful Cookie Session và Stateless JWT Authentication là gì?

---

- **Cookie Session**: Thu hồi phiên (đăng xuất/khóa tài khoản) tức thì trong RAM/DB, nhưng khó scale out và tốn bộ nhớ server.
- **Stateless JWT**: Mở rộng quy mô vô hạn vì server không tốn RAM lưu phiên, nhưng không thể thu hồi token khẩn cấp trước khi nó hết hạn.

---

Extra: Cookie phù hợp cho hệ thống MVC Monolith truyền thống; JWT tối ưu cho Mobile App, Microservices và hệ thống phân tán đa nền tảng.
