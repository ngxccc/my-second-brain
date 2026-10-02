---
noteId: 1790761561180
---

Quy trình xử lý của Data Annotations và `ModelState.IsValid` trong Controller ASP.NET Core?

---

- **Định nghĩa ràng buộc:** Dùng attributes (`[Required]`, `[MaxLength]`, `[EmailAddress]`) trên Model/DTO.
- **Tự động thẩm định:** Trong pha Model Binding, runtime tự động kiểm tra các ràng buộc và ghi nhận lỗi vào dictionary `ModelState`.
- **Kiểm tra trạng thái:** Lập trình viên kiểm tra `if (!ModelState.IsValid)` để trả về mã lỗi `400 Bad Request` hoặc render lại form kèm thông báo lỗi cho người dùng.

---

Extra: Trong `[ApiController]`, nếu `ModelState.IsValid == false`, framework sẽ tự động ngắt luồng và trả về mã HTTP `400 Bad Request` kèm theo chi tiết lỗi RFC 7807 (ProblemDetails) mà không cần viết `if (!ModelState.IsValid)` thủ công.
