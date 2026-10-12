---
noteId: 1791469635494
---

Phương thức `handle(Request $request, Closure $next)` trong Middleware điều phối luồng thực thi Request như thế nào?

---

- **Before Middleware:** Chạy mã kiểm tra/xác thực trước khi gọi `$next($request)` để tiếp tục chuyển giao request cho lớp xử lý tiếp theo.
- **After Middleware:** Gọi `$response = $next($request);`, sau đó can thiệp chỉnh sửa dữ liệu trên `$response` trước khi trả về client.

---

Extra: Nếu điều kiện bảo mật không thỏa (ví dụ chưa đăng nhập), Middleware có thể dừng pipeline ngay lập tức bằng `redirect()` hoặc ném `abort(403)`.
