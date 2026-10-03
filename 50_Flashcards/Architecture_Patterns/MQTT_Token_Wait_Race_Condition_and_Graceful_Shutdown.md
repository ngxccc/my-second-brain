---
noteId: 1790265532866
---

Trong Go MQTT Client, tại sao gọi `client.Subscribe()` ngay sau `client.Connect()` mà không chờ `token.Wait()` lại gây lỗi?

---

- **Socket chưa kết nối**: `Connect()` ủy thác bắt tay TCP cho Goroutine chạy ngầm; gửi gói tin `SUBSCRIBE` trước khi `token.Wait()` hoàn tất sẽ ghi vào socket chưa sẵn sàng gây lỗi `not connected`.

---

Extra: Graceful Shutdown chuẩn: Đón SIGTERM, dừng xuất bản qua `stopChan`, gọi `client.Disconnect(250ms)` để runtime kịp đẩy nốt Inflight Packets trước khi đóng hẳn TCP socket.
