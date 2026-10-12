---
noteId: 1791101391605
---

Tại sao Redis dùng SDS (Simple Dynamic String) thay vì chuỗi `char*` chuẩn của ngôn ngữ C?

---

- **$O(1)$ Length & Binary Safety**: SDS lưu tường minh trường `len` để truy xuất độ dài $O(1)$ và không bị ngắt bởi ký tự null `\0`, cho phép chứa dữ liệu nhị phân tùy ý.
- **Buffer Overflow Defense**: SDS theo dõi dung lượng đã cấp phát `alloc` để tự động mở rộng vùng nhớ trước khi nối chuỗi.

---

Extra: Trong C libc, hàm `strlen()` duyệt qua toàn bộ chuỗi cho đến khi gặp `\0` tốn $O(N)$. SDS vẫn đặt ký tự `\0` ở cuối mảng `buf[]` để tương thích các hàm C libc mà không cần sao chép bộ nhớ.
