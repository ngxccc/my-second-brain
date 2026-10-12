---
noteId: 1791101391462
---

Trong bài toán giữ chỗ có thời hạn (như ghế xem phim), tại sao không nên dùng `BITFIELD` để nén trạng thái ghế ngay từ đầu?

---

- **Không hỗ trợ TTL từng phần tử**: Toàn bộ các bit nằm chung trong 1 Key duy nhất nên không thể đặt TTL độc lập cho từng ghế (ví dụ ghế A1 tự nhả sau 10 phút).
- **Độ phức tạp điều hướng**: Phải tự ánh xạ Seat ID sang bit offset và tự viết worker nền để đếm giờ giải phóng ghế.

---

Extra: Dùng String thông thường kết hợp Redlock (`SET seat:123 "user" EX 600`) cho phép tận dụng cơ chế TTL tự động của Redis, dễ debug và phát triển nhanh theo nguyên tắc Boring Architecture.
