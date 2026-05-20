# RFC: Hệ Thống Caching Cho Endpoint Bảng Xếp Hạng Realtime

## 1. Bối Cảnh & Vấn Đề
- Endpoint `/v1/creators/trending` đang dính Over-engineering do phải thực hiện câu lệnh COUNT và SORT trên PostgreSQL liên tục, gây CPU spike 100% khi có 5000 requests/giây.

## 2. Giải Pháp Đề Xuất
- Tích hợp Redis làm tầng Cache đệm phía trước.
- Sử dụng cấu trúc dữ liệu Sorted Sets (ZSET) của Redis để cập nhật điểm số realtime của Creator bằng lệnh `ZINCRBY`.

## 3. Đánh Đổi (Trade-offs)
- **Điểm cộng:** Tốc độ đọc đạt O(1), giải phóng 90% tải trọng cho PostgreSQL.
- **Điểm trừ:** Chấp nhận rủi ro bất đồng bộ dữ liệu (Eventual Consistency) trong khoảng thời gian 5 giây giữa Cache và Database chính.