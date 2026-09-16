---
noteId: 1783427319786
---

Độ bao phủ Phân vùng tương đương (EP Coverage) được tính toán như thế nào và khi nào thì đạt 100%?

---

Đạt **100% EP Coverage** khi và chỉ khi bộ kịch bản test đã kiểm tra **ít nhất một giá trị đại diện** từ tất cả mọi phân vùng hợp lệ và bất hợp lệ đã được xác định.

**Công thức tính**:
$$\text{EP Coverage} = \left( \frac{\text{Số phân vùng đã được kiểm thử}}{\text{Tổng số phân vùng được xác định}} \right) \times 100\%$$

---

Extra: Khi viết test case, có thể gộp nhiều phân vùng hợp lệ vào chung 1 test case; nhưng với phân vùng bất hợp lệ, bắt buộc phải test từng phân vùng riêng lẻ để tránh hiện tượng lỗi này che khuất lỗi kia (Masking Defects).
