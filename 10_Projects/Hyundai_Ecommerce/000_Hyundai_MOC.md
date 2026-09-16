---
tags: [type/moc, topic/hyundai-ecommerce]
date: 2026-09-12
aliases: [Hyundai Index, Hyundai Map, Hyundai MOC]
status: active
---

# Hyundai Ecommerce Map of Content (MOC)

## TL;DR

Bản đồ định hướng và quản lý kiến thức dành riêng cho dự án Hyundai Ecommerce. Đây là nơi lưu trữ các khảo sát nghiệp vụ, quy chuẩn mã nguồn thực tế và lộ trình chuẩn bị phỏng vấn, đồng thời liên kết chặt chẽ với hệ thống Living Documentation (CONTEXT.md và các ADR) nằm trực tiếp trong mã nguồn.

---

## 1. Domain SSOT & Architecture Decisions (Mã Nguồn Co-located)

Hệ thống áp dụng mô hình Docs-as-Code. Các quy định về ngôn ngữ nghiệp vụ và quyết định kiến trúc bất biến được đặt trực tiếp bên trong repository:

- `CONTEXT.md` (Thư mục gốc): Từ điển Ngôn ngữ Chung (Ubiquitous Language) và danh mục các quy tắc bất biến nghiệp vụ (Domain Invariants).
- `backend/docs/adr/0001-catalog-multilingual-translation-table-tradeoffs.md`: Mô hình bảng dịch 1-N cho Catalog đa ngôn ngữ.
- `backend/docs/adr/0002-standardized-i18n-typed-exceptions-and-error-architecture.md`: Kiến trúc xử lý ngoại lệ đa ngôn ngữ i18n typed.
- `backend/docs/adr/0003-zod-as-single-source-of-truth-for-openapi-and-contract-validation.md`: Zod làm Single Source of Truth cho OpenAPI và DTOs.
- `backend/docs/adr/0004-b2b-industrial-quotation-engine-pivot.md`: Chuyển đổi chiến lược từ bán lẻ B2C sang nền tảng Báo giá và Đàm phán B2B máy công nghiệp.
- `backend/docs/adr/0005-nestjs-jwt-refresh-token-rotation-auth.md`: Hệ thống xác thực NestJS Custom JWT + Refresh Token Rotation (SHA-256) thay thế Better Auth.
- `backend/docs/adr/0006-transactional-outbox-pattern-with-skip-locked.md`: Mô hình Transactional Outbox với cơ chế quét non-blocking SKIP LOCKED.
- `backend/docs/adr/0007-zero-overhead-typed-transport-via-openapi-fetch.md`: Tầng giao vận đa ứng dụng openapi-fetch siêu tinh gọn không overhead.
- `backend/docs/adr/0008-decoupling-b2b-quotation-lifecycle-from-retail-orders.md`: Tách rời vòng đời Báo giá B2B khỏi luồng Đơn hàng bán lẻ cũ.

---

## 2. Khảo Sát Nghiệp Vụ & Lộ Trình Phỏng Vấn (Second Brain Notes)

- [[Business_Domain_And_Architecture_Audit]]: Báo cáo khảo sát nghiệp vụ thực tế, phân loại code cốt lõi vs code cũ/thừa (Cart, Payments, Orders).
- [[Intern_Interview_Roadmap]]: Lộ trình ôn phỏng vấn thực chiến với Mô hình Kim tự tháp 3 tầng và Bộ 3 câu chuyện sát thủ bám sát mã nguồn.
- [[Project_Anchored_Technical_Mastery]]: Phương pháp phá vỡ ngụy biện nhị nguyên, lấy dự án làm mỏ neo bài toán để đào sâu công nghệ tầng sâu.

---

## 3. Hồ Sơ Kỹ Thuật & Tối Ưu Hóa (Technical In-Depth Notes)

- [[Database/PostgreSQL_vs_Other_Databases]]: Lý do lựa chọn PostgreSQL làm RDBMS trung tâm, tối ưu hóa truy vấn JSONB và chỉ mục B-Tree.
- [[Architecture/V8_Performance_Audit]]: Phân tích hiệu năng thực thi V8, quản lý bộ nhớ Heap/Stack và các mẫu hình tối ưu hóa tránh garbage collection churn.
- [[Technical_First_Principles_Deep_Dive]]: Bản chất 80/20 các công nghệ cốt lõi (PostgreSQL MVCC/WAL/Locking, Redis I/O Multiplexing/Cache Pitfalls, BullMQ Lua Scripts và Thực tế Concurrency Outbox PostgreSQL SKIP LOCKED).

---

## 4. Kế Hoạch & Tracking Issues (GitHub Issues)

- Issue #153: `chore(cart,payments): deprecate and isolate dormant B2C cart and instant payment modules`.
- Issue #154: `refactor(orders): decouple B2B quote approval from legacy retail order flow`.
- Issue #155: `docs(domain): adopt enterprise living documentation with ubiquitous language and ADRs for B2B domain`.
