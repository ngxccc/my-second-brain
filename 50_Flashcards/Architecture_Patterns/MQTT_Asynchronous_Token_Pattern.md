---
noteId: 1790265532798
---

Tại sao thư viện MQTT Client lại áp dụng Asynchronous Token Pattern (`client.Connect() -> Token`) thay vì trả về lỗi đồng bộ?

---

- **I/O phi chặn (Non-blocking)**: Hàm `Connect()` trả về ngay phiếu hẹn `Token` (bọc `chan struct{}`) để luồng chính không bị đơ trong khi Goroutine ngầm bắt tay mạng TCP.

---

Extra: Lệnh `token.Wait()` thực chất chờ `<-token.Done()`. Nếu gọi Publish/Subscribe trước khi `token.Wait()` xong, client sẽ văng lỗi `not connected` do socket chưa hoàn tất kết nối.
