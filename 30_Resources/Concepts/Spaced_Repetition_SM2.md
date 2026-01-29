---
tags: [type/algorithm, topic/learning, lang/typescript, topic/backend]
status: seeding
created_at: Thursday, January 29th 2026, 9:06:57 pm +07:00
updated_at: Thursday, January 29th 2026, 9:36:31 pm +07:00
aliases: [SuperMemo 2, SRS Algorithm, Forgetting Curve]
---

# Spaced Repetition (SM-2 Algorithm)

## 💡 TL;DR
Thuật toán kinh điển giúp tính toán "thời điểm vàng" để ôn tập lại kiến thức ngay trước khi bạn sắp quên (Forgetting Curve), tối ưu hóa trí nhớ với số lần ôn tập ít nhất.

---

## 🧠 Why use it? (Tại sao dùng?)
*(Lý do tồn tại của concept này. Nó giải quyết vấn đề gì mà cách cũ không làm được?)*
- **Problem:** Học nhồi nhét (Cramming) hoặc ôn tập ngẫu nhiên rất kém hiệu quả. Bạn ôn quá sớm (lãng phí thời gian) hoặc quá muộn (đã quên mất rồi).
- **Solution:** SM-2 tính ra chính xác ngày `next_review` dựa trên lịch sử độ khó của từ vựng đối với từng user cụ thể.
- **vs Alternative:**
    - vs **Leitner System (Hộp thẻ):** SM-2 dùng toán học chính xác hơn, Leitner chỉ là các nấc thủ công (cơ học).
    - vs **FSRS (Free Spaced Repetition Scheduler):** FSRS xịn hơn (AI-based) nhưng quá phức tạp để implement cho đồ án sinh viên. SM-2 là cân bằng nhất.

## 🔍 Deep Dive (Cơ chế hoạt động)
*(Công thức cốt lõi của SuperMemo 2)*

1.  **Grade (q):** Điểm user tự đánh giá khi học (0-5).
    * `5`: Hoàn hảo.
    * `3`: Nhớ nhưng vất vả.
    * `0`: Quên sạch.
2.  **EF (Easiness Factor):** Hệ số "dễ nhớ" của từ vựng. Mặc định là `2.5`.
    * Nếu trả lời đúng -> EF tăng (Khoảng cách ôn dãn ra).
    * Nếu trả lời sai -> EF giảm (Khoảng cách ôn thu hẹp lại).
3.  **Interval (I):** Số ngày chờ cho lần ôn tiếp theo.
    * `I(1) = 1` (1 ngày).
    * `I(2) = 6` (6 ngày).
    * `I(n) = I(n-1) * EF` (Các lần sau nhân với hệ số EF).

---

## 💻 Code Snippet / Implementation
*(Logic tính toán ngày ôn tập tiếp theo - TypeScript)*

```typescript
interface ReviewItem {
  repetitions: number; // Số lần đã ôn (n)
  easiness: number;    // Hệ số EF
  interval: number;    // Khoảng cách ngày (I)
}

/**
 * Tính toán trạng thái mới dựa trên đánh giá của user
 * @param item Trạng thái hiện tại
 * @param quality Điểm đánh giá (0-5)
 */
export function calculateSM2(item: ReviewItem, quality: number): ReviewItem {
  let { repetitions, easiness, interval } = item;

  // 1. Xử lý Repetitions & Interval
  if (quality >= 3) {
    // Nếu nhớ (Grade >= 3)
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }
    repetitions += 1;
  } else {
    // Nếu quên (Grade < 3) -> Reset về đầu
    repetitions = 0;
    interval = 1;
  }

  // 2. Cập nhật Easiness Factor (EF) - Công thức gốc SM-2
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // ⚠️ Quan trọng: EF không được nhỏ hơn 1.3
  if (easiness < 1.3) {
    easiness = 1.3;
  }

  return { repetitions, easiness, interval };
}
```

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

_(Đừng bỏ qua phần này. Kinh nghiệm xương máu nằm ở đây)_

### Vấn đề về EF (Easiness Factor)

- ❌ **Don't:** Để `EF` giảm xuống dưới 1.3.
    - *Lý do:* Nếu EF < 1.3, khoảng cách ôn tập sẽ bị thu hẹp quá nhanh, dẫn đến việc user phải học lại từ đó liên tục (hell loop) dù đã thuộc.
- ✅ **Do:** Luôn Clamp giá trị `EF` tối thiểu là `1.3` (như trong code mẫu).

### Vấn đề về "Hard Reset"

- ❌ **Don't:** Khi user chọn "Quên" (Grade < 3), giữ nguyên `EF` cũ.
    - *Lý do:* Đã quên nghĩa là từ này khó hơn dự tính, cần giảm EF xuống để ôn kỹ hơn. (Công thức trên đã tự động giảm EF, nhưng cần lưu ý logic reset interval về 1).
- ✅ **Do:** Reset `interval = 1` nhưng giữ lại `EF` đã bị giảm (penalty) để lần sau nó dãn cách chậm hơn.

---

## 🚨 Troubleshooting

*(Các lỗi thường gặp khi implement)*

### 🔧 Interval ra số lẻ

_(Ngày ôn tập là 4.56 ngày?)_
* **Lỗi:** Kết quả nhân `interval * easiness` ra số thập phân.
* **Fix:** Dùng `Math.round()` hoặc `Math.ceil()`. Database thường lưu ngày `next_review` là Timestamp, nên cộng thêm `interval * 24 * 60 * 60 * 1000`.

### 🔧 User cheat (Học trước)

_(User muốn học trước khi đến hạn)_
* **Vấn đề:** Thuật toán SM-2 chỉ đúng khi user học đúng ngày (hoặc trễ hơn). Nếu học sớm (Cramming), thuật toán sẽ bị sai lệch.
* **Fix:** Chỉ cho phép nút "Review" hiện lên khi `CurrentDate >= NextReviewDate`. Nếu user muốn học sớm, hãy gọi đó là chế độ "Cram Mode" và **không cập nhật** vào DB chính thức.

---

## 📄 Advanced Mechanics

*(Những kiến thức sâu rộng hơn về phần này)*

### Biến thể Fuzzing (Chống dồn cục)
Nếu hôm nay có 100 từ cùng đến hạn (do hôm qua học 100 từ mới), user sẽ bị ngợp.
* **Giải pháp:** Thêm một chút random (Fuzz) vào Interval. Thay vì đúng 6 ngày, hãy random từ 5.8 đến 6.2 ngày để rải đều các từ ra các ngày khác nhau.

### Matrix of Forgetting
Các app xịn (Anki) dùng ma trận phức tạp hơn để tính retention rate. Nhưng với App học tiếng Anh cơ bản, SM-2 là đủ (Good enough).

---

## 🔗 Connections (Mạng lưới)

### Internal (Trong não)
- [[Cognitive_Strain_UX]] (Áp dụng SM-2 kết hợp với UX gõ phím)
- [[Project_Roadmap]] (Task của Sprint 4)

### External (Nguồn tham khảo)
- [SuperMemo 2 Algorithm Official](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki Algorithm Docs](https://docs.ankiweb.net/background.html)
