---
tags: [type/concept, topic/economics, topic/game_theory, topic/gold]
status: seeding
created_at: Friday, January 30th 2026, 9:00:12 am +07:00
updated_at: Friday, January 30th 2026, 9:05:12 am +07:00
aliases: [Spread, Bẫy Thanh Khoản, Bid-Ask Spread, Chênh lệch mua bán]
---

# Liquidity Trap & Spread (Bẫy Thanh Khoản & Chênh lệch giá)

## 💡 TL;DR

Hiện tượng chênh lệch giữa giá Mua vào (Bid) và giá Bán ra (Ask) bị nới rộng cực đại khi thị trường hoảng loạn (Panic), khiến nhà đầu tư bị lỗ ngay lập tức khi cố gắng thanh khoản, dù giá niêm yết trên bảng điện chưa giảm sâu.

---

## 🧠 Why use it?

*Tại sao nhìn trên app/bảng điện thấy có lãi, nhưng mang ra tiệm bán lại lỗ chổng vó?*

- **Problem:**
    - Người mới (Newbie) thường mắc bẫy **"Paper Profit"** (Lãi trên giấy). Họ tính lãi dựa trên giá họ *thấy* (thường là giá Ask hoặc giá tham chiếu trung gian).
    - Quên mất rằng mình luôn phải Mua ở giá Cao (Ask) và Bán ở giá Thấp (Bid).

- **Solution:** Luôn tính toán dựa trên **Realized PnL** (Lời lỗ thực hiện) với công thức khắc nghiệt: Lấy giá Bid hiện tại của nhà cái trừ đi Spread.

- **vs Alternative:**
    - *Thị trường thanh khoản cao (Forex/Stock quốc tế):* Spread gần như bằng 0 (vài pips).
    - *Thị trường vàng vật chất/BĐS:* Spread cực lớn, là rào cản chí mạng cho việc lướt sóng ngắn hạn.

## 🔍 Deep Dive

1.  **Principle 1: Asymmetric Information (Thông tin bất cân xứng):**
    Nhà cái (Market Maker/Tiệm vàng) luôn nắm rõ luồng lệnh (Order Flow) và nguồn cung hơn người dân. Khi có biến (Panic Selling), họ phòng thủ rủi ro cho chính họ bằng cách:
    - Hạ giá mua vào cực thấp (hoặc ngừng mua).
    - Giữ nguyên giá bán ra để neo tâm lý.
    -> Spread bị kéo dãn ra (Widen Spread).

2.  **Principle 2: The Kill Zone Formula:**
    Công thức lỗ ngay khi bước chân ra khỏi cửa hàng:
    $$Loss_{instant} = P_{ask} - P_{bid} = Spread$$
    - Bình thường: Spread $\approx$ 1-2% (Chấp nhận được).
    - Panic Mode: Spread $\approx$ 5-10% (Vừa mua xong đã lỗ 10%).

---

## 💻 Code Snippet / Implementation

Mô phỏng logic tính toán lợi nhuận thực tế khi Spread thay đổi (Dynamic Spread):

```typescript
type MarketCondition = 'NORMAL' | 'VOLATILE' | 'PANIC';

const calculateRealizedPnL = (
  entryPrice: number, // Giá lúc mua (Ask cũ)
  currentMarketPrice: number, // Giá tham chiếu hiện tại
  condition: MarketCondition
): number => {
  let spreadPercentage = 0.01; // 1%

  // Nhà cái nới rộng spread dựa trên tình hình thị trường
  switch (condition) {
    case 'NORMAL': spreadPercentage = 0.015; break; // 1.5% - chênh 1tr
    case 'VOLATILE': spreadPercentage = 0.05; break; // 5% - chênh 4-5tr
    case 'PANIC': spreadPercentage = 0.10; break; // 10% - chênh cả chục triệu
  }

  // Giá tiệm vàng chấp nhận mua lại của bạn (Bid)
  const bidPrice = currentMarketPrice * (1 - spreadPercentage);
  
  const pnl = bidPrice - entryPrice;
  
  console.log(`Condition: ${condition} | Spread: ${(spreadPercentage*100)}%`);
  console.log(`Bought: ${entryPrice} -> Sell at: ${bidPrice} -> PnL: ${pnl}`);
  
  return pnl;
}

// Case Study: Mua đỉnh 90tr, Giá thị trường vẫn 90tr, nhưng đang Panic
calculateRealizedPnL(90, 90, 'PANIC'); 
// Output: Lỗ sấp mặt 9 đơn vị (do Spread 10%) dù giá thị trường chưa giảm.
```

---

## ⚠️ Edge Cases / Pitfalls

### Tại sao Vàng Việt Nam dễ dính bẫy này nhất?

- ❌ **Risk (Policy Lag):** Vàng SJC độc quyền và phụ thuộc quota nhập khẩu của NHNN.
    - Kịch bản "Bom nổ": Giá thế giới sập -> Dân đổ xô bán -> Tiệm vàng cạn vốn tiền mặt -> Spread nới rộng vô cực (hoặc treo biển "Tạm ngưng thu mua").
    - Lúc này bạn cầm vàng (Safe Haven) nhưng không đổi ra tiền (Liquidity) để tiêu được.

- ✅ **Do:** Chỉ coi vàng là tài sản tích sản (Hold > 3 năm). Tuyệt đối không All-in tiền sinh hoạt ngắn hạn (< 1 năm) vào vàng vật chất vì rủi ro thanh khoản này.

---

## 🚨 Troubleshooting

### 🔧 Kẹt hàng (Bag Holding) khi Spread quá cao

#### 1. Spread đang > 5 triệu/lượng (hoặc > 5%)
- **Action:** **TUYỆT ĐỐI KHÔNG BÁN** (trừ khi cần tiền cứu mạng).
- **Reason:** Bán lúc này là bạn đang chịu toàn bộ rủi ro thay cho tiệm vàng. Đây là lúc Market Maker ép giá nhất.
- **Fix:** Chờ đợi thị trường ổn định lại (Stabilize). Khi cơn hoảng loạn qua đi, Spread sẽ co lại về mức 1-2tr, lúc đó bán sẽ đỡ lỗ hơn rất nhiều.

#### 2. Tiệm vàng từ chối mua lại
- **Action:** Đừng chạy đi nhiều tiệm làm gì cho mất công (họ liên thông giá với nhau).
- **Fix:** Mang về cất két. Đây là rủi ro thanh khoản của tài sản vật chất. Chấp nhận Hold dài hạn (Long-term investment).

---

## 📄 Advanced Mechanics

### Short Squeeze (Hiện tượng ngược lại)
Đôi khi Spread nới rộng ở chiều Bán (Ask tăng vọt, Bid đứng im) do khan hiếm nguồn cung cục bộ (Supply Shock).
- Lúc này người mua phải trả giá cực đắt (Premium) cao hơn giá trị thực rất nhiều để sở hữu tài sản.
- Ví dụ: Giá vàng SJC cao hơn thế giới 15-20 triệu VNĐ.

---

## 🔗 Connections

### Internal

- [[Safe_Haven_Asset]] - Vàng là tài sản an toàn, nhưng tính thanh khoản (Liquidity) không an toàn trong ngắn hạn.
- [[Dollar_Cost_Averaging]] - DCA giúp giảm thiểu rủi ro mua sai điểm, nhưng không cứu được rủi ro Spread khi bán.

### External

- [Bid-Ask Spread Explained - Investopedia](https://www.investopedia.com/terms/b/bid-askspread.asp)
- [Historical Gold Price SJC](https://sjc.com.vn/gia-vang-online)