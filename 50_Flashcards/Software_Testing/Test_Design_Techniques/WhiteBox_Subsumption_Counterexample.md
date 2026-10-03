---
noteId: 1790994334759
---

Đoạn mã `if (x > 0) print(x);` chứng minh quan hệ Subsumption giữa Decision Coverage và Statement Coverage như thế nào?

---

- **Ví dụ phản chứng**: Test case `x = 1` đạt 100% Statement Coverage (in ra `x`), nhưng chỉ đạt 50% Decision Coverage vì chưa từng kiểm tra nhánh False (`x <= 0`).

---

Extra: Để đạt 100% Decision Coverage, bắt buộc phải thêm test case thứ hai với `x <= 0` (nhánh ngầm đi thẳng không in).
