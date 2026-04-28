---
tags: [type/moc, topic/tech]
date: 2026-04-28
aliases: [Tech Index, Tech Map]
---
# Tech Knowledge Map of Content (MOC)

## TL;DR

Bản đồ điều hướng trung tâm cho toàn bộ tri thức kỹ thuật. Phân loại theo các Domain cốt lõi để tra cứu nhanh chóng thay vì phụ thuộc vào cấu trúc thư mục vật lý cứng nhắc.

## Architecture & Patterns (Kiến trúc & Mẫu thiết kế)

- [[Layered_Architecture]]: Kiến trúc N-Tier truyền thống chia theo Technical Concerns.
- [[Modular_Monolith_Architecture]]: Kiến trúc chia theo Domain/Feature (High Cohesion, Low Coupling).
- [[MVC_Pattern]]: Mô hình kinh điển và sự tiến hóa thành REST API hiện đại.
- [[Public_Interface_Pattern]]: Cổng giao tiếp an toàn giữa các module (Facade).
- [[Dependency_Injection]]: Kỹ thuật đảo ngược luồng điều khiển (IoC) để giảm tight-coupling và dễ test.
- [[Shared_Module_Dependency_Rule]]: Quy tắc mũi tên một chiều chống Circular Dependency.

## Frameworks & Ecosystem (Hệ sinh thái React/Next.js)

- [[React_Server_Components]]: Cơ chế render UI trên server, gửi payload tĩnh về client.
- [[NextJS_Server_Actions]]: Kỹ thuật mutate data trực tiếp từ server bằng RPC ngầm.
- [[Next_Intl]]: Thư viện i18n hỗ trợ strict type-safety và Server Components.

## API & Data Design (Thiết kế Giao tiếp Dữ liệu)

- [[Cursor_Pagination]]: Phân trang hiệu suất cao $O(1)$ thay thế cho Offset $O(N)$ cồng kềnh.
- [[API_Versioning_Strategies]]: Quản lý tương thích ngược (Backward Compatibility) bằng URI hoặc Header.

## Infrastructure & Cloud (Hạ tầng & Đám mây)

- [[Serverless_Architecture]]: Hạ tầng thực thi auto-scale, không lưu state (Stateless).
- [[Edge_Computing]]: Đưa code ra các node CDN gần user nhất để giảm latency.

## Web Client & Security (Trình duyệt & Bảo mật)

- [[Client_Side_Encryption]]: Mã hóa LocalStorage/IndexedDB bằng thuật toán AES.
- [[Offline_Sync_Queue]]: Kỹ thuật Outbox Pattern ở phía client cho ứng dụng Offline-First.
- [[Cognitive_Strain_UX]]: Áp dụng tâm lý học tạo độ khó chủ đích vào UI/UX.

## Language & Core (Cốt lõi Ngôn ngữ)

- [[TS_Distributive_Conditional_Types]]: Cơ chế tự động xé lẻ Union Type trong các biểu thức Generic của TypeScript.
