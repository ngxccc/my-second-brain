---
noteId: 1790159214080
---

Khi Operating System sinh ra một Process con (`fork`/`exec`), cơ chế nhân bản bộ nhớ và Copy-on-Write (COW) diễn ra như thế nào? Tại sao lỗi ở Process con không làm sập Process cha?

---

- **Cơ chế nhân bản bộ nhớ:**
  1. OS sao chép **Page Table** của Parent sang Child, tạo ra **Virtual Memory Space** riêng biệt.
  2. **Copy-on-Write (COW):** Ban đầu Parent và Child dùng chung các Physical Page Frames trong RAM. Khi một bên thực hiện lệnh ghi (Write), phần cứng MMU mới cấp phát và copy sang một Physical Page mới cho Process đó.
- **Process Isolation (Sự cô lập tuyệt đối):**
  - Vùng RAM chứa biến của Parent không bị can thiệp khi Child chỉnh sửa biến.
  - Khi Child kết thúc, tài nguyên của Child bị giải phóng độc lập.
- **Ý nghĩa kiến trúc:** Fault Isolation tuyệt đối. Crash, Memory Corruption, hoặc Infinite Loop ở Child Process không bao giờ làm sập Parent Process (kiến trúc của Nginx Worker, Chrome Tab, Postgres Backend).

---

Extra: Cơ chế Copy-on-Write giúp thao tác `fork()` diễn ra gần như tức thì ($O(1)$) vì không cần sao chép toàn bộ hàng Gigabyte RAM vật lý ngay lúc khởi tạo.
