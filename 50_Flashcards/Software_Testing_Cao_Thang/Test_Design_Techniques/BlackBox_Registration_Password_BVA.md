---
noteId: 1791469636067
---

Với quy tắc Password có tối thiểu 6 ký tự, kỹ thuật phân tích giá trị biên xác định những ca kiểm thử nào?

---

- **Biên hợp lệ**: Độ dài = 6 ký tự (Giá trị biên dưới hợp lệ nhỏ nhất, ví dụ: `Pass@#`).
- **Biên không hợp lệ**: Độ dài = 5 ký tự (Giá trị sát ngoài biên dưới vi phạm quy tắc, ví dụ: `Pas@#`).

---

Extra: Lập trình viên thường mắc lỗi toán tử điều kiện (viết `> 6` thay vì `>= 6`), do đó kiểm thử tại chính xác 5 và 6 ký tự là vùng có xác suất bắt được bug cao nhất.
