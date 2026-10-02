---
noteId: 1790761561875
---

Tại sao trong Production người ta đặt Kestrel Server phía sau Reverse Proxy (Nginx/IIS/Cloudflare) thay vì phơi trực tiếp ra Internet?

---

- **Edge Defense & Security:** Kestrel tối ưu cho tốc độ I/O nội bộ nhưng không thiết kế để chống tấn công DDoS phân tán, Slowloris, hoặc quản lý SSL/TLS termination quy mô lớn.
- **Request Routing & Static Files:** Reverse Proxy xử lý nén Gzip/Brotli, phục vụ tài nguyên tĩnh (Static Files) cực nhanh và cân bằng tải (Load Balancing) tới nhiều Kestrel instances.
- **Process Management:** Giám sát và tự động restart ứng dụng khi gặp lỗi crash bộ nhớ.

---

Extra: Khi đứng sau Reverse Proxy, cần cấu hình Middleware `app.UseForwardedHeaders(...)` để ASP.NET Core nhận diện đúng IP thật của Client (`X-Forwarded-For`) và giao thức (`X-Forwarded-Proto`).
