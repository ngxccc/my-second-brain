---
noteId: 1790761561180
---

Quy trình hoạt động của Data Annotations và `ModelState.IsValid` trong Controller ASP.NET Core là gì?

---

- **Khai báo ràng buộc**: Dùng attributes (`[Required]`, `[MaxLength]`) trên DTO; trong pha Model Binding, runtime tự thẩm định và ghi lỗi vào `ModelState`.
- **Kiểm tra trạng thái**: Lập trình viên kiểm tra `if (!ModelState.IsValid)` để trả về lỗi `400 Bad Request` hoặc render lại form kèm thông báo lỗi.

---

Extra: Trong [ApiController], nếu ModelState.IsValid == false, framework tự động ngắt luồng và trả về mã HTTP 400 kèm định dạng ProblemDetails (RFC 7807).
