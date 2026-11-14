---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Cơ chế biên dịch gói nội bộ (transpilePackages) và tối ưu hóa build trong Turborepo."
---

# Next.js Monorepo & Package Transpilation

## TL;DR

- **Bản chất**: Next.js bỏ qua `node_modules` khi build, nên package nội bộ ship TypeScript/JSX chưa compile sẽ làm vỡ build.
- **Mục đích**: `transpilePackages` buộc SWC/Turbopack biên dịch các package đó, cho phép import source trực tiếp trong monorepo.
- **Điểm mấu chốt**: Đánh đổi là thời gian build tăng; phương án còn lại là pre-build package, nhanh hơn nhưng thêm bước và dễ lệch version.

---

## Core Concept

### 1. Tại sao xảy ra lỗi Biên dịch khi Import gói nội bộ?

- **Cơ chế mặc định:** Trình đóng gói (bundler) của Next.js bỏ qua toàn bộ thư mục `node_modules` trong quá trình biên dịch vì giả định các thư viện bên thứ ba đã được xuất bản (publish) dưới dạng mã JavaScript tương thích cao (ES5/ES6 tiêu chuẩn).
- **Vấn đề trong Monorepo:** Các gói nội bộ dùng chung (internal packages) thường được liên kết qua cơ chế workspace (`"dependency": "workspace:*"`). Khi chạy, trình quản lý gói sẽ tạo các liên kết tượng trưng (symlinks) trỏ đến mã nguồn chưa biên dịch (raw TypeScript/JSX).
- **Kết quả:** Next.js coi các symlinks này như `node_modules` thông thường và bỏ qua chúng, dẫn đến lỗi cú pháp nghiêm trọng khi chạy ứng dụng:

```text
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type.
```

### 2. Giải pháp JIT: `transpilePackages` là gì?

Cấu hình `transpilePackages` (thay thế cho thư viện cũ `next-transpile-modules` từ Next.js v13) là một mảng khai báo các gói cục bộ hoặc bên thứ ba mà Next.js cần biên dịch trực tiếp bằng SWC/Turbopack cùng với mã nguồn của ứng dụng chính.

- Khi ứng dụng build hoặc dev, trình biên dịch sẽ quét qua mã nguồn của các gói này, áp dụng các thiết lập transpile (như loại bỏ kiểu dữ liệu TypeScript, biên dịch JSX sang JS).

### 3. Giải pháp AOT: Pre-building

Thay vì bắt Next.js gánh toàn bộ trách nhiệm biên dịch mã nguồn của các gói khác tại runtime, ta có thể xây dựng quy trình biên dịch trước (Pre-build/Ahead-Of-Time) cho từng package:

- Sử dụng các công cụ biên dịch siêu tốc như **`tsup`** (dựa trên esbuild) để đóng gói mã nguồn của package thành định dạng JavaScript chuẩn (ESM/CJS) và tạo file khai báo kiểu `.d.ts`.
- Cấu hình trường `exports` trong `package.json` của package để trỏ trực tiếp đến các file build đã xuất ra trong thư mục `dist/` thay vì mã nguồn gốc.

### 4. So sánh hai giải pháp

| Tiêu chí                 | On-the-fly (`transpilePackages`)                                                                                                                                  | Pre-building (`tsup` + `exports`)                                                                                                    |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Trải nghiệm Dev (DX)** | **Cực tốt:** Sửa code ở package nội bộ sẽ kích hoạt Next.js Hot Module Replacement (HMR) / Fast Refresh ngay lập tức mà không cần chạy watcher ngầm.              | **Kém hơn:** Cần chạy watcher ngầm (`tsup --watch` hoặc `turbo dev`) để biên dịch lại file khi có thay đổi.                          |
| **Hiệu năng Compile**    | **Chậm dần khi quy mô tăng:** SWC/Turbopack phải gánh thêm phân tích cú pháp cho hàng ngàn file từ package, làm tăng thời gian cold-start và compile của Next.js. | **Rất nhanh:** Next.js chỉ việc đọc mã JS đã biên dịch sẵn trong `dist/`. Tối ưu hóa cực lớn cho CI/CD nhờ Turborepo Remote Caching. |
| **Độ phức tạp cấu hình** | **Thấp:** Chỉ cần thêm một dòng khai báo tên package vào `next.config.ts`.                                                                                        | **Trung bình-Cao:** Phải cấu hình build toolchain (`tsup.config.ts`), exports map, và script build trong từng package.               |
| **Độ độc lập**           | **Thấp:** Package bị phụ thuộc vào compiler của ứng dụng tiêu thụ (chỉ dùng được với Next.js).                                                                    | **Cao:** Package có thể được tiêu thụ bởi bất kỳ framework nào khác (Vite, Express, Node.js).                                        |

---

## Related Notes

- Bản mẫu cấu hình cụ thể cho từng phương án: [[NextJS_Monorepo_Transpile_Config]]
- Câu hỏi phỏng vấn và câu trả lời mẫu về chủ đề này: [[NextJS_Monorepo_Interview_QA]]
- [[000_Tech_MOC]]
- So sánh Monorepo vs Multi-repo: [[Unified_Fullstack_vs_Split_Architecture]]
- Công cụ build Monorepo: [[Turborepo]]
- Thuật toán loại bỏ code chết phía sau các bước build này: [[Tree_Shaking]]
