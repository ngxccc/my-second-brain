---
noteId: 1790159214054
---

So sánh chi phí phần cứng CPU khi Context Switching giữa: (1) Hai Process, (2) Hai Kernel Thread, (3) Hai Goroutine?

---

1. **Process Switch (Nặng nhất, ~1,000–3,000 ns):** Đổi Page Table (ghi đè thanh ghi CR3), làm mất hiệu lực toàn bộ **TLB (Translation Lookaside Buffer)** và gây Cold CPU Cache.
2. **Kernel Thread Switch (Trung bình, ~500–1,000 ns):** Bẫy vào Kernel Space (Ring 0) để lưu/khôi phục Registers và TCB, nhưng **giữ nguyên Page Table và TLB**.
3. **Goroutine Switch (Siêu nhẹ, ~10–100 ns):** Diễn ra hoàn toàn ở **User Space** qua Go Runtime Scheduler; chỉ lưu/khôi phục đúng 3 thanh ghi (PC, SP, DX); kích thước Stack ban đầu chỉ 2KB.

---

Extra: Hiện tượng "TLB Flush" khi đổi Process là nguyên nhân số một khiến CPU mất hàng trăm chu kỳ xung nhịp để nạp lại các bản dịch địa chỉ ảo sang địa chỉ vật lý.
