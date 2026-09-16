---
noteId: 1783427811330
---

Định nghĩa độ bao phủ câu lệnh (Statement Coverage) và công thức tính toán của nó?

---

**Statement Coverage (Độ bao phủ câu lệnh)** đo lường tỷ lệ phần trăm các câu lệnh thực thi (executable statements) trong mã nguồn được chạy qua bởi bộ test case.

**Công thức tính**:
$$\text{Statement Coverage} = \left( \frac{\text{Số câu lệnh đã thực thi}}{\text{Tổng số câu lệnh thực thi trong code}} \right) \times 100\%$$

---

Extra: Đạt 100% Statement Coverage không bảo đảm code sạch lỗi, vì nó có thể bỏ qua các nhánh `else` ngầm định hoặc các điều kiện biên của phép so sánh logic.
