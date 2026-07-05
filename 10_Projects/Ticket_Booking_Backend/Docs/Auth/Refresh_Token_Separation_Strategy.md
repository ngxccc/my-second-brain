---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-04
aliases: [Chiến lược tách Refresh Token, Refresh Token Separation Strategy]
---

# Chiến Lược Tách Refresh Token Ra Bảng Riêng

## TL;DR

Tài liệu này trình bày các đánh giá kiến trúc, ưu/nhược điểm và giải pháp triển khai tách cột `refreshTokenHash` từ bảng `users` sang một bảng riêng biệt `refresh_tokens`. Sự thay đổi này giúp hỗ trợ nhiều thiết bị đồng thời (Multi-Device Sessions), thu hồi quyền chọn lọc (Granular Revocation) và áp dụng cơ chế xoay vòng token bảo mật (Refresh Token Rotation - RTR).

---

## Core Concept & Rationale

Trong thiết kế ban đầu, `refreshTokenHash` được lưu trực tiếp tại bảng `users` để tối giản cấu trúc dữ liệu. Tuy nhiên, khi hệ thống mở rộng, thiết kế này bộc lộ các hạn chế lớn về bảo mật và trải nghiệm người dùng:

1. **Giới hạn một thiết bị (The Single-Session Constraint):** Lưu 1 token duy nhất trong bảng `users` đồng nghĩa với việc khi người dùng đăng nhập trên điện thoại, token mới sẽ ghi đè và tự động đăng xuất họ khỏi máy tính bảng hoặc máy tính cá nhân.
2. **Không có khả năng thu hồi chọn lọc (Granular Revocation):** Người dùng không thể thực hiện thao tác "Đăng xuất khỏi thiết bị Laptop bị mất" mà vẫn giữ trạng thái đăng nhập ở điện thoại.
3. **Thiếu hỗ trợ xoay vòng bảo mật (RTR - Refresh Token Rotation):** Cơ chế RTR đòi hỏi việc phát hiện token cũ đã bị sử dụng lại (Token Reuse Detection) để ngăn chặn tấn công đánh cắp token. Lưu trữ lịch sử token cũ trong bảng `users` là điều bất khả thi.

Tách cột `refreshTokenHash` sang bảng quan hệ Nhiều-Một (`refresh_tokens.user_id -> users.id`) giải quyết triệt để các vấn đề trên.

---

## Trade-offs Analysis

### 1. So sánh chi tiết

| Tiêu chí                         | Lưu trong bảng `users`                                | Tách sang bảng `refresh_tokens`                                 |
| :------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------- |
| **Đăng nhập nhiều thiết bị**     | Không hỗ trợ (ghi đè)                                 | Hỗ trợ tự nhiên (Một-Nhiều)                                     |
| **Thu hồi phiên**                | Thu hồi tất cả cùng lúc                               | Thu hồi từng thiết bị riêng lẻ                                  |
| **Bảo mật (RTR)**                | Khó triển khai phát hiện tái sử dụng                  | Dễ dàng (Đánh dấu `is_revoked` hoặc so khớp lịch sử)            |
| **Hiệu năng cập nhật (DB Lock)** | **Kém:** Lock trực tiếp dòng profile user khi refresh | **Tốt:** Chỉ lock dòng token tương ứng, không ảnh hưởng profile |
| **Độ phức tạp CSDL**             | Rất đơn giản                                          | Tăng thêm 1 bảng, tốn bộ nhớ lưu trữ hơn                        |

### 2. Đánh giá Concurrency & DB Lock Contention

- **Khi lưu trong `users`:** Cứ mỗi 15-30 phút khi Access Token hết hạn, hệ thống gọi API refresh token và chạy lệnh `UPDATE users SET refresh_token_hash = ... WHERE id = ...`. Việc này sẽ tạo **Exclusive Lock** trên dòng dữ liệu của user trong bảng chính. Nếu user đang thực hiện đặt vé song song, việc lock này có thể gây nghẽn giao dịch đặt chỗ.
- **Khi tách sang `refresh_tokens`:** Lệnh `UPDATE` hoặc `DELETE` chỉ khóa dòng tương ứng trong bảng `refresh_tokens`. Dữ liệu hồ sơ người dùng trong bảng `users` hoàn toàn không bị ảnh hưởng, cải thiện tính đồng thời cho hệ thống.

---

## Practical Implementation (PostgreSQL Schema)

CSDL định nghĩa bảng `refresh_tokens` lưu trữ mã băm SHA-256 kèm metadata thiết bị phục vụ kiểm toán bảo mật:

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE, -- SHA-256 hash của Refresh Token
  device_name VARCHAR(255),               -- E.g. Chrome on Windows
  ip_address VARCHAR(45),                 -- Lưu IP của phiên để phát hiện bất thường
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT false NOT NULL, -- Đánh dấu nếu token bị lộ / xoay vòng
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Index để tối ưu hóa việc tìm kiếm và thu hồi
CREATE UNIQUE INDEX refresh_tokens_token_hash_uidx ON refresh_tokens(token_hash);
CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens(user_id);
```

### Luồng Xoay Vòng Bảo Mật (Refresh Token Rotation - RTR)

1. Khi khách hàng gửi yêu cầu refresh bằng Token A:
   - Hệ thống truy vấn băm của Token A trong DB.
   - Nếu tìm thấy và `is_revoked = true` $\rightarrow$ **Cảnh báo bảo mật:** Có dấu hiệu token cũ bị đánh cắp và sử dụng lại. Hệ thống lập tức thu hồi toàn bộ các Refresh Token khác của `user_id` đó để bắt buộc đăng nhập lại toàn bộ thiết bị.
   - Nếu hợp lệ, đánh dấu Token A là `is_revoked = true` (hoặc xóa đi) và sinh Token B mới lưu vào DB, trả Token B về cho client.

---

## Related Notes

- Bản đồ dự án (MOC): [[000_Ticket_Booking_MOC]]
- Sơ đồ cơ sở dữ liệu (DBML): [[Database_Schema.dbml]]
- Đặc tả thiết kế hệ thống: [[Architecture_and_Spec]]
- Chiến lược dịch thuật & Caching: [[Localization_and_Caching_Strategy]]
