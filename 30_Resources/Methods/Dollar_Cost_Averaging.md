---
tags: [type/method, topic/finance, topic/algorithm, lang/typescript]
status: seeding
created_at: Friday, January 30th 2026, 9:00:00 am +07:00
updated_at: Friday, January 30th 2026, 9:01:03 am +07:00
aliases: [DCA, Trung Bình Giá, Investment Cron Job]
---

# Dollar Cost Averaging (DCA)

## 💡 TL;DR

Chiến thuật chia nhỏ vốn để đầu tư định kỳ bất chấp biến động giá, nhằm triệt tiêu yếu tố cảm xúc (FOMO/Panic) và tự động đưa giá vốn về mức trung bình của thị trường.

---

## 🧠 Why use it?

*Vấn đề muôn thuở: "Market Timing" (Căn thời điểm bắt đáy) là nhiệm vụ bất khả thi với người thường (và cả chuyên gia).*

- **Problem:**
    - Cố gắng "bắt đáy" thường dẫn đến việc "bắt dao rơi" (bắt xong giá giảm tiếp).
    - **All-in** một cục gây áp lực tâm lý cực lớn khi thị trường điều chỉnh (Correction) -> Dễ cắt lỗ ngay đáy.
    - Không phù hợp với sinh viên/người đi làm có dòng tiền thu nhập theo tháng (Input stream nhỏ giọt).

- **Solution:** Biến việc đầu tư thành một thuật toán phi cảm xúc (Stateless Algorithm). Cứ đến ngày (trigger) là mua, không quan tâm giá xanh hay đỏ.

- **vs Alternative:** **Lump Sum (All-in)**.
    - *All-in* tối ưu lợi nhuận (Profit Maximization) trong thị trường Bull Run (tăng trưởng đều).
    - *DCA* tối ưu tâm lý (Risk Minimization) và dòng tiền trong thị trường biến động (Volatile).

## 🔍 Deep Dive

1.  **Principle 1: Volatility Smoothing (Làm mượt biến động):**
    Công thức toán học của giá vốn trung bình:
    $$P_{avg} = \frac{\sum Cost_i}{\sum Quantity_i}$$
    - Khi giá **giảm**: Cùng số tiền cố định sẽ mua được *nhiều lượng tài sản (units) hơn*.
    - Khi giá **tăng**: Mua được ít hơn.
    -> Hệ thống tự động cân bằng giá vốn (Self-balancing).

2.  **Principle 2: Automation (Tự động hóa):**
    DCA hoạt động như một `Cron Job` chạy background. Nó loại bỏ bước "Ra quyết định" (Decision making) - nơi dễ phát sinh lỗi do tâm lý con người (Human Error/Bias).

---

## 💻 Code Snippet / Implementation

Mô phỏng logic DCA so với All-in bằng TypeScript (Tư duy lập trình):

```typescript
interface Strategy {
  execute(totalCapital: number, priceData: number[]): number; // Return units bought
}

// Chiến thuật DCA (Chậm mà chắc)
const DCAStrategy: Strategy = {
  execute: (totalCapital, priceData) => {
    const periods = priceData.length;
    const monthlyBudget = totalCapital / periods; // Chia vốn đều cho các tháng (Batch processing)
    let totalUnits = 0;

    // Vòng lặp mua đều đặn (Cron Job logic)
    priceData.forEach((price, month) => {
      // Giá thấp thì mua được nhiều unit, giá cao mua được ít
      const unitsBought = monthlyBudget / price;
      totalUnits += unitsBought;
      console.log(`Month ${month}: Bought at ${price} -> +${unitsBought.toFixed(4)} units`);
    });
    
    return totalUnits;
  }
};

// Usage simulation
const prices = [100, 80, 60, 80, 100]; // Thị trường hình chữ V
const myResult = DCAStrategy.execute(1000, prices);
```

---

## ⚠️ Edge Cases / Pitfalls

### Khi nào DCA biến thành "Tối ưu hóa ngược"?

- ❌ **Don't (Linear Uptrend):** Áp dụng DCA trong thị trường tăng trưởng vĩnh viễn (Bull Run điên cuồng). Lúc này mua sớm (Lump Sum) luôn lợi hơn việc mua rải rác giá cao dần.
- ❌ **Don't (Linear Downtrend):** Áp dụng DCA cho tài sản "Rác" (Shitcoin, cổ phiếu công ty phá sản). DCA lúc này là hành động "bắt dao rơi" liên tục -> Lỗ kép.

- ✅ **Do:** Chỉ DCA với tài sản có **Giá trị nội tại dài hạn** (Vàng, Bitcoin, Index Fund S&P500) mà bạn có niềm tin (Thesis) là trong 5-10 năm tới nó sẽ tăng.

---

## 🚨 Troubleshooting

### 🔧 Tâm lý chiến (Psychological Bugs)

#### 1. "Thấy nó giảm sâu quá, thôi ngưng DCA đợi đáy rồi mua"
- **Lỗi:** Phá vỡ kỷ luật hệ thống. Thường bạn sẽ không bao giờ mua lại được, hoặc sẽ mua lại khi giá đã bay cao (FOMO).
- **Fix:** Set lệnh tự động (Auto Invest) trên app ngân hàng/sàn để không can thiệp bằng tay.

#### 2. Hết tiền giữa đường (Out of Memory)
- **Lỗi:** Dùng tiền sinh hoạt phí (Living expenses) để DCA. Khi cần tiền gấp phải bán tài sản giá đáy.
- **Fix:** Chỉ DCA bằng tiền nhàn rỗi (Idle Money) sau khi đã trừ đi Quỹ khẩn cấp.

---

## 📄 Advanced Mechanics

### Value Averaging (Biến thể nâng cao)
Thay vì mua số tiền cố định ($100/tháng), bạn mua để **tổng giá trị tài sản** tăng đều ($1000 -> $1100 -> $1200).
- Nếu giá giảm sâu: Bạn phải mua cực nhiều -> Kích thích bắt đáy mạnh hơn DCA thường.
- Nếu giá tăng mạnh: Bạn mua ít lại hoặc thậm chí BÁN RA -> Tự động chốt lời.
*(Yêu cầu tính toán phức tạp hơn DCA truyền thống)*

---

## 🔗 Connections

### Internal

- [[Opportunity_Cost_Hold]] - Tâm lý khi phải gồng lệnh DCA lâu dài.
- [[Safe_Haven_Asset]] - Loại tài sản an toàn (Vàng) phù hợp nhất để DCA.
- [[Finances/My_Investment_Strategy]] - File config cá nhân cho kế hoạch tài chính.

### External

- [Investopedia - Dollar-Cost Averaging Explained](https://www.investopedia.com/terms/d/dollarcostaveraging.asp)
- [Calculator: DCA vs Lump Sum](https://www.dca-calculator.com/)