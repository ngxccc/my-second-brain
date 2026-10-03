---
noteId: 1790774286806
---

Tại sao hệ thống xác thực an toàn luôn cần cặp Access Token và Refresh Token?

---

- **Access Token (Ngắn hạn, 5-15m)**: Gửi kèm mọi request; nếu bị lộ, kẻ gian chỉ dùng được trong vài phút.
- **Refresh Token (Dài hạn, 7-30d)**: Lưu an toàn trong DB server, chỉ dùng để đổi lấy Access Token mới khi token cũ hết hạn (Token Rotation).

---

Extra: Khi Access Token hết hạn (401), client gửi Refresh Token lên endpoint /refresh; server kiểm tra hợp lệ, thu hồi token cũ và phát hành cặp token mới.
