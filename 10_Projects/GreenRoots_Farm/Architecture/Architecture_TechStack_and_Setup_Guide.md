---
tags: [type/project, status/active]
date: 2026-11-12
description: "Tài liệu tập trung quy chuẩn cấu trúc Monorepo, phiên bản công nghệ và trình tự khởi tạo cho dự án GreenRoots Farm."
---

# Architecture TechStack and Setup Guide

## TL;DR

- **Bản chất**: Nguồn chân lý kỹ thuật đồng bộ phiên bản package, thư mục mã nguồn và cấu hình hạ tầng từ chuẩn `open-genset`.
- **Mục đích**: Giúp cả nhóm cài đặt thống nhất ngay từ ngày đầu, tránh lệch phiên bản thư viện hoặc rối cấu hình Workspace.
- **Điểm mấu chốt**: Dùng Bun Workspaces làm trình quản lý gói và khởi chạy từng lớp theo trình tự Hạ tầng, Backend, rồi đến Frontend.

---

## 1. Cấu Trúc Thư Mục Monorepo (`greenroots-farm`)

Áp dụng mô hình Hybrid Monorepo của `open-genset` kết hợp phân tách rõ Storefront và Backoffice:

```text
greenroots-farm/
├── apps/
│   ├── api/                 # NestJS 12 + Drizzle ORM + BullMQ + Cron
│   ├── storefront/          # Next.js 16 (App Router) + Tailwind 4
│   └── backoffice/          # React 19 + Vite SPA + TanStack Suite
├── packages/
│   ├── shared/              # @greenroots/shared: Enums, Constants, Haversine, Shared Labels
│   └── ui/                  # @greenroots/ui: Shadcn Base UI + Organic Minimalism Tokens
├── docker-compose.yml       # PostgreSQL 18 + Redis 8
├── package.json             # Bun Workspaces root scripts
├── .node-version            # v26
├── .oxlintrc.json           # Linter tốc độ cao (oxlint)
├── .oxfmtrc.json            # Formatter đồng bộ (oxfmt)
└── .syncpackrc              # Khóa đồng nhất phiên bản dependency
```

---

## 2. Bảng Phiên Bản Công Nghệ Chuẩn (SSOT)

Toàn bộ nhóm khóa chặt phiên bản lõi tham chiếu trực tiếp từ `open-genset`:

| Thành phần          | Gói / Công nghệ                                                                    | Phiên bản chuẩn                             | Ghi chú áp dụng                                                                                                         |
| :------------------ | :--------------------------------------------------------------------------------- | :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| Runtime & PM        | `bun` / Node                                                                       | `bun@1.4` / `v26`                           | Quản lý Monorepo workspaces                                                                                             |
| Language & Lint     | `typescript`, `oxlint`, `oxfmt`                                                    | `^6`, `1.92.0`, `0.77.0`                    | Kèm `husky ^9.1.7` + `syncpack`                                                                                         |
| Backend Core & Auth | `@nestjs/core`, `node:crypto` (`scrypt` + `sha256`)                                | `^12.0.3`, Node/Bun Native                  | Chạy trên Bun/Node, hash mật khẩu `scrypt` chuẩn OWASP (`N=16384, r=8, p=5`) kèm version tag `s1$`, token hash `sha256` |
| Database & ORM      | `postgres:18-alpine`, `drizzle-orm`                                                | `18`, `^1.0.0-rc.5-169397b`                 | Kèm `pg ^8.23.0`, `drizzle-kit ^1.0.0-rc.5-ab785fc`                                                                     |
| Queue & Cache       | `redis:8-alpine`, `bullmq`, `ioredis`                                              | `8`, `^6.3.8`, `^6.0.0`                     | `noeviction` cho BullMQ, TTL cho cache                                                                                  |
| Validation & API    | `zod`, `nestjs-zod`, `openapi-typescript`                                          | `^4.6.5`, `5.5.0`, `^7.13.0`                | Sinh type tự động sang FE                                                                                               |
| Payment & Mail      | `@payos/node`, `resend`                                                            | `^2.0.5`, `^6.28.1`                         | Bọc trong Adapter Pattern                                                                                               |
| Storefront FE       | `next`, `react`, `tailwindcss`                                                     | `^16.4.5`, `^19.3.0`, `^4.3.1`              | Kèm `zustand ^5.0.15`, `openapi-fetch`                                                                                  |
| Backoffice FE       | `vite`, `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-table` | `^8.3.8`, `^1.170.46`, `^5.107.1`, `^9.3.1` | React 19.3 + TanStack Suite + Recharts                                                                                  |
| UI & Form Chung     | `@base-ui/react`, `lucide-react`, `react-hook-form`                                | `^1.9.0`, `^1.47.0`, `^7.88.0`              | `shadcn/ui` Base UI mặc định (không dùng Radix)                                                                         |

---

## 3. Lưu Ý Khác Biệt Giữa `open-genset` và `GreenRoots Farm`

Cần giữ nguyên 4 điểm điều chỉnh sau để đúng đặc tả đồ án:

- **Ứng dụng nội bộ (`apps/backoffice`)**: `open-genset` dùng Next.js cho `admin`, nhưng GreenRoots dùng **React + Vite SPA + TanStack** để tách biệt hoàn toàn JS bundle nội bộ và tối ưu thao tác bảng điều phối FEFO.
- **Hệ thống UI (`shadcn/ui` Base UI)**: Dùng `@base-ui/react` (mặc định mới của `shadcn/ui`) thay cho `radix-ui` của `open-genset` để tận dụng `Combobox` gốc và kiến trúc gọn hơn; chạy `shadcn add` thay vì copy-paste file từ `open-genset`.
- **Cấu hình Redis cho BullMQ**: Đổi `maxmemory-policy` từ `allkeys-lru` sang **`noeviction`** trong `docker-compose.yml` để tránh Redis tự xóa delayed job hủy đơn 15 phút; mọi cache key ứng dụng phải đặt TTL tường minh.
- **Biến môi trường & Git Hygiene**: Tách `.env` riêng cho từng app (`apps/api/.env.example` + `apps/api/doppler.yaml`), hỗ trợ song song `.env` và `doppler:*` (không dùng `--preserve-env="true"`); luôn giữ `.omp/`, `.engineered-config.json`, `.env*` trong `.gitignore` (trừ `!.env.example`).
- **Chuẩn Mật mã học (Auth Crypto)**: Tuyệt đối không dùng API độc quyền `Bun.password` để tránh vendor lock-in; sử dụng `node:crypto` (`scrypt` + `timingSafeEqual`) cho mật khẩu và `sha256` cho token.
- **Package dùng chung & Thông báo API**: `@greenroots/shared` dùng `module: "ESNext"` + `moduleResolution: "bundler"` (import không đuôi `.js`) để tương thích đồng thời Next.js 16 Turbopack, Vite, Bun và `tsc -p tsconfig.build.json`; còn `@greenroots/ui` gom toàn bộ Shadcn Base UI primitives (`cn` package) + Tailwind v4 tokens dùng chung cho cả Storefront và Backoffice thông qua `catalog:` ở `package.json` gốc.

---

## 4. Trình Tự Khởi Tạo 4 Bước (Chống Ngợp)

Thực hiện tuần tự từng lớp, kiểm tra chạy xanh mới sang bước kế tiếp:

1. **Bước 1 — Khung Repo & Hạ tầng (30 phút)**: Tạo `.gitignore`, `docker-compose.yml` (`postgres:18-alpine`, `redis:8-alpine`), root `package.json`, cấu hình `oxlint`/`oxfmt`/`syncpack`, khởi tạo `packages/shared` chứa các Enum cốt lõi.
2. **Bước 2 — Xương sống API & Dữ liệu (`apps/api`)**: Cài NestJS 12, nối PostgreSQL + Redis, chuyển 18 bảng từ `Database_Schema.dbml` sang Drizzle schema, gắn SQL Trigger bất biến `farming_logs`, chạy `seed.ts` và bật Swagger `/docs`.
3. **Bước 3 — Hạ tầng UI & Walking Skeleton (`packages/ui` + `apps/storefront`)**: Dựng `@greenroots/ui` (Shadcn Base UI + 3-color Organic tokens), khởi tạo `apps/storefront` (Next.js 16 + Cache Components + Partial Prefetching + `openapi-fetch` + Zustand cart), đồng bộ nhãn dùng chung/từ điển lỗi qua `@greenroots/shared`, hoàn thiện trang chủ `SF-01` và trang quét QR `SF-03` `/trace/:batchCode`.
4. **Bước 4 — Không gian Nội bộ (`apps/backoffice`)**: Dựng Vite + React 19 + TanStack Router/Query/Table nối tới cùng `packages/shared` và `openapi-fetch`, mở khóa cho các thành viên chia nhánh song song.

---

## Related Notes

- Bản đồ điều phối dự án: [[000_GreenRoots_Farm_MOC]]
- Quyết định kiến trúc cốt lõi: [[System_Scope_and_Decision_Records]]
- Lộ trình triển khai Agile: [[Project_Initiation_and_Execution_Roadmap]]
- Đặc tả lược đồ CSDL 18 bảng: [[Database_ERD_and_Data_Dictionary]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
