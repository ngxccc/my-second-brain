---
noteId: 1790774286588
---

Gắn thuộc tính `[ApiController]` lên Web API Controller giúp bạn KHỎI PHẢI VIẾT những đoạn code thủ công nào?

---

- **Tự động bắt lỗi Validation (Auto 400):** Không cần viết `if (!ModelState.IsValid) return BadRequest();`. Dữ liệu sai ràng buộc là framework tự chặn và trả về mã 400.
- **Tự động đoán nguồn Binding:** Tự hiểu Object phức tạp lấy từ JSON Body, biến đơn giản (`id`) lấy từ URL Route/Query mà không cần gõ `[FromBody]`, `[FromQuery]` khắp nơi.
- **Ép buộc Attribute Routing:** Bắt buộc dùng `[Route("api/[controller]")]`, ngăn chặn việc gọi nhầm qua cơ chế routing của trang web HTML truyền thống.

---

Extra: Ghi nhớ 3 chữ: "Tự chặn lỗi - Tự map JSON - Ép route API". Định dạng lỗi tự động trả về tuân theo chuẩn RFC 7807 ProblemDetails.
