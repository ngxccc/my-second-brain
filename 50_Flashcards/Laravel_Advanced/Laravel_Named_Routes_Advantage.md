---
noteId: 1791469635617
---

Lợi ích cốt lõi của việc đặt tên cho Route bằng `->name(...)` so với việc hard-code URL là gì?

---

- **Decoupling URL path:** Cho phép tự do thay đổi đường dẫn URL mà không làm vỡ các liên kết và chuyển hướng trong toàn bộ mã nguồn.
- **Tạo URL động an toàn:** Sinh URL hoặc Redirect nhất quán qua helper `route('name', ['param' => $val])`.

---

Extra: Ví dụ khi đổi URL từ `/san-pham/{id}` sang `/products/{id}`, toàn bộ lệnh `route('products.show', $id)` trong View và Controller giữ nguyên hiệu lực.
