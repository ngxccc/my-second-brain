---
noteId: 1790774286684
---

Lỗi Captive Dependency trong ASP.NET Core DI là gì và tại sao inject `DbContext` vào `Singleton` lại nguy hiểm?

---

- **Bản chất lỗi**: Service sống lâu (`Singleton`) giữ tham chiếu service sống ngắn (`Scoped`), kéo dài tuổi thọ của service sống ngắn suốt vòng đời ứng dụng.
- **Hiểm họa với DbContext**: Gây lỗi đa luồng (`DbContext` không thread-safe), rò rỉ RAM (Change Tracker phình to) và trả về dữ liệu cũ (Stale Data).

---

Extra: Môi trường Development mặc định bật `ValidateScopes = true` để ném ngoại lệ InvalidOperationException ngay khi khởi động nếu phát hiện lỗi này.
