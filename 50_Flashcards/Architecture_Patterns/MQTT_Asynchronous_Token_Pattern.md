---
noteId: 1790265532798
---

Tại sao thư viện MQTT Client (như Paho MQTT trong Go) lại áp dụng mô hình Asynchronous Token Pattern (`client.Connect() -> mqtt.Token`) thay vì trả về lỗi đồng bộ (`error`)?

---

- **Bản chất I/O bất đồng bộ (Non-blocking):**
  - Môi trường IoT và mạng viễn thông có độ trễ lớn và dễ chập chờn. Nếu hàm `Connect()` chạy đồng bộ (blocking), luồng chính sẽ bị đơ (frozen) trong nhiều giây khi chờ TCP handshake.
  - `Connect()` ngay lập tức kích hoạt một Goroutine ngầm để thực hiện bắt tay mạng và trả về một phiếu hẹn (`mqtt.Token`).
- **Cấu trúc dữ liệu bên trong Token:**
  - Về bản chất, `Token` bọc một Go Channel: `chan struct{}`.
  - Khi Goroutine ngầm hoàn tất handshake (hoặc thất bại), nó sẽ đóng channel này.
  - Lệnh `token.Wait()` thực chất thực hiện thao tác nhận tín hiệu `<-token.Done()` để chặn luồng hiện tại một cách an toàn cho đến khi channel đóng.

---

Extra: Nếu không gọi `token.Wait()` mà lập tức gọi tiếp `client.Publish()` hoặc `client.Subscribe()`, client sẽ ném lỗi `not connected` do socket TCP ở tầng OS kernel chưa kịp hoàn thành bắt tay 3 bước (SYN, SYN-ACK, ACK).
