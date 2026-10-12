---
noteId: 1791469635042
---

Sự khác biệt về bảo mật giữa cú pháp `{{ $data }}` và `{!! $data !!}` trong Blade Template Engine là gì?

---

- **`{{ $data }}` (Mặc định):** Tự động bọc dữ liệu qua hàm PHP `htmlspecialchars()`, ngăn chặn triệt để lỗ hổng XSS (Cross-Site Scripting).
- **`{!! $data !!}` (Raw Echo):** Xuất nguyên văn chuỗi thô bao gồm thẻ HTML/JavaScript không qua lọc mã độc, tiềm ẩn nguy cơ bảo mật nghiêm trọng.

---

Extra: Chỉ dùng `{!! !!}` cho nội dung HTML đáng tin cậy (ví dụ từ Rich Text Editor đã được sanitize ở backend qua HTMLPurifier).
