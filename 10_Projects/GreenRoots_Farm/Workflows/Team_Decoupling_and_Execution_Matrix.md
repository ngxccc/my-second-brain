---
tags: [type/method, status/active]
date: 2026-11-14
description: "Ma trận phân công độc lập giữa Backend và Frontend theo nguyên tắc Contract-First cho GreenRoots Farm."
---

# Team Decoupling and Execution Matrix

## TL;DR

- **Bản chất**: Mô hình phân rã công việc bóc tách độc lập giữa tầng API và hai tầng giao diện Storefront/Backoffice.
- **Mục đích**: Triệt tiêu xung đột mã nguồn khi code song song và bảo đảm mỗi thành viên có PR/commit độc lập để chấm điểm.
- **Điểm mấu chốt**: Backend cam kết hợp đồng dữ liệu qua OpenAPI, Frontend chỉ lập trình giao diện dựa trên types đã sinh tự động.

---

## Cơ chế Phối hợp Contract-First

Để các thành viên chuyên biệt (chỉ làm Backend hoặc chỉ làm Frontend) phối hợp trơn tru mà không dẫm chân lên nhau:

- **Backend sở hữu Contract**: Mọi thay đổi về DTO, trường dữ liệu, validation đều được thực hiện tại `apps/api`.
- **Tự động sinh Types**: Lệnh `bun run types:sync` trích xuất OpenAPI schema và đồng bộ vào `types/api-schema.d.ts` của Storefront và Backoffice.
- **Frontend cấm định nghĩa trùng**: Thành viên Frontend tuyệt đối không tự tạo interface cục bộ; mọi biến thể dữ liệu phải nhập khẩu từ schema dùng chung.

---

## Ma trận Phân rã Trách nhiệm

| Area Label        | Workspace Đích    | Phạm vi Kỹ thuật                                         | Trách nhiệm Thành viên                                             |
| :---------------- | :---------------- | :------------------------------------------------------- | :----------------------------------------------------------------- |
| `area:api`        | `apps/api`        | Drizzle ORM, NestJS Service, DB Locks, Cron, OpenAPI     | Viết endpoint, xử lý transaction, test nghiệp vụ, commit types mới |
| `area:storefront` | `apps/storefront` | Next.js 16, Tailwind v4, Server Components, Mobile-first | Ráp UI khách hàng, tối ưu LCP, kết nối API qua types sinh sẵn      |
| `area:backoffice` | `apps/backoffice` | React 19, Vite, TanStack Router/Query, Recharts          | Ráp màn hình vận hành, quản trị lô hàng, xử lý form và bảng biểu   |
| `area:shared`     | `packages/shared` | Constants, Enums, Haversine, Error Dictionary            | Cung cấp hằng số và từ điển dùng chung cho cả monorepo             |

---

## Quy trình Độc lập Hóa và Giải phóng Blocker

Thứ tự thực thi ngăn ngừa tình trạng chờ đợi:

1. **Pha 1 (Backend Commit)**: Thành viên Backend hoàn thiện endpoint, chạy kiểm thử và chạy `bun run types:sync`, sau đó mở PR merge vào nhánh `main`.
2. **Pha 2 (Frontend Kéo Types)**: Thành viên Frontend kéo mã nguồn mới nhất từ `main`, bắt đầu triển khai giao diện theo đúng kiểu dữ liệu đã có sẵn.
3. **Phản hồi Thiếu Trường**: Nếu giao diện cần thêm trường dữ liệu, Frontend để lại yêu cầu trên GitHub Issue của Backend thay vì tự chế mock data.

---

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Quy chuẩn thiết lập dự án: [[Architecture_TechStack_and_Setup_Guide]]
- Quy trình khởi tạo: [[Project_Initiation_and_Execution_Roadmap]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
