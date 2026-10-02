---
noteId: 1790774286857
---

So sánh ưu nhược điểm cốt lõi giữa Stateful Cookie Session và Stateless JWT Authentication?

---

- **Stateful Cookie Session (MVC Monolith truyền thống):**
  - **Ưu điểm:** Thu hồi phiên (Revoke/Đăng xuất/Khóa tài khoản) **ngay lập tức** bằng cách xóa session trong RAM/DB.
  - **Nhược điểm:** Khó mở rộng đa máy chủ (Scale Out), tốn RAM lưu trữ phiên.
- **Stateless JWT (Web API, Mobile App, Microservices):**
  - **Ưu điểm:** **Khả năng mở rộng tuyệt vời** vì Server không tốn 1 byte RAM nào lưu phiên. Mọi server đều tự giải mã và kiểm tra chữ ký token độc lập.
  - **Nhược điểm:** **Không thể thu hồi token ngay lập tức** khi chưa hết hạn `exp` (trừ khi xây dựng blacklist tốn kém).

---

Extra: Tóm tắt đánh đổi: Cookie = Kiểm soát phiên tức thì nhưng tốn RAM; JWT = Mở rộng vô hạn nhưng khó thu hồi token khẩn cấp.
