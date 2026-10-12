---
noteId: 1791448209905
---

Khi đặt thuộc tính `[AllowAnonymous]` trên một Action nằm trong Controller đã gắn `[Authorize]`, kết quả phân quyền sẽ ra sao?

---

- **Cơ chế ghi đè tuyệt đối:** `[AllowAnonymous]` có **độ ưu tiên cao nhất**. Nó sẽ ghi đè và vô hiệu hóa toàn bộ các thuộc tính `[Authorize]` trên cấp Controller.
- **Kết quả:** Action đó cho phép **tất cả mọi người truy cập công khai (nặc danh)** mà không cần đăng nhập hay kiểm tra bất kỳ quyền hạn nào.

---

Extra: Thường dùng cho các Action công khai nằm chung trong Controller yêu cầu bảo mật, ví dụ: Action `Login` hoặc `Register` nằm trong `AccountController` có `[Authorize]`.
