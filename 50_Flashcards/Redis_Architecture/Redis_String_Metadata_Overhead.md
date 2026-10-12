---
noteId: 1791101391656
---

Tại sao lưu trữ hàng triệu cờ trạng thái nhỏ bằng các String Keys riêng lẻ trong Redis lại tiêu tốn nhiều RAM?

---

- **Metadata Overhead**: Mỗi Key đơn lẻ kéo theo chi phí cố định ~48–64 bytes gồm `dictEntry` (24B), `robj` (16B), SDS header và padding làm tròn của bộ cấp phát `jemalloc`.

---

Extra: Dù giá trị của bạn chỉ là 1 byte (`"1"`), lượng metadata và padding có thể lớn gấp 50-80 lần dung lượng dữ liệu thực tế.
