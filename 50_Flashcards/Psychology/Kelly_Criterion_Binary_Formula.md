---
noteId: 1784116410947
---

Viết 2 dạng tương đương của công thức Kelly nhị phân (Binary Outcomes) và lấy ví dụ số liệu cụ thể.

---

**2 dạng tương đương của công thức Kelly nhị phân:**

$$f^* = \frac{bp - q}{b} \quad \text{và} \quad f^* = \frac{p(b+1) - 1}{b}$$

Trong đó:

- **$f^*$**: Tỷ lệ phần trăm vốn tối ưu nên phân bổ cho mỗi giao dịch.
- **$p$**: Xác suất thắng giao dịch.
- **$q$**: Xác suất thua giao dịch ($q = 1 - p$).
- **$b$**: Tỷ lệ cược ròng (odds ròng) nhận được khi thắng.

**Ví dụ số liệu từ nguồn:**
Cược tung đồng xu lệch có xác suất thắng $p = 60\%$ ($0.6$), thua $q = 40\%$ ($0.4$), cược $1$ ăn $1$ ròng ($b = 1$):
$$f^* = \frac{1 \times 0.6 - 0.4}{1} = 0.2 \quad (20\% \text{ vốn})$$
