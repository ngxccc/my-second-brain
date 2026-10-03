---
noteId: 1790159214080
---

Cơ chế Copy-on-Write (COW) giúp tối ưu hóa thao tác `fork()` của hệ điều hành như thế nào?

---

- **Chia sẻ RAM vật lý cho đến khi ghi**: Parent và Child dùng chung các Physical Pages; chỉ khi một bên ghi dữ liệu thì MMU mới cấp phát và copy sang trang RAM mới.

---

Extra: Nhờ COW, `fork()` diễn ra tức thì $O(1)$ mà không tốn công copy hàng GB bộ nhớ. Child có Virtual Memory riêng nên crash không ảnh hưởng Parent (kiến trúc của Nginx Worker, Chrome Tab, Postgres Backend).
