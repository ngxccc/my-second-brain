---
tags: [type/project, status/active]
date: 2026-11-13
description: "Tài liệu hướng dẫn thực thi chuẩn hóa cho tác vụ thiết lập hạ tầng ứng dụng backend và cơ sở dữ liệu GreenRoots Farm."
---

# Backend Setup Execution Runbook

## TL;DR

- **Bản chất**: Quy chuẩn thi công chi tiết hóa 5 bước khởi tạo hạ tầng ứng dụng NestJS, Drizzle ORM và kiểm thử chấp nhận.
- **Mục đích**: Ngăn ngừa hiện tượng phân tán phạm vi khiến tác vụ thiết lập ban đầu biến thành triển khai toàn bộ nghiệp vụ.
- **Điểm mấu chốt**: Nếu vi phạm 7 ranh giới kỹ thuật bất biến thì quy trình kiểm thử tại bước 5 sẽ từ chối nghiệm thu.

---

## Ngữ Cảnh và Thư Mục Thực Thi

Tác vụ thi công được thực hiện độc lập trong Git worktree riêng biệt:

- **Thư mục làm việc**: `/home/ngxc/workspace/20-projects/greenroots-farm-api`
- **Thư mục đích**: `apps/api/`
- **Git Branch**: `core/api-database-setup`
- **Kho mã nguồn tham chiếu**: `/home/ngxc/workspace/20-projects/open-genset/backend`
- **Tài liệu nguồn chân lý**: [[Database_Schema.dbml]], [[Database_ERD_and_Data_Dictionary]], [[System_Scope_and_Decision_Records]]

---

## Ranh Giới Kỹ Thuật Bất Biến

Agent thực thi bắt buộc tuân thủ 7 nguyên tắc kiến trúc đã chốt, tuyệt đối không tự ý thay đổi:

| STT | Thành phần kỹ thuật       | Ràng buộc bất biến bắt buộc thực thi                                                                                                                                                                           |
| :-- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Drizzle ORM v1**        | Dùng `drizzle-orm@^1.0.0-rc.5-169397b` và `drizzle-kit@^1.0.0-rc.5-ab785fc`. Bắt buộc dùng `defineRelations` và `snakeCase.table`.                                                                             |
| 2   | **Phạm vi Soft Delete**   | Chỉ đúng 5 bảng có `deleted_at`: `users`, `plots`, `categories`, `products`, `subscription_plans`. Bắt buộc gắn Partial Unique Index `WHERE deleted_at IS NULL`. 13 bảng còn lại cấm có cột `deleted_at`.      |
| 3   | **Mật mã học & Auth**     | Hash mật khẩu bằng `node:crypto` `scrypt` định dạng `s1$<salt>$<hash>`, kiểm tra bằng `timingSafeEqual`. Token hash `sha256`. Refresh Token là chuỗi ngẫu nhiên 256-bit hex, cấm dùng JWT.                     |
| 4   | **Thu hồi quyền tức thì** | `JwtAuthGuard` kiểm tra key Redis `auth:revoked:<userId>` (TTL 15 phút). Nếu Redis lỗi kết nối, áp dụng cơ chế fail-open (ghi log warning và cho qua).                                                         |
| 5   | **Chuẩn Response & Lỗi**  | Thành công trả qua `apiSuccess(data, meta?)`. Thất bại trả theo RFC 9457 `application/problem+json` kèm URN tĩnh `/errors/<slug>`. Bắt buộc map lỗi PostgreSQL `P0001` sang HTTP 403 và `23503` sang HTTP 409. |
| 6   | **Biến môi trường kép**   | Tách cấu hình riêng tại `apps/api/.env.example` và `apps/api/doppler.yaml`. Nhóm script `doppler:*` tuyệt đối không dùng cờ `--preserve-env="true"`.                                                           |
| 7   | **Ngôn ngữ & API Docs**   | Tập trung 100% chuỗi thông báo tiếng Việt tại `src/common/constants/messages.constant.ts`, không dùng `nestjs-i18n`. Tài liệu Scalar phục vụ tại `/api/docs` và OpenAPI JSON tại `/openapi.json`.              |

---

## Những Việc Cấm Thực Hiện Trong Bước Này

Để tránh biến bước thiết lập thành triển khai toàn bộ ứng dụng, agent bị cấm thực hiện các nội dung sau:

- **Cấm viết logic nghiệp vụ Checkout**: Không tạo luồng thanh toán giỏ hàng hay tích hợp SDK PayOS; chỉ tạo bảng `payments` trong CSDL.
- **Cấm viết Worker xử lý ngầm**: Không viết cron job tự sinh đơn định kỳ hay worker BullMQ hủy đơn; chỉ đăng ký kết nối module Redis và BullMQ.
- **Cấm viết giải thuật vận chuyển**: Không viết logic tính khoảng cách hay công thức cước Haversine.
- **Cấm sao chép module thừa**: Không tạo các module B2B từ dự án tham chiếu như `dealer-tiers`, `quotes`, `leads`, `credit-limit-history`, `carts`.

---

## Quy Trình 5 Bước Triển Khai Chi Tiết

```text
Bước 1: Khởi tạo package.json & cấu hình workspace
  ├── Khóa phiên bản dependencies chuẩn
  └── Cấu hình build cho packages/shared
Bước 2: Cấu hình môi trường & công cụ thực thi
  ├── Tạo apps/api/.env.example & doppler.yaml
  └── Thiết lập tsconfig.json & scripts chạy kép
Bước 3: Xây dựng tầng CSDL (src/database/)
  ├── Tạo connection pool hỗ trợ Neon & Local
  ├── Khai báo 18 bảng Drizzle schema & relations
  ├── Viết migration trigger bất biến farming_logs
  └── Viết kịch bản nạp dữ liệu mẫu 3 tiers
Bước 4: Thiết lập khung dùng chung & module khung
  ├── Sao chép bộ lọc lỗi RFC 9457 & Zod pipe
  ├── Thiết lập từ điển thông báo tiếng Việt
  ├── Đăng ký APP_GUARD & cấu hình Scalar /api/docs
  └── Tạo khung 5 module cốt lõi: auth, users, farms, catalog, inventory
Bước 5: Chạy kiểm thử nghiệm thu toàn diện
```

### Bước 1: Khởi tạo `apps/api/package.json` và liên kết Monorepo

- Khởi tạo `apps/api/package.json` với các gói phụ thuộc cốt lõi: `@nestjs/core@^12.0.3`, `@nestjs/common@^12.0.3`, `@nestjs/platform-express@^12.0.3`, `@nestjs/jwt@^11.0.0`, `@nestjs/throttler@^6.4.0`, `@scalar/nestjs-api-reference@^0.2.14`, `drizzle-orm@^1.0.0-rc.5-169397b`, `drizzle-kit@^1.0.0-rc.5-ab785fc`, `pg@^8.23.0`, `ioredis@^6.0.0`, `bullmq@^6.3.8`, `zod@^4.6.5`, `nestjs-zod@^5.5.0`, `@greenroots/shared@workspace:*`.
- Đảm bảo `packages/shared` được build trước thông qua lệnh `bun run --cwd packages/shared build`.

### Bước 2: Cấu hình môi trường và kịch bản thực thi

- Tạo file `apps/api/.env.example` chứa các biến: `PORT=3001`, `NODE_ENV=development`, `DB_URL`, `DB_DIRECT_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN=15m`, `JWT_REFRESH_EXPIRES_IN=7d`.
- Tạo file `apps/api/doppler.yaml` với cấu hình dự án `greenroots-farm-api`.
- Bổ sung nhóm script vào `apps/api/package.json`:
  - Chuẩn: `dev`, `build`, `start:node`, `db:generate`, `db:migrate`, `db:push`, `db:seed`.
  - Doppler: `doppler:dev`, `doppler:db:migrate`, `doppler:db:seed` (chạy qua `doppler run -- ...`).

### Bước 3: Xây dựng tầng CSDL `src/database/` và 18 bảng Schema

- Tạo `src/database/database.connection.ts` chứa hàm `normalizeDatabaseUrl()` hỗ trợ Neon SSL và pooler.
- Khai báo đầy đủ 18 bảng trong `src/database/schemas/` ánh xạ từ [[Database_Schema.dbml]]:
  - `farms`, `plots`, `seasons`, `farming_logs`
  - `categories`, `products`, `batches`, `waste_logs`
  - `users`, `refresh_tokens`, `user_addresses`, `orders`, `order_items`, `batch_allocations`
  - `subscription_plans`, `subscriptions`, `complaints`, `payments`
- Tạo custom SQL migration cài đặt Trigger `trg_immutable_farming_logs` chặn `UPDATE` và `DELETE`.
- Xây dựng Seeder 3 tiers tại `src/database/seeds/` với mật khẩu băm chuẩn `scrypt` cho các tài khoản mẫu.

### Bước 4: Thiết lập khung `src/common/` và Module khung

- Đặt các file tiện ích vào `src/common/`:
  - `filters/global-exception.filter.ts`: Chuẩn RFC 9457, xử lý mã lỗi `P0001` và `23503`.
  - `pipes/zod-validation.pipe.ts`: Parse DTO và trích xuất `invalidParams`.
  - `constants/messages.constant.ts`: Từ điển thông báo tiếng Việt tập trung.
  - `guards/jwt-auth.guard.ts` và `guards/roles.guard.ts`: Đăng ký `APP_GUARD` toàn cục.
- Cấu hình `main.ts`: Bật tiền tố `/api/v1`, tích hợp Scalar tại `/api/docs`, mở file spec tại `/openapi.json`.
- Khởi tạo thư mục khung cho 5 module: `auth`, `users`, `farms`, `catalog`, `inventory`.

---

## Tiêu Chí Kiểm Thử Chấp Nhận (Acceptance Criteria)

Tác vụ chỉ được tính là hoàn thành khi vượt qua toàn bộ 4 bước kiểm tra thực tế:

```bash
# 1. Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript
bun run check-types
# Yêu cầu: 0 lỗi biên dịch trên toàn bộ Monorepo

# 2. Kiểm tra sinh migration và áp dụng vào CSDL
cd apps/api && bun run db:generate && bun run db:migrate
# Yêu cầu: Tạo thành công 18 bảng và trigger trg_immutable_farming_logs trong PostgreSQL

# 3. Kiểm tra nạp dữ liệu mẫu 3 tiers
bun run db:seed --clean
# Yêu cầu: Khởi tạo thành công tài khoản SuperAdmin, Farm, Plot, Product, Batch mà không vi phạm khóa ngoại

# 4. Kiểm tra tài liệu API tương tác
bun run dev &
curl -I http://localhost:3001/api/docs
# Yêu cầu: HTTP Status 200 OK
curl -s http://localhost:3001/openapi.json | grep "openapi"
# Yêu cầu: Trả về JSON OpenAPI hợp lệ
```

---

## Related Notes

- Bản đồ điều phối dự án: [[000_GreenRoots_Farm_MOC]]
- Bản ghi quyết định hệ thống: [[System_Scope_and_Decision_Records]]
- Sơ đồ thực thể CSDL 18 bảng: [[Database_ERD_and_Data_Dictionary]]
- Hướng dẫn cấu trúc và setup: [[Architecture_TechStack_and_Setup_Guide]]
- Lộ trình khởi tạo chuẩn: [[Project_Initiation_and_Execution_Roadmap]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
