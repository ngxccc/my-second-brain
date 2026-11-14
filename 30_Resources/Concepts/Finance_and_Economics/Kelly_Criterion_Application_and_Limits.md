---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba ví dụ tính Kelly (cá cược nhị phân, vị thế cổ phiếu, mô phỏng Python) và các giới hạn bắt buộc nhớ khi áp dụng vào thị trường thật."
---

# Kelly Criterion: Ví dụ và Giới hạn Áp dụng

## TL;DR

- **Bản chất**: Ba ví dụ tính $f^*$ (đồng xu lệch, cổ phiếu công nghệ, mô phỏng 10.000 đường) cộng bốn giới hạn khiến Full Kelly không dùng được nguyên bản.
- **Mục đích**: Biết con số Kelly cụ thể trông thế nào, và biết vì sao thực tế phải hạ xuống Half-Kelly hoặc Quarter-Kelly.
- **Điểm mấu chốt**: Vượt quá $2f^*$ thì tăng trưởng kỳ vọng âm và phá sản là chắc chắn trong dài hạn — sai số ước lượng là lý do chính phải chiết khấu tỷ lệ.

## Ví dụ 1: Cá cược nhị phân

- **Kịch bản:** đồng xu không đồng chất có $p = 60\%$, $q = 40\%$, tỷ lệ ăn ròng $b = 1$.
- **Full Kelly:** $f^* = \frac{1 \times 0.6 - 0.4}{1} = 0.2$ → đặt đúng **20%** vốn hiện tại mỗi lần.
- **Half-Kelly:** $f_{\text{half}} = 0.5 \times 20\% = 10\%$.

## Ví dụ 2: Vị thế cổ phiếu

- **Kịch bản:** cổ phiếu công nghệ có $\mu = 10\%$/năm, $\sigma = 20\%$ → $\sigma^2 = 0.04$.
- **Full Kelly:** $f^* = \frac{0.10}{0.04} = 2.5$ → khuyến nghị dùng đòn bẩy $2.5\times$ vốn tự có.
- **Half-Kelly:** $f_{\text{half}} = 1.25$ → đòn bẩy $1.25\times$.

## Ví dụ 3: Mô phỏng bằng Python

Mã dưới đây mô phỏng tài sản sau 100 lần tung đồng xu lệch ($p=0.6$, $b=1$) với các tỷ lệ cược khác nhau:

```python
import numpy as np

def simulate_path(p, b, fraction, steps=100, init_capital=100):
    capital = init_capital
    for _ in range(steps):
        bet = capital * fraction
        if np.random.rand() < p:
            capital += bet * b  # Thắng
        else:
            capital -= bet      # Thua
        if capital <= 0:
            return 0
    return capital

# Chạy mô phỏng 10,000 lần cho 3 chiến lược:
# 1. Half-Kelly (10%): Tăng trưởng ổn định, sụt giảm tài sản thấp.
# 2. Full Kelly (20%): Tăng trưởng cao nhất dài hạn nhưng biến động cực kỳ lớn.
# 3. Overbetting : Kỳ vọng dài hạn âm, có nguy cơ cháy tài khoản rất cao.
```

## Giới hạn và kỷ luật khi áp dụng

- **Overbetting:** đặt lớn hơn $f^*$ làm tốc độ tăng trưởng dài hạn sụt giảm; vượt quá $2f^*$ thì tăng trưởng kỳ vọng âm và dẫn đến phá sản chắc chắn (certain ruin) trong dài hạn.
- **Sai số ước lượng (Estimation Error):** $p$, $b$, $\mu$, $\sigma^2$ trong thực tế là ước lượng lịch sử hoặc kỳ vọng cá nhân, không bao giờ hoàn hảo. Phóng đại biên an toàn hoặc đánh giá quá cao xác suất thắng sẽ dẫn tới overbetting, nên Half-Kelly hoặc Quarter-Kelly luôn được ưu tiên.
- **Giả định tĩnh (Stationarity):** công thức giả định thị trường có thuộc tính thống kê không đổi; thực tế biến động thay đổi liên tục (non-stationarity), đòi hỏi cập nhật định kỳ ma trận hiệp phương sai và lợi nhuận kỳ vọng.

## Related Notes

- Công thức Kelly rời rạc, liên tục và fractional Kelly: [[Kelly_Criterion]]
- [[Dollar_Cost_Averaging]]: Phương pháp tích sản định kỳ bảo vệ vốn, thường ghép với Half-Kelly.
- [[Opportunity_Cost_Hold]]: Tâm lý gồng lỗ và chi phí cơ hội khi vị thế đi ngược.
- [[Short_Term_Income_and_Defensive_Saving]]: Bệ đỡ an toàn trước khi nghĩ tới đòn bẩy.
