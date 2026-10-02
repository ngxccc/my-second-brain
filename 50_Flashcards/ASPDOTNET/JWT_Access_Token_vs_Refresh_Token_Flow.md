---
noteId: 1790774286806
---

Tại sao hệ thống an toàn luôn cần cặp Access Token và Refresh Token, và luồng xoay vòng (Token Rotation) ra sao?

---

- **Tại sao cần 2 Token:**
  - **Access Token:** Hạn sống cực ngắn (5–15 phút), dùng gửi kèm mọi request. Nếu bị lộ, kẻ gian chỉ dùng được trong vài phút.
  - **Refresh Token:** Hạn sống dài (7–30 ngày), lưu trong CSDL server, chỉ dùng duy nhất 1 việc: Đổi lấy Access Token mới khi token cũ hết hạn.
- **Luồng xoay vòng (Token Rotation):**
  1. Access Token hết hạn -> Server trả lỗi `401 Unauthorized`.
  2. Client gửi Refresh Token lên endpoint `/api/auth/refresh`.
  3. Server kiểm tra CSDL hợp lệ -> Thu hồi Refresh Token cũ, phát hành 1 cặp Access Token + Refresh Token mới gửi về Client.

---

Extra: Kỹ thuật Refresh Token Rotation giúp phát hiện rò rỉ token: Nếu 1 token cũ đã dùng rồi mà bị gửi lại, server lập tức hủy toàn bộ phiên của tài khoản đó.
