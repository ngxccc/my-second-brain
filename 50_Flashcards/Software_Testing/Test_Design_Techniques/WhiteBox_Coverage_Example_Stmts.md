---
noteId: 1783427811255
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

Độ bao phủ câu lệnh (Statement Coverage) đạt được là bao nhiêu phần trăm nếu ta chỉ chạy duy nhất 1 test case với `value = 150`?

---

Đạt **100% Statement Coverage**.

Vì điều kiện `150 > 100` là True, toàn bộ 3 câu lệnh thực thi trong hàm đều được chạy qua:

1. `let status = "NORMAL";`
2. `status = "ALERT";`
3. `return status;`

---

Extra: Dù đạt 100% Statement Coverage nhưng chỉ đạt **50% Decision Coverage** vì nhánh False (`value <= 100`) hoàn toàn chưa được kiểm thử.
