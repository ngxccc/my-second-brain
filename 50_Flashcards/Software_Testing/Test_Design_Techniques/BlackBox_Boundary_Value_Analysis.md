---
noteId: 1783427319706
---

Phân tích Giá trị Biên (Boundary Value Analysis - BVA) là gì và tại sao chúng ta phải tập trung kiểm thử tại các điểm biên của phân vùng?

---

**Boundary Value Analysis (BVA)** là kỹ thuật thiết kế kiểm thử tập trung khảo sát hành vi của hệ thống tại **các điểm biên tiếp giáp (Edges)** của các phân vùng tương đương.

Chúng ta tập trung test ở biên vì theo tâm lý học nhận thức và kinh nghiệm thực nghiệm, **lập trình viên dễ phạm sai lầm nhất tại các điểm biên** do nhầm lẫn toán tử so sánh (ví dụ: gõ nhầm `>` thành `>=`, hoặc lỗi vòng lặp `off-by-one`).

---

Extra: BVA chỉ áp dụng được cho các phân vùng có thứ tự (Ordered Partitions) như số nguyên, ngày tháng, độ dài chuỗi; không áp dụng được cho các giá trị rời rạc vô thứ tự (ví dụ: quốc gia, màu sắc).
