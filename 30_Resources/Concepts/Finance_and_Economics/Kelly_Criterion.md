---
tags: [type/concept, status/permanent]
date: 2026-06-23
description: "Tối ưu hóa quy mô vị thế vốn bằng cách tối đa hóa kỳ vọng logarit tài sản, gồm công thức rời rạc, liên tục và fractional Kelly."
---

# Kelly Criterion

## TL;DR

- **Bản chất**: Kelly Criterion xác định tỷ lệ vốn tối ưu cho mỗi lần đặt cược bằng cách tối đa hóa kỳ vọng logarit của tài sản, không tối đa hóa lợi nhuận kỳ vọng.
- **Mục đích**: Đạt tốc độ tăng trưởng geometric cao nhất trong dài hạn mà vẫn tránh được nguy cơ phá sản.
- **Điểm mấu chốt**: Kelly đòi hỏi biết chính xác xác suất thắng và payoff; ước lượng lạc quan làm tỷ lệ vượt mức tối ưu và drawdown tăng nhanh hơn lợi nhuận, nên thực tế thường dùng fractional Kelly.

## Core Concept

Công thức Kelly hoạt động trên nguyên lý tối đa hóa kỳ vọng tăng trưởng dài hạn thay vì lợi nhuận ngắn hạn, đồng thời giảm thiểu rủi ro phá sản (risk of ruin).

### 1. Công thức Kelly cho phân phối rời rạc

Áp dụng cho giao dịch hoặc trò chơi có kết quả nhị phân (chỉ thắng hoặc thua):

$$f^* = \frac{bp - q}{b} = \frac{p(b+1) - 1}{b}$$

- **$f^*$**: tỷ lệ phần trăm tối ưu của tổng vốn phân bổ vào giao dịch này.
- **$p$**: xác suất thắng ($0 \le p \le 1$).
- **$q$**: xác suất thua ($q = 1 - p$).
- **$b$**: tỷ lệ cược ròng (net odds) — nếu thắng nhận $b$ lần số tiền đã đặt (cược 1 ăn 2 thì $b = 2$).

### 2. Công thức Kelly cho phân phối liên tục

Áp dụng trong thị trường tài chính dưới giả định chuyển động Brownian hình học (Geometric Brownian Motion):

$$f^* = \frac{\mu}{\sigma^2}$$

- **$\mu$**: tỷ suất sinh lời vượt mức kỳ vọng (expected excess return) so với lãi suất phi rủi ro.
- **$\sigma^2$**: phương sai của tỷ suất sinh lời vượt mức đó.

Đối với danh mục nhiều tài sản (multivariate continuous Kelly): $f^* = \Sigma^{-1} \mu$, với $\Sigma$ là ma trận hiệp phương sai và $\mu$ là vector lợi nhuận vượt mức kỳ vọng.

### 3. Fractional Kelly

Dùng "Full Kelly" ($f = 1$) dẫn đến biến động tài sản cực lớn và rủi ro sụt giảm nghiêm trọng (drawdown), nên nhà đầu tư chuyên nghiệp thường áp dụng **Fractional Kelly**:

$$f_{\text{frac}} = \lambda \cdot f^* \quad (0 < \lambda < 1)$$

- **Half-Kelly ($\lambda = 0.5$)**: đặt 50% tỷ lệ khuyến nghị của Kelly.
- **Mối quan hệ phi tuyến giữa tăng trưởng và tỷ lệ đặt cược:** tốc độ tăng trưởng vượt mức $g(\lambda f^*)$ liên hệ với tốc độ tối đa của Full Kelly $g^*$ theo $g(\lambda f^*) = \lambda(2 - \lambda) g^*$.
  - Với Half-Kelly, nhà đầu tư giữ lại $0.5 \times (2 - 0.5) = 75\%$ tốc độ tăng trưởng của Full Kelly.
  - Đổi lại, biến động (standard deviation) của danh mục giảm một nửa, hạn chế các pha sụt giảm cực hạn và tăng ổn định tâm lý.

### 4. Shannon's Demon

Ứng dụng kinh điển của tư duy Kelly trong tái cân bằng danh mục, phát triển bởi Claude Shannon:

- **Kịch bản:** một tài sản biến động ngẫu nhiên (đi ngang, kỳ vọng sinh lời dài hạn bằng 0) và một lượng tiền mặt.
- **Chiến thuật:** định kỳ tái cân bằng để luôn giữ tỷ lệ **50% tài sản rủi ro và 50% tiền mặt** — mức phân bổ tối ưu theo Kelly cho tài sản đi ngang nhưng biến động cao.
- **Kết quả:** bằng cách liên tục bán ra khi giá tăng và mua vào khi giá giảm để giữ tỷ lệ 50/50, danh mục tăng trưởng dương theo cấp số nhân trong dài hạn — minh chứng rằng chỉ nhờ quản trị quy mô vị thế và kỷ luật tái cân bằng đã tạo ra lợi nhuận bền vững.

## Related Notes

- Ví dụ tính toán, giới hạn và kỷ luật khi áp dụng: [[Kelly_Criterion_Application_and_Limits]]
- Phương pháp tích sản định kỳ bảo vệ vốn: [[Dollar_Cost_Averaging]]
- Tâm lý gồng lỗ và chi phí cơ hội: [[Opportunity_Cost_Hold]]
