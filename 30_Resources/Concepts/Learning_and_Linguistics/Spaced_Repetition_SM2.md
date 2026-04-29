---
tags: [type/algorithm, topic/learning, lang/typescript]
date: 2026-04-29
aliases: [SuperMemo 2, SRS, Forgetting Curve]
---
# Spaced Repetition (SM-2 Algorithm)

## TL;DR

Thuật toán tính toán "điểm rơi phong độ" của trí nhớ. Cập nhật khoảng cách ngày ôn tập tiếp theo (Interval) dựa trên hệ số độ dễ (Easiness Factor - EF) và điểm tự đánh giá của người dùng. Giúp ghi nhớ dài hạn với số lần lặp lại ít nhất ($O(1)$ effort cho mỗi từ).

## Core Concept (Lý thuyết)

- **Đường cong quên lãng (Forgetting Curve):** Kiến thức mới học sẽ rớt đài cực nhanh trong 24h đầu. SM-2 can thiệp ngay trước khi đường cong này chạm đáy, giúp kéo phẳng nó ra.
- **Cơ chế Phạt (Penalty) & Thưởng (Reward):** - Trả lời đúng (Grade 3-5) $\rightarrow$ Tăng hệ số `EF`, dãn cách thời gian ôn tập dài ra (ví dụ: 1 ngày $\rightarrow$ 6 ngày $\rightarrow$ 15 ngày).
  - Trả lời sai (Grade 0-2) $\rightarrow$ Giảm hệ số `EF` và "Hard Reset" (Đưa Interval về lại 1 ngày). Nhưng `EF` bị trừ sẽ khiến các vòng lặp sau tăng tiến chậm hơn.

## Practical Implementation (Thực chiến)

- **Trade-offs (The Hell Loop):** Nếu một từ vựng quá khó, user bấm "Sai" liên tục, `EF` sẽ bị trừ thủng đáy. Nếu `EF` < 1.0, khoảng cách ôn tập sẽ bị âm hoặc dậm chân tại chỗ $\rightarrow$ User mắc kẹt trong "Vòng lặp địa ngục". Bắt buộc phải **Clamp (chốt chặn) EF tối thiểu ở mức 1.3**.
- **The Fuzzing Hack (Chống dồn cục):** Nếu hôm nay user học 100 từ mới, thuật toán nguyên thủy sẽ hẹn chính xác 6 ngày sau ném 100 từ đó vào mặt user. Lượng load quá lớn sẽ làm user nản. Thực tế, ta phải thêm một thuật toán `Fuzzing` (Random $\pm 5\%$) để tản 100 từ đó rải rác ra các ngày 5.8 đến 6.2.
- **Code Snippet (Time/Space Complexity: $O(1)$):**

```typescript
interface Sm2State {
  repetitions: number;
  easiness: number;
  interval: number;
}

export const calculateSM2 = (state: Sm2State, grade: number): Sm2State => {
  let { repetitions, easiness, interval } = state;

  if (grade >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easiness);

    repetitions++;
  } else {
    // HACK: Hard reset interval but keep the penalized EF for future
    repetitions = 0;
    interval = 1;
  }

  easiness += 0.1 - (5 - grade) *(0.08 + (5 - grade)* 0.02);

  // BUG (Prevented): Hell loop clamping
  easiness = Math.max(1.3, easiness);

  return { repetitions, easiness, interval };
};
```

---
**Related Notes:**

- Áp dụng thuật toán này vào nhóm từ: [[Phonetic_Chunking]]
- Áp dụng tâm lý học để tăng độ ghi nhớ: [[Cognitive_Strain_UX]]
