---
noteId: 1790265532866
---

Trong Go MQTT Client, nếu gọi `client.Connect()` rồi ngay lập tức gọi `client.Subscribe()` mà bỏ qua việc kiểm tra `token.Wait()`, điều gì sẽ diễn ra ở tầng mạng và Runtime? Làm thế nào để xử lý Graceful Shutdown đối với kết nối MQTT?

---

- **Hiện tượng Race Condition ở tầng Socket:**
  - `client.Connect()` ủy thác tiến trình bắt tay TCP cho một Goroutine chạy ngầm.
  - Khi không gọi `token.Wait()`, luồng chính tiếp tục chạy và ghi gói tin `SUBSCRIBE` vào socket TCP chưa hoàn tất trạng thái kết nối $\rightarrow$ Client văng lỗi `not connected` hoặc gói tin bị thất thoát ngầm.
- **Quy trình Graceful Shutdown chuẩn công nghiệp:**
  - Đón tín hiệu ngắt từ hệ điều hành (`SIGINT`, `SIGTERM`) qua một OS signal channel.
  - Dừng các vòng lặp Publish dữ liệu thông qua việc đóng `stopChan` (`close(chan struct{})`).
  - Gọi `client.Disconnect(quiesce uint)` với khoảng thời gian chờ (ví dụ 250ms) để Go runtime đẩy nốt các gói tin đang bay dở trên đường truyền (Inflight Packets) và chờ nhận `PUBACK` trước khi đóng hẳn TCP socket.

---

Extra: Trong MQTT, ClientID bắt buộc phải là duy nhất trên toàn Broker. Nếu hai kết nối cùng mang một ClientID, Broker sẽ lập tức ngắt kết nối (Disconnect) của Client cũ để nhường chỗ cho Client mới.
