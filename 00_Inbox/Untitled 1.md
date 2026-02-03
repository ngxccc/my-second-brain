### Các tính năng cần bổ sung (Necessary Improvements)

- **Rate Limiting cục bộ:** Chặn IP spam request để bảo vệ Key Pool của bạn (tránh trường hợp 1 đứa spam 1000 req/s làm chết hết key).
    
- **API Key Management:** Cho phép tạo "Virtual Key" (sk-...) để cấp cho bạn bè dùng, thay vì mở toang cửa (`cors: *`).
    
- **Dashboard Auth:** Thêm login đơn giản cho trang admin (Dashboard) để không ai khác xem được key của bạn.

**Q: Khi refactor, làm sao đảm bảo logic cũ không bị hỏng?** A: Logic quan trọng nhất là thuật toán chọn Key (`getOptimalKey`) và quản lý trạng thái (`trackRequest`). **Lời khuyên:** Hãy viết Unit Test cho `KeyService` trước. Trong file JS cũ ông không test được, nhưng sang TS ông có thể dùng Jest để giả lập: "Nếu tôi có 3 key, 1 key đang cooldown, hàm phải trả về key nào?". Đảm bảo cái lõi này đúng thì Frontend vẽ vời kiểu gì cũng được.

Ông có nên implement một lớp "Middle-man Filter" nhẹ ở backend của chính mình (ví dụ check keyword `ransomware`, `keylogger`) trước khi gửi request sang Google không? Hay ông chấp nhận rủi ro "chết chùm" vì tự do tuyệt đối?