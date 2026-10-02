---
noteId: 1790774286684
---

Lỗi "Captive Dependency" trong ASP.NET Core DI là gì, và tại sao inject `DbContext` vào `Singleton` lại nguy hiểm?

---

- **Bản chất lỗi:** Service sống lâu (`Singleton`) "bắt giữ" service sống ngắn (`Scoped`/`Transient`), khiến service sống ngắn bị kéo dài tuổi thọ bất đắc dĩ suốt vòng đời app.
- **Hiểm họa khi inject `DbContext` vào `Singleton`:**
  - **Lỗi đa luồng (Not Thread-Safe):** `DbContext` không an toàn đa luồng. Hàng trăm HTTP request chạy song song gọi chung 1 instance sẽ văng ngoại lệ `InvalidOperationException`.
  - **Tràn RAM (Memory Leak):** Change Tracker lưu vết vĩnh viễn mọi Entity đã query mà không bao giờ giải phóng.
  - **Dữ liệu rác (Stale Data):** Cache cấp 1 trả dữ liệu cũ từ RAM thay vì đọc dữ liệu mới từ CSDL.

---

Extra: ASP.NET Core ở chế độ `Development` mặc định bật `ValidateScopes = true` để ném ngoại lệ và dừng app ngay khi khởi động nếu phát hiện lỗi này.
