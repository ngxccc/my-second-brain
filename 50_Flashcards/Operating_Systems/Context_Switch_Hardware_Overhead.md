---
noteId: 1790159214054
---

Tại sao Context Switching giữa 2 Process lại đắt hơn rất nhiều so với Context Switching giữa 2 Thread trong cùng Process và Goroutine trong Go?

---

- **Process Switch (Nặng nhất, ~1,000–3,000 ns):** Phải đổi Page Table (ghi đè thanh ghi phần cứng CR3), làm mất hiệu lực toàn bộ bộ đệm dịch địa chỉ **TLB (Translation Lookaside Buffer)** và gây Cold CPU Cache (Cache Miss hàng loạt).
- **Kernel Thread Switch (Trung bình, ~500–1,000 ns):** Lưu/khôi phục CPU Registers và TCB. Phải bẫy vào Kernel Space (Ring 0) nhưng **giữ nguyên Page Table và TLB**.
- **Goroutine Switch (Siêu nhẹ, ~10–100 ns):**
  - Diễn ra hoàn toàn ở **User Space** qua Go Runtime Scheduler (không bẫy vào Kernel).
  - Chỉ lưu/khôi phục đúng 3 thanh ghi (Program Counter, Stack Pointer, DX).
  - Stack ban đầu siêu nhỏ (chỉ 2KB, tự động co giãn).

---

Extra: Hiện tượng "TLB Flush" khi đổi Process là nguyên nhân số một khiến CPU mất hàng trăm chu kỳ xung nhịp để nạp lại các bản dịch địa chỉ ảo sang địa chỉ vật lý.
