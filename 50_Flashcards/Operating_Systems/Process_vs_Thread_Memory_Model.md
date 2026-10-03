---
noteId: 1790159214104
---

Tại sao một Thread bị lỗi truy cập bộ nhớ (Segfault) lại làm sập toàn bộ Process chứa nó?

---

- **Dùng chung Virtual Memory**: Các Thread trong cùng Process chia sẻ chung không gian địa chỉ (Text, Data, Heap); OS gửi `SIGSEGV` hủy diệt toàn bộ Process khi có lỗi.

---

Extra: Process sở hữu Page Table riêng biệt và cô lập hoàn toàn. Thread chỉ có Stack và Registers riêng. Trình duyệt Chrome tách mỗi Tab thành một Process riêng để tránh sập toàn bộ ứng dụng.
