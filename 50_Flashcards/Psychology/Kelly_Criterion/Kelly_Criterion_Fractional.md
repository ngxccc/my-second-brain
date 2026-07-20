---
noteId: 1784116411028
---

Tại sao các nhà quản lý quỹ chuyên nghiệp thường sử dụng Fractional Kelly (đặc biệt là Half-Kelly) thay vì Full Kelly?

---

Sử dụng **Fractional Kelly** (đặc biệt là **Half-Kelly** với $\lambda = 0.5$) được ưu tiên vì:

1. **Giảm thiểu biến động (Volatility):** Full Kelly gây ra biến động tài sản cực kỳ lớn và rủi ro sụt giảm tài sản nghiêm trọng (drawdown) trong ngắn hạn.
2. **Hiệu suất phi tuyến tối ưu:** Half-Kelly giảm rủi ro biến động đi một nửa ($50\%$), nhưng vẫn giữ lại được **75%** tốc độ tăng trưởng dài hạn của Full Kelly (theo công thức: $g(\lambda f^*) = \lambda(2 - \lambda) g^*$).
3. **Biên an toàn trước sai số (Estimation Error):** Trong thực tế, xác suất thắng $p$ và tỷ lệ cược $b$ luôn là ước tính chủ quan. Đặt cược theo Half-Kelly giúp bảo vệ tài khoản khỏi nguy cơ phá sản nếu ước tính bị sai lệch.
