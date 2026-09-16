---
noteId: 1783427811287
---

Định nghĩa độ bao phủ rẽ nhánh (Decision / Branch Coverage) và công thức tính toán của nó?

---

**Decision Coverage (Độ bao phủ nhánh quyết định)** đo lường tỷ lệ phần trăm các kết quả rẽ nhánh logic (cả hai nhánh True và False tại các điểm điều kiện như `if`, `switch`, vòng lặp) được thực thi bởi bộ test case.

**Công thức tính**:
$$\text{Decision Coverage} = \left( \frac{\text{Số kết quả nhánh đã thực thi}}{\text{Tổng số kết quả nhánh có thể xảy ra}} \right) \times 100\%$$

---

Extra: Decision Coverage chặt chẽ hơn Statement Coverage; đạt 100% Decision Coverage luôn bảo đảm đạt 100% Statement Coverage, nhưng chiều ngược lại thì không.
