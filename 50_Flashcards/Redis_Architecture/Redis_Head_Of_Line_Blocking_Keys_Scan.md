---
noteId: 1790950898670
---

Tại sao các lệnh có độ phức tạp $O(N)$ như `KEYS *` bị cấm tuyệt đối trên môi trường Production của Redis?

---

- **Head-of-Line Blocking**: Do luồng thực thi là đơn luồng, lệnh $O(N)$ chiếm dụng CPU làm đóng băng toàn bộ hàng đợi, khiến mọi request khác (kể cả lệnh $O(1)$) bị timeout.

---

Extra: Để quét key an toàn trên Production, luôn thay bằng `SCAN cursor MATCH pattern* COUNT 100` để chia nhỏ tiến trình và nhả CPU cho các sự kiện khác xen kẽ. Tương tự, xóa Large Key phải dùng `UNLINK` thay vì `DEL`.
