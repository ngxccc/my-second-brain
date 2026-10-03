---
noteId: 1790761561875
---

Tại sao trong Production, Kestrel Server luôn được đặt phía sau Reverse Proxy (Nginx, IIS, Cloudflare)?

---

- **Edge Defense & Bảo mật**: Kestrel tối ưu tốc độ I/O nội bộ nhưng không thiết kế để chống DDoS, Slowloris hoặc xử lý SSL/TLS termination quy mô lớn.
- **Routing & Static Files**: Reverse Proxy xử lý nén Gzip/Brotli, phục vụ tài nguyên tĩnh cực nhanh và cân bằng tải tới nhiều Kestrel instances.

---

Extra: Khi đứng sau Reverse Proxy, bắt buộc bật Middleware app.UseForwardedHeaders() để ASP.NET Core nhận diện đúng IP thật của Client (X-Forwarded-For) và giao thức HTTPS.
