---
tags: [type/project, status/active]
priority: High
deadline: 2026-07-27
stack: [NestJS, PostgreSQL, Redis, Socket.io, BullMQ, Docker, TypeScript ^6.0.3]
created_at: 2026-06-27
---

# Ticket Booking Backend

## Objective (SMART Goal)

- **Goal:** Xây dựng hệ thống Backend đặt vé (Ticket Booking/Flash Sale) bằng NestJS, PostgreSQL và Redis tập trung vào giải quyết bài toán đồng thời (Concurrency) và chịu tải cao.
- **Outcome:**
  1. Tránh hoàn toàn việc bán vượt số vé hiện có (Overselling) dưới tải lớn qua Redis Distributed Lock (Redlock).
  2. Đảm bảo 100% các sự kiện hậu đặt vé (gửi email xác nhận, tạo hóa đơn PDF) được xử lý thành công nhờ triển khai **Transactional Outbox Pattern** kết hợp với **BullMQ** (tránh mất mát message khi worker hoặc DB bị sập).
  3. Đóng gói toàn bộ hệ thống bằng Docker Compose và có tài liệu Load Testing bằng k6 chứng minh khả năng chịu tải (mục tiêu vượt qua stress test với 1,000 người dùng đồng thời - CCU).

## Tech Stack & Tools

- **Backend:** NestJS (TypeScript), BullMQ (Message Queue)
- **Database:** PostgreSQL (lưu trữ thông tin vé, order và outbox events), Redis (lưu cache session, rate limit và quản lý Distributed Lock)
- **DevOps:** Docker, Docker Compose
- **Testing:** k6 / Autocannon (để thực hiện stress test và kiểm tra race condition)

## Roadmap / Milestones

- [ ] **Phase 1: Init & Redlock** (Deadline: 05/07/2026)
  - [ ] Khởi tạo NestJS project (`bun`) và Docker Compose (Postgres + Redis).
  - [ ] Thiết kế Database Schema và kết nối ORM (TypeORM).
  - [ ] Xây dựng Domain Model cho Ticket & Order (không dùng decorators).
  - [ ] Triển khai `RedlockService` (Distributed Lock) và tích hợp Pessimistic Locking (`SELECT ... FOR UPDATE`).
- [ ] **Phase 2: Outbox & BullMQ** (Deadline: 12/07/2026)
  - [ ] Tạo bảng `outbox_events` trong PostgreSQL.
  - [ ] Tích hợp ghi nhận sự kiện `order.created` trong cùng transaction DB khi lưu Order.
  - [ ] Cấu hình BullMQ và viết `NotificationProcessor` background consumer.
  - [ ] Triển khai `OutboxRelayer` (Cron Job) quét outbox đẩy event lên BullMQ.
- [ ] **Phase 3: Real-time & LoadTest** (Deadline: 20/07/2026)
  - [ ] Viết WebSocket Gateway thông báo số lượng vé còn lại real-time.
  - [ ] Scale WebSockets sử dụng Redis Pub/Sub adapter.
  - [ ] Viết script test chịu tải bằng k6 giả lập 1,000 CCU.
- [ ] **Phase 4: Polish & Docs** (Deadline: 27/07/2026)
  - [ ] Tối ưu hóa database indexes trên bảng `outbox_events` và `orders`.
  - [ ] Lập báo cáo hiệu năng stress test k6 và tổng hợp bullet points kinh nghiệm đưa vào CV.

## Work Log / Decisions

- **[27/06]:** Khởi tạo dự án. Lựa chọn phương án làm dự án Ticket Booking thay vì Chat app do độ khó của bài toán đồng thời và quản lý nhất quán dữ liệu cao hơn. Quyết định áp dụng kết hợp [[Outbox_Pattern]] và BullMQ để giải quyết vấn đề gửi email/tạo PDF tin cậy.
- **[27/06]:** Hoàn thành chuẩn bị tài liệu (MOC, Architecture, Setup Roadmap, Checklist) - Đang chờ người dùng phê duyệt trước khi tạo thư mục code thực tế.

## Related Resources

- Lộ trình thiết lập và checklist chi tiết: [[Setup_Roadmap_and_Checklist]]
- Đặc tả thiết kế hệ thống chi tiết: [[Architecture_and_Spec]]
- Sơ đồ cơ sở dữ liệu (DBML): [[Database_Schema.dbml]]
- Luồng tích hợp dữ liệu phim (TMDB): [[Movie_Sync_Workflow]]
- Chiến lược dịch thuật & Caching: [[Localization_and_Caching_Strategy]]
- Chiến lược tách Refresh Token: [[Refresh_Token_Separation_Strategy]]
- Kiểm định Index CSDL: [[Database_Index_Audit]]
- Chiến lược thiết kế Enum CSDL: [[Database_Enum_Strategy]]
- Mẫu thiết kế Transactional Outbox: [[Outbox_Pattern]]
- Nguyên lý thiết kế mã nguồn sạch: [[Clean_Architecture]]
- So sánh Nginx vs Caddy: [[nginx-vs-caddy]]
