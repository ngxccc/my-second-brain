---
noteId: 1783427811206
---

Cho đoạn mã nguồn sau:

```javascript
function checkLimit(value) {
  let status = "NORMAL";
  if (value > 100) {
    status = "ALERT";
  }
  return status;
}
```

Tại sao một test case duy nhất với `value = 150` đạt được 100% Statement Coverage nhưng chỉ đạt được 50% Decision Coverage?

---

Vì test case `value = 150` chỉ kích hoạt nhánh **True** của điểm rẽ nhánh `value > 100`.

Tổng cộng có 2 kết quả rẽ nhánh có thể xảy ra (True và False), nhưng nhánh **False** (khi `value <= 100`) chưa hề được chạy qua. Do đó:
$$\text{Decision Coverage} = \frac{1}{2} \times 100\% = 50\%$$

---

Extra: Để đạt 100% Decision Coverage, bắt buộc phải bổ sung thêm ít nhất 1 test case nữa kích hoạt nhánh False (ví dụ: `value = 80`).
