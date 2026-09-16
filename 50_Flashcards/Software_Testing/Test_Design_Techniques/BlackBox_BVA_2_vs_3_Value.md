---
noteId: 1783427319736
---

So sánh sự khác biệt giữa kỹ thuật BVA 2 giá trị (2-value BVA) và BVA 3 giá trị (3-value BVA)?

---

- **2-value BVA**: Với mỗi biên, chỉ kiểm tra **2 giá trị**: chính điểm biên và giá trị láng giềng gần nhất nằm ở phân vùng kế bên (ví dụ: biên 18 tuổi $\rightarrow$ test `18` và `17`).
- **3-value BVA**: Với mỗi biên, kiểm tra cả **3 giá trị**: chính điểm biên, giá trị ngay bên dưới và giá trị ngay bên trên (ví dụ: biên 18 tuổi $\rightarrow$ test `17`, `18`, và `19`).

---

Extra: BVA 2 giá trị là tiêu chuẩn phổ biến nhất vì tiết kiệm số lượng test case; BVA 3 giá trị chỉ áp dụng cho các hệ thống có mức độ rủi ro cực cao (y tế, hàng không) đòi hỏi bắt lỗi toán tử so sánh với độ tin cậy tuyệt đối.
