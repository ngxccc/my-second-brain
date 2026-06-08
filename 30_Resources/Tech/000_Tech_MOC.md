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
- [[Circular_Dependency]]: Vòng lặp phụ thuộc tai hại giữa các module và cách giải quyết.
- [[Clean_Architecture]]: Hệ tư tưởng phân tầng kiến trúc để cô lập và bảo vệ Core Business Logic khỏi sự phụ thuộc công nghệ.
- [[SOLID_Principles]]: Bộ 5 nguyên lý vàng thiết kế hướng đối tượng giúp code modular, linh hoạt và dễ bảo trì.
- [[Interface_Driven_Design]]: Thiết kế dựa trên giao diện (contract-first) giúp các lớp lỏng lẻo và phát triển song song.
- [[Test_Driven_Design]]: Quy trình viết test trước, code sau giúp định hình kiến trúc phần mềm sạch.
- [[Domain_Driven_Design]]: Thiết kế hướng tên miền, giải quyết độ phức tạp của nghiệp vụ cốt lõi.
- [[DI_WinForms_Components]]: Kỹ thuật Dependency Injection cho Dumb, Root và Smart Child Components trong C# WinForms.
- [[Newsfeed_Architecture_Fanout]]: Thiết kế hệ thống Newsfeed tải cao bằng kiến trúc Hybrid Fan-out (Push + Pull).

## Frameworks & Ecosystem (Hệ sinh thái React/Next.js)

- [[React_Server_Components]]: Cơ chế render UI trên server, gửi payload tĩnh về client.
- [[NextJS_Server_Actions]]: Kỹ thuật mutate data trực tiếp từ server bằng RPC ngầm.
- [[Next_Intl]]: Thư viện i18n hỗ trợ strict type-safety và Server Components.
- [[WinForms_Layout_Optimization]]: Tối ưu hóa Layout Engine của WinForms bằng SuspendLayout và ResumeLayout.
- [[React_Component_Declaration_Standards]]: Tiêu chuẩn khai báo React component (export function vs arrow function).

## API & Data Design (Thiết kế Giao tiếp Dữ liệu)

- [[Cursor_Pagination]]: Phân trang hiệu suất cao $O(1)$ thay thế cho Offset $O(N)$ cồng kềnh.
- [[API_Versioning_Strategies]]: Quản lý tương thích ngược (Backward Compatibility) bằng URI hoặc Header.
- [[DB_Naming]]: Quy tắc đặt tên đồng bộ và nhất quán giữa Database (Số ít) và TypeScript ORM (Số nhiều).
- [[Prepare_Statements]]: Cơ chế truy vấn chuẩn bị trước để tối ưu hiệu năng và bảo mật SQL.
- [[Outbox_Pattern]]: Mẫu thiết kế xử lý Dual-Write tin cậy bằng bảng Outbox và Worker.
- [[Partial_Index]]: Lập chỉ mục có điều kiện giúp tiết kiệm dung lượng đĩa và tối ưu hóa ghi.
- [[SQL_Quotes]]: Phân biệt dấu nháy đơn (String Literals) và nháy kép (Identifiers) trong SQL.
- [[Left_Prefix_Index_Postgres]]: Nguyên lý Left-Prefix của Composite Index trong PostgreSQL.
- [[Junction_Table]]: Giải quyết quan hệ Nhiều-Nhiều bằng bảng liên kết và khóa chính phức hợp.
- [[Timestamp_vs_Timestamptz]]: Phân biệt timestamp và timestamptz, quy tắc Enterprise bắt buộc.
- [[RFC_Trending_Cache]]: RFC đề xuất caching realtime leaderboard bằng Redis Sorted Sets (ZSET).
- [[Database_Indexing_Guidelines]]: Hướng dẫn chi tiết khi nào dùng Index thường, Composite Index và Partial Index.

## Infrastructure & Cloud (Hạ tầng & Đám mây)

- [[Serverless_Architecture]]: Hạ tầng thực thi auto-scale, không lưu state (Stateless).
- [[Edge_Computing]]: Đưa code ra các node CDN gần user nhất để giảm latency.

## Web Client & Security (Trình duyệt & Bảo mật)

- [[Client_Side_Encryption]]: Mã hóa LocalStorage/IndexedDB bằng thuật toán AES.
- [[Offline_Sync_Queue]]: Kỹ thuật Outbox Pattern ở phía client cho ứng dụng Offline-First.
- [[Cognitive_Strain_UX]]: Áp dụng tâm lý học tạo độ khó chủ đích vào UI/UX.

## Language & Core (Cốt lõi Ngôn ngữ)

- [[TS_Distributive_Conditional_Types]]: Cơ chế tự động xé lẻ Union Type trong các biểu thức Generic của TypeScript.
- [[JS_Destructuring]]: Kỹ thuật bóc tách dữ liệu mảng và đối tượng trong ES6.
- [[CSharp_WinForms_Thread_Invoke]]: Cơ chế Invoke đa luồng an toàn tránh lỗi Cross-thread trong WinForms.
- [[Tree_Shaking]]: Kỹ thuật phân tích tĩnh để loại bỏ dead code khi đóng gói Javascript.
