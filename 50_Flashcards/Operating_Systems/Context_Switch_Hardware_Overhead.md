---
noteId: 1790159214054
---

Về mặt phần cứng CPU, tại sao Context Switch giữa hai Process lại tốn kém hơn nhiều so với giữa hai Kernel Thread?

---

- **Đổi Page Table & Flush TLB**: Đổi Process phải ghi đè thanh ghi `CR3`, làm mất hiệu lực toàn bộ TLB cache và gây Cold CPU Cache; đổi Thread giữ nguyên Page Table và TLB.

---

Extra: Goroutine Switch siêu nhẹ (~10-100ns) vì diễn ra hoàn toàn ở User Space và chỉ lưu 3 thanh ghi (PC, SP, DX). Kernel Thread tốn ~500-1000ns; Process tốn ~1000-3000ns.
