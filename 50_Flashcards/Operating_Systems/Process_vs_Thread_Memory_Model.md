---
noteId: 1790159214104
---

Process (Tiến trình) và Thread (Luồng) khác nhau như thế nào về mô hình phân bổ bộ nhớ? Tại sao một lỗi Crash (Segfault/Panic) ở 1 Thread có thể làm sập toàn bộ Ứng dụng trong khi ở Process thì không?

---

- **Mô hình bộ nhớ:**
  - **Process**: Sở hữu **không gian bộ nhớ ảo (Virtual Memory Space) riêng biệt** và Page Table riêng. Các Process hoàn toàn cô lập nhau, không thể đọc/ghi đè bộ nhớ của nhau.
  - **Thread**: Nằm bên trong Process, **dùng chung Text (code), Data (biến toàn cục), và Heap**. Thread chỉ sở hữu riêng Stack và các thanh ghi CPU (Registers/PC).
- **Lý do sập ứng dụng:**
  - Vì các Thread dùng chung không gian địa chỉ, khi một Thread gây ra lỗi nghiêm trọng (truy cập con trỏ Null, ghi đè vùng nhớ cấm, uncaught Panic), Hệ điều hành sẽ gửi tín hiệu (`SIGSEGV`) tiêu diệt toàn bộ Process chứa không gian bộ nhớ đó.
  - Với Process độc lập (như Nginx/Postgres worker), một Process chết chỉ giải phóng tài nguyên của riêng nó, Process cha (`master`) có thể lập tức spawn lại process con mới.

---

Extra: Đó là lý do trình duyệt Chrome tách mỗi Tab thành một Process riêng biệt (để một trang web bị treo/sập không làm sập toàn bộ trình duyệt).
