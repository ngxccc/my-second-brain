---
tags: [type/mental-model, topic/innovation, topic/problem-solving]
status: seeding
created_at: Friday, January 30th 2026, 10:19:47 pm +07:00
updated_at: Friday, January 30th 2026, 10:19:58 pm +07:00
aliases: [Reasoning from First Principles, Decomposition, Nguyên Lý Đầu Tiên]
---

# First Principles Thinking

## 💡 TL;DR
Phá vỡ một vấn đề xuống thành các chân lý cơ bản nhất (Facts/Physics) không thể chia nhỏ hơn được nữa, rồi xây dựng giải pháp mới từ đó.
> **Core:** "Boil things down to the most fundamental truths and say, 'Okay, what are we sure is true?' and then reason up from there." - Elon Musk.

---

## 🎯 Context: When to apply?

- ✅ **Good for:**
    - **Innovation:** Khi muốn tạo ra cái mới hoàn toàn (0 to 1) thay vì cải tiến cái cũ (1 to n).
    - **Complex Problems:** Khi giải pháp hiện tại quá đắt đỏ hoặc kém hiệu quả.
    - **Refactoring Code:** Khi hệ thống quá nát (legacy), cần đập đi xây lại kiến trúc chứ không chỉ patch lỗi.

- ❌ **Bad for:**
    - **Routine Tasks:** Đừng dùng First Principles để quyết định trưa nay ăn gì (Tốn năng lượng não - Cognitive Load cao).
    - **Standard Standards:** Đừng cố sáng tạo lại cái bánh xe (Reinvent the wheel) cho những thứ đã là chuẩn mực (VD: Giao thức TCP/IP).

---

## 💬 Actionable Script / How-to

**The 3-Step Algorithm:**

1.  **Deconstruct (Phá vỡ):** Liệt kê các trở ngại hiện tại.
2.  **Challenge (Thách thức):** Hỏi "Tại sao?" liên tục cho đến khi chạm đáy sự thật (Facts).
3.  **Reconstruct (Xây lại):** Tạo giải pháp mới từ các mảnh ghép sự thật đó.

**Script mẫu khi gặp vấn đề "Server cost quá cao":**

- *Analogy (Cách thường):* "Các công ty khác cũng tốn chừng này tiền, chắc là giá thị trường rồi." -> Chấp nhận.
- *First Principles:*
    - "Server làm bằng gì?" -> Nhôm, đồng, silicon, điện.
    - "Giá nguyên liệu thô trên sàn giao dịch là bao nhiêu?" -> Rẻ hơn 10 lần giá thuê AWS.
    - "Tại sao AWS đắt?" -> Phí dịch vụ, brand.
    - **Solution:** Có thể tự build bare-metal server hoặc tối ưu code để giảm compute power không?

---

## 🧠 The Mechanics (Deep Dive)

### Reasoning by Analogy vs. First Principles
- **Analogy (Tương tự):** Làm như người khác làm. (Copy/Paste, Best Practices). An toàn, ít tốn não, nhưng kết quả trung bình. -> **Người đầu bếp (Cook) chỉ biết làm theo công thức.**
- **First Principles (Nguyên bản):** Hiểu bản chất vật lý/logic. (Innovation). Rủi ro cao, tốn não, nhưng đột phá. -> **Bếp trưởng (Chef) tạo ra công thức mới.**

---

## 🛑 Anti-Patterns

- **Misconception:** Nghĩ rằng "First Principles" nghĩa là phải tự làm tất cả mọi thứ từ con số 0 (như tự viết lại Framework React).
- **Correction:** Chỉ áp dụng cho **Core Value** của sản phẩm. Những thứ phụ trợ (Commodity) thì nên dùng hàng có sẵn.

---

## 🔗 Connections
### Internal
- [[Socratic_Questioning_Method]] (Công cụ đặt câu hỏi để đào xuống First Principles)
- [[Occam_Razor]] (Giải pháp đơn giản nhất thường là giải pháp đúng nhất)

### External
- [James Clear - First Principles](https://jamesclear.com/first-principles)
- [Tim Urban - The Cook and the Chef](https://waitbutwhy.com/2015/11/the-cook-and-the-chef-two-types-of-people-in-the-world.html)