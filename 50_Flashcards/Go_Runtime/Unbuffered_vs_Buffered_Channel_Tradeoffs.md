---
noteId: 1790159214030
---

Điểm khác biệt cốt lõi về cơ chế Blocking giữa Unbuffered Channel và Buffered Channel trong Go là gì?

---

- **Unbuffered (`make(chan T)`)**: Đồng bộ trao tận tay; bên gửi hoặc bên nhận bị block ngay lập tức cho đến khi phía đối diện sẵn sàng.
- **Buffered (`make(chan T, N)`)**: Bất đồng bộ qua Ring Buffer; gửi chỉ block khi buffer đầy, nhận chỉ block khi buffer rỗng.

---

Extra: Dùng Unbuffered cho signaling/shutdown; dùng Buffered để hấp thụ burst traffic. Không dùng Buffered để chữa cháy consumer quá chậm vì khi buffer đầy hệ thống vẫn nghẽn.
