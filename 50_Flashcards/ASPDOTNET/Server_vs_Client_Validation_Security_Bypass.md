---
noteId: 1790761561951
---

Tại sao có Client-side Validation rồi nhưng Server-side `ModelState.IsValid` vẫn là tuyến phòng thủ bắt buộc?

---

- **Dễ dàng bị Bypass:** Client-side Validation chỉ phục vụ nâng cao UX; kẻ tấn công có thể tắt JavaScript, dùng Postman/cURL hoặc can thiệp proxy (Burp Suite) để gửi payload độc hại trực tiếp lên API.
- **Server-side Validation:** Là ranh giới bảo mật tối thượng đảm bảo tính toàn vẹn của dữ liệu trước khi chạm vào Database.

---

Extra: Luôn luôn tuân thủ nguyên tắc Zero Trust: Coi mọi dữ liệu đến từ HTTP Request đều là dữ liệu bẩn và có nguy cơ độc hại cho đến khi được Server xác thực hợp lệ.
