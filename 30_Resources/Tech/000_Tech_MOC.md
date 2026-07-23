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
- [[Repository_Pattern_vs_Fat_Service]]: So sánh giữa Repository Pattern và Fat Service (Direct ORM) trong thiết kế tầng dữ liệu.
- [[Unified_Fullstack_vs_Split_Architecture]]: Phân tích so sánh chi tiết giữa mô hình Fullstack gộp (Next.js Monorepo) và mô hình chia tách repo Backend/Frontend.

## Frameworks & Ecosystem (Hệ sinh thái React/Next.js)

- [[React_Server_Components]]: Cơ chế render UI trên server, gửi payload tĩnh về client.
- [[NextJS_Server_Actions]]: Kỹ thuật mutate data trực tiếp từ server bằng RPC ngầm.
- [[Next_Intl]]: Thư viện i18n hỗ trợ strict type-safety và Server Components.
- [[NextJS_16_Cache_Components]]: Mô hình Caching component-level mới của Next.js 16 dùng chỉ thị 'use cache' và cacheLife.
- [[NextJS_PPR_Platform_Support]]: Cơ chế và cách thức các Cloud Platform hỗ trợ triển khai Partial Prerendering.
- [[NextJS_ISR]]: Cơ chế cập nhật và tái tạo các trang tĩnh ở runtime mà không cần rebuild toàn bộ site.
- [[NextJS_Dynamic_Opt_Out_Connection]]: Cơ chế ngắt Prerender tĩnh và chuyển đổi sang Dynamic Rendering ở Next.js 15/16.
- [[NextJS_after_API]]: Cơ chế lập lịch tác vụ nền không chặn (non-blocking) sau khi response đã được gửi về client.
- [[NextJS_Route_Groups_and_Nested_Layouts]]: Bản chất của Route Groups và cơ chế kế thừa layout (Nested Layouts) trong Next.js App Router.
- [[NextJS_Monorepo_Package_Transpilation]]: Cơ chế biên dịch gói nội bộ (transpilePackages) và tối ưu hóa build trong Turborepo.
- [[Turborepo]]: Công cụ xây dựng hiệu suất cao cho các dự án Monorepo sử dụng JavaScript/TypeScript.
- [[WinForms_Layout_Optimization]]: Tối ưu hóa Layout Engine của WinForms bằng SuspendLayout và ResumeLayout.
- [[React_Component_Declaration_Standards]]: Tiêu chuẩn khai báo React component (export function vs arrow function).
- [[React_State]]: Trạng thái nội bộ của component, quản lý dữ liệu động thay đổi theo thời gian.
- [[React_Props]]: Thuộc tính truyền từ component cha xuống, mang tính chất bất biến (read-only).

## Backend Frameworks (Cấu trúc & Framework Backend)

- [[Backend_Frameworks_Comparison]]: So sánh toàn diện giữa NestJS, Express, Fastify và ElysiaJS về hiệu năng, DX, độ tương thích và trường hợp sử dụng phù hợp.

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
- [[Index_BPlusTree]]: Bản chất của Index, cấu trúc B+Tree và lý do tại sao Disk I/O quyết định kiến trúc Database.
- [[Postgres_18_New_Features]]: Tổng hợp các tính năng mới và cải tiến kiến trúc nhân (Meson build, AIO, Failover Slots, Radix Tree Vacuum) của PostgreSQL 18.
- [[Postgres_Select_For_Update_Pessimistic_Locking]]: Cơ chế Row-Level Exclusive Lock trong PostgreSQL chống tranh chấp đồng thời (TOCTOU / Race Condition).

## Infrastructure & Cloud (Hạ tầng & Đám mây)

- [[Serverless_Architecture]]: Hạ tầng thực thi auto-scale, không lưu state (Stateless).
- [[Edge_Computing]]: Đưa code ra các node CDN gần user nhất để giảm latency.
- [[Torrent_CLI_Download_Tools]]: So sánh các công cụ download torrent CLI thay thế aria2c; qBittorrent-nox là all-rounder hàng đầu cho server headless năm 2026.

## Web Client & Security (Trình duyệt & Bảo mật)

- [[Client_Side_Encryption]]: Mã hóa LocalStorage/IndexedDB bằng thuật toán AES.
- [[Offline_Sync_Queue]]: Kỹ thuật Outbox Pattern ở phía client cho ứng dụng Offline-First.
- [[Cognitive_Strain_UX]]: Áp dụng tâm lý học tạo độ khó chủ đích vào UI/UX.
- [[Multi_Layer_Rate_Limiting_DDoS_Prevention]]: Chiến lược rate limit đa lớp (IP/Email) và chống DDoS/Credential Stuffing.
- [[Trust_Proxy_Configuration]]: Cấu hình tin tưởng proxy trong Express & NestJS để lấy client IP chính xác.

## Language & Core (Cốt lõi Ngôn ngữ)

- [[Rust_Hybrid_Roadmap]]: Lộ trình học Rust thực chiến kết hợp hệ thống & an ninh mạng.
- [[Go_Learning_Roadmap]]: Lộ trình học Go thực chiến từ cơ bản đến microservices & production.

- [[JS_Runtimes_Bun_vs_NodeJS]]: So sánh kiến trúc runtime Bun (JavaScriptCore + Zig) vs Node.js (V8 + Libuv) và cơ chế Event Loop cốt lõi.
- [[JS_Temporal_API]]: API xử lý ngày giờ thế hệ mới chính thức của JavaScript (ECMAScript 2026).
- [[JS_Memory_Management_Stack_Heap_GC]]: Mô hình quản lý bộ nhớ (Stack vs Heap), cơ chế dọn rác phân thế hệ (Generational GC) và cách phòng ngừa rò rỉ bộ nhớ (Memory Leaks).
- [[JS_Immer_Immutable_State]]: Quản lý trạng thái bất biến (Immutable State) thông qua cơ chế Copy-on-Write (COW) và ES6 Proxy, giải pháp tối ưu cho Zustand/Redux stores.
- [[TS_Type_System_Structural_Type_Erasure]]: Hệ thống kiểu cấu trúc (Structural Typing), cơ chế xóa bỏ kiểu (Type Erasure) và cách thu hẹp kiểu an toàn với Type Predicates.
- [[TS_Decorators]]: Phương pháp trang trí trong TypeScript chuẩn ES (Stage 3) vs cũ (experimentalDecorators).
- [[10_Projects/Hyundai_Ecommerce/Docs/V8_Performance_Audit.md|V8_Performance_Audit]]: Báo cáo đánh giá hiệu năng V8 Engine và Memory (Cấp phát Stack/Heap, tối ưu hóa Hidden Classes, tránh delete/spread trên hot-path).
- [[TS_Distributive_Conditional_Types]]: Cơ chế tự động xé lẻ Union Type trong các biểu thức Generic của TypeScript.
- [[TS_Type_Utilities_Omit_Pick_Exclude]]: So sánh chi tiết bản chất và phân biệt các tiện ích kiểu Omit, Pick, Exclude.
- [[JS_Destructuring]]: Kỹ thuật bóc tách dữ liệu mảng và đối tượng trong ES6.
- [[CSharp_WinForms_Thread_Invoke]]: Cơ chế Invoke đa luồng an toàn tránh lỗi Cross-thread trong WinForms.
- [[Dotnet_10_and_11_New_Features]]: So sánh các tính năng mới cốt lõi của .NET 10 (LTS) & .NET 11 (Preview) so với .NET 9.
- [[Tree_Shaking]]: Kỹ thuật phân tích tĩnh để loại bỏ dead code khi đóng gói Javascript.

---

_Last updated: 2026-07_
