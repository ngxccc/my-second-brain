---
tags: [type/concept, topic/psychology, topic/decision_making, topic/risk_management]
status: seeding
created_at: Friday, January 30th 2026, 9:00:19 am +07:00
updated_at: Friday, January 30th 2026, 9:06:23 am +07:00
aliases: [Chi phí cơ hội, Sunk Cost, Deadlock, Rút hay Hold, Rebalance]
---

# Opportunity Cost & Holding Psychology

## 💡 TL;DR

Cuộc chiến tâm lý giữa việc giữ tài sản đang thua lỗ/đi ngang (do tiếc chi phí quá khứ - Sunk Cost) và việc chuyển đổi sang cơ hội khác tốt hơn (Chi phí cơ hội). Trạng thái "Deadlock" xảy ra khi không có thuật toán rõ ràng để ra quyết định.

---

## 🧠 Why use it?

*Giải quyết câu hỏi triệu đô: "Gồng lỗ tiếp hay cắt lỗ làm lại cuộc đời?"*

- **Problem:**
    - **Loss Aversion (Sợ mất mát):** Nỗi đau khi cắt lỗ (realize loss) lớn gấp đôi niềm vui khi chốt lời.
    - **Sunk Cost Fallacy (Ngụy biện chi phí chìm):** "Đã lỡ giữ 2 năm rồi, bán giờ thì uổng công chờ đợi". -> Tư duy sai lầm.
    - Dẫn đến việc ôm "Zombie Assets" (Tài sản xác sống) vĩnh viễn trong khi thị trường khác bay cao.

- **Solution:** Sử dụng bộ câu hỏi Boolean Audit (Yes/No) để ra quyết định nhị phân, loại bỏ cảm xúc tiếc nuối.

- **vs Alternative:** *Cảm tính (Gut feeling).* Cảm tính thường bảo bạn "Hold to die" lúc giá giảm và "Bán non" lúc giá vừa hồi.

## 🔍 Deep Dive

1.  **Principle 1: Past is Irrelevant (Quá khứ không quan trọng):**
    Thị trường không quan tâm bạn mua giá bao nhiêu hay giữ bao lâu. Nó chỉ quan tâm giá trị tương lai.
    - Tiền lỗ là **Sunk Cost** (Đã mất rồi).
    - Việc giữ lại tài sản rác không giúp lấy lại tiền, mà chỉ làm mất thêm **Opportunity Cost** (Chi phí cơ hội - lẽ ra tiền đó gửi tiết kiệm đã có lãi).

2.  **Principle 2: The Audit Algorithm (Thuật toán kiểm định):**
    Bạn không "Bet" (Đánh cược), bạn đang quản lý một danh mục đầu tư. Hãy Audit nó như review code định kỳ.

---

## 💻 Code Snippet / Implementation

Thuật toán ra quyết định "Rút hay Hold" (viết dưới dạng TypeScript logic):

```typescript
// Các trạng thái quyết định
type Action = 'SELL_IMMEDIATELY' | 'SELL_MUST' | 'SELL_HALF' | 'HOLD_STRONG';

interface Asset {
  ticker: string;
  currentLoss: number; // % lỗ hiện tại
}

function auditPortfolio(asset: Asset, myThesisIsValid: boolean, emergencyFundStatus: 'FULL' | 'EMPTY', anxietyLevel: 'HIGH' | 'LOW'): Action {
  
  // 1. Check Fundamental: Lý do mua ban đầu còn đúng không?
  // VD: Mua vì tin công nghệ, giờ công nghệ đó lỗi thời -> Thesis sai.
  if (!myThesisIsValid) {
    console.log("❌ Luận điểm đầu tư đã gãy. Không còn lý do để giữ.");
    return 'SELL_IMMEDIATELY'; 
  }

  // 2. Check Survival: Có đang cần tiền gấp để sống không?
  // Nếu không có quỹ khẩn cấp -> Buộc phải bán đáy để ăn.
  if (emergencyFundStatus === 'EMPTY') {
    console.log("⚠️ Cảnh báo: Cần thanh khoản gấp.");
    return 'SELL_MUST';
  }

  // 3. Check Psychology: Tối về ngủ có ngon không?
  // Nếu ngày nào cũng mở chart xem -> Vị thế quá lớn (Over-leveraged).
  if (anxietyLevel === 'HIGH') {
    console.log("🧠 Tâm lý không ổn định -> Hạ tỷ trọng.");
    return 'SELL_HALF'; // Chiến thuật Rebalance thần thánh
  }

  // Nếu qua được cả 3 cửa ải -> Kim cương quan điểm
  return 'HOLD_STRONG';
}
```

---

## ⚠️ Edge Cases / Pitfalls

### Emergency Fund Dependency (Sự phụ thuộc vào quỹ khẩn cấp)

- ❌ **Don't:** Đầu tư (đặc biệt là các kênh rủi ro như Vàng/Crypto) khi chưa có **Quỹ khẩn cấp** (ít nhất 6 tháng sinh hoạt phí).
    - *Hậu quả:* Khi thị trường đi vào "Mùa đông" (2-3 năm), bạn sẽ bị ép phải bán tài sản đúng đáy để trả tiền nhà/tiền ăn. Đây là trạng thái "Force Sell" (Bị bắt buộc bán).
- ✅ **Do:** Tách bạch rõ ràng:
    - `Wallet A`: Living Expenses (Cash).
    - `Wallet B`: Emergency Fund (Savings).
    - `Wallet C`: Investment (Gold/Stock).
    - Chỉ `Wallet C` mới được phép Hold dài hạn.

---

## 🚨 Troubleshooting

### 🔧 "Bán xong nó tăng thì sao?" (FOMO ngược)

- **Vấn đề:** Sợ cảm giác hối hận (Regret) nếu vừa cắt lỗ xong giá bay.
- **Fix (Chiến thuật Sell Half):** Chỉ bán 50%.
    - Nếu giá Tăng: "May quá mình vẫn còn giữ một nửa!" (Positive).
    - Nếu giá Giảm: "May quá mình đã chốt được một nửa ở đỉnh rồi!" (Positive).
    -> Hack não để luôn cảm thấy chiến thắng (Win-Win Mindset).

---

## 📄 Advanced Mechanics

### Refactoring Portfolio
Giống như Refactor Code. Định kỳ (mỗi quý/năm), hãy mạnh dạn xóa bỏ những "dòng code rác" (tài sản kém hiệu quả) để dồn tài nguyên cho những thuật toán tối ưu hơn. Đừng luyến tiếc Legacy Code.

---

## 🔗 Connections

### Internal

- [[Dollar_Cost_Averaging]] - Nếu quyết định Hold tiếp, hãy dùng DCA để giảm giá vốn.
- [[Finances/My_Investment_Strategy]] - Nơi lưu trữ các quy tắc cá nhân (Personal Rules).

### External

- [The Sunk Cost Fallacy - Behavioral Economics](https://thedecisionlab.com/biases/the-sunk-cost-fallacy)
- [Prospect Theory (Lý thuyết triển vọng)](https://www.investopedia.com/terms/p/prospecttheory.asp)