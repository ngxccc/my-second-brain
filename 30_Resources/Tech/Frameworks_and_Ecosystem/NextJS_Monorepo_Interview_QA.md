---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba câu hỏi phỏng vấn về transpile package nội bộ trong monorepo Next.js kèm câu trả lời mẫu dạng nói."
---

# Phỏng vấn: Transpile Package Nội bộ trong Monorepo Next.js

## TL;DR

- **Bản chất**: Ba câu hỏi thường gặp về monorepo Next.js: vì sao cần `transpilePackages`, chọn JIT hay pre-build khi dự án lớn, Turbopack thay đổi điều gì.
- **Mục đích**: Luyện phản xạ trả lời trong 60-90 giây, nêu trade-off và số liệu thay vì đọc lại định nghĩa.
- **Điểm mấu chốt**: Câu ăn điểm là nêu đánh đổi DX lấy tốc độ CI/CD, và ràng buộc ESM/`exports` map khi chạy Turbopack.

## Rules: Khung trả lời ba bước

- **Bước 1 — nêu lỗi thật:** mô tả triệu chứng cụ thể (thông báo lỗi, thời điểm vỡ), không mô tả chung chung.
- **Bước 2 — nêu hai phương án:** JIT (`transpilePackages`) và AOT (pre-build), kèm ví dụ cấu hình ngắn.
- **Bước 3 — chốt bằng trade-off:** DX đổi lấy tốc độ CI/CD, và ràng buộc ESM khi chạy Turbopack.

## Q1: Vì sao cần `transpilePackages` trong Monorepo Next.js? Nếu không cấu hình thì bị lỗi gì?

- **Trả lời:** Theo mặc định, Next.js bỏ qua việc compile các tệp bên trong thư mục `node_modules` (và các package liên kết qua workspace symlinks) để tối ưu hiệu năng build. Nếu các package nội bộ này chứa mã nguồn TypeScript thô hoặc JSX chưa compile, Next.js sẽ ném ra lỗi cú pháp (`Module parse failed` hoặc `Unexpected token`) khi chạy dev/build do không hiểu được cú pháp TypeScript/JSX. Khai báo `transpilePackages` yêu cầu Next.js Compiler chạy SWC biên dịch trực tiếp các gói này cùng với dự án.

```typescript
// apps/storefront/next.config.ts
const nextConfig = {
  transpilePackages: ["@nhatnang/database", "@nhatnang/shared", "@nhatnang/ui"],
};
```

## Q2: So sánh hiệu năng build giữa `transpilePackages` và pre-build bằng `tsup`? Chọn giải pháp nào khi dự án phình to?

- **Trả lời:**
  - `transpilePackages` mang lại trải nghiệm dev rất tốt vì hỗ trợ HMR/Fast Refresh tức thì mà không cần chạy watcher phụ. Tuy nhiên, nó tăng tải cho compiler của Next.js khi phải phân tích cú pháp và biên dịch thêm nhiều file từ các package khác, đặc biệt là khi dùng với Turbopack trong Next.js 16.
  - Nếu dự án phình to với hàng chục package dùng chung, tôi sẽ chuyển sang phương pháp **Pre-building** dùng `tsup` hoặc `unbuild`. Tuy yêu cầu dev phải chạy thêm watcher (`turbo dev`), nó giải phóng Next.js khỏi việc compile mã nguồn của các package kia, cải thiện đáng kể tốc độ HMR và thời gian build trên CI/CD thông qua cơ chế lưu đệm (Caching) của Turborepo.

## Q3: Turbopack trong Next.js 16 ảnh hưởng thế nào đến việc xử lý các package nội bộ?

- **Trả lời:** Turbopack được tối ưu hóa bằng Rust và có cơ chế xử lý đồ thị phụ thuộc (dependency graph) cực kỳ nhanh. Khi kết hợp với `transpilePackages`, Turbopack biên dịch các gói nội bộ này nhanh hơn Webpack rất nhiều lần. Tuy nhiên, do là một trình đóng gói mới, Turbopack đòi hỏi cấu hình phân giải module (`moduleResolution: "bundler"`) và export maps trong các package nội bộ phải cực kỳ nghiêm ngặt và chuẩn ESM để tránh gặp lỗi resolving.

## Related Notes

- Cơ chế và đánh đổi giữa hai giải pháp: [[NextJS_Monorepo_Package_Transpilation]]
- Bản mẫu cấu hình cụ thể: [[NextJS_Monorepo_Transpile_Config]]
- [[000_Tech_MOC]]
