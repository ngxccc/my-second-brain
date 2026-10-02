---
noteId: 1790950898670
---

Tại sao việc chạy các lệnh có độ phức tạp $O(N)$ như `KEYS *` lại bị coi là điều cấm kỵ tuyệt đối trên môi trường Production của Redis?

---

- **Head-of-Line Blocking:** Do Command Execution Engine là Single-threaded, lệnh `KEYS *` quét hàng triệu Keys sẽ chiếm dụng CPU luồng chính liên tục trong hàng trăm millisecond đến vài giây.
- **Tê liệt hàng đợi:** Trong suốt thời gian lệnh $O(N)$ thực thi, toàn bộ các request khác trong Fired Events Queue (kể cả lệnh nhẹ $O(1)$ như `GET` chỉ mất 50ns) đều bị đóng băng và tăng vọt Queue Wait Time.
- **Giải pháp Non-blocking:** Thay thế `KEYS *` bằng con trỏ con `SCAN cursor MATCH pattern* COUNT 100` để chia nhỏ quá trình quét và nhả CPU cho các Events khác xen kẽ.

---

Extra: Tương tự `KEYS *`, lệnh `DEL` trên Large Key (chứa >10k phần tử) cũng làm treo luồng chính để giải phóng RAM đồng bộ; phải thay bằng `UNLINK` để giải phóng ngầm qua luồng `bio.c`.
