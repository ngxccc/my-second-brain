---
noteId: 1790159214104
---

Khác biệt cốt lõi về phân vùng bộ nhớ giữa Process và Thread? Tại sao một Thread crash (Segfault/Panic) làm sập toàn bộ Process?

---

- **Process:** Sở hữu Virtual Memory Space và Page Table riêng biệt; cô lập 100%.
- **Thread:** Nằm trong Process, **dùng chung Text, Data, và Heap**; chỉ sở hữu riêng Stack và CPU Registers.
- **Nguyên nhân sập:** Do dùng chung không gian địa chỉ, khi 1 Thread truy cập vùng nhớ bất hợp pháp, OS gửi `SIGSEGV` hủy diệt toàn bộ Process.

---

Extra: Đó là lý do trình duyệt Chrome tách mỗi Tab thành một Process riêng biệt (để một trang web bị treo/sập không làm sập toàn bộ trình duyệt).
