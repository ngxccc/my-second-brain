---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba câu hỏi phỏng vấn về Route Groups và Nested Layouts: vì sao không hiện trên URL, Partial Rendering, và lỗi DYNAMIC_SERVER_USAGE."
---

# Phỏng vấn: Route Groups và Nested Layouts

## TL;DR

- **Bản chất**: Ba câu hỏi hay gặp: Route Group là gì, layout có bị re-mount khi chuyển trang không, và cách xử lý `DYNAMIC_SERVER_USAGE`.
- **Mục đích**: Trả lời bằng cơ chế (Router Tree, Partial Rendering, request context ở runtime) thay vì mô tả tính năng.
- **Điểm mấu chốt**: Câu trả lời ăn điểm là nêu hệ quả build: một hàm dynamic đặt sai tầng làm hỏng SSG của cả site.

## Core Concept: Ba mốc để trả lời

- **Định tuyến**: tên trong `(ngoặc đơn)` bị bỏ qua khi sinh URL segment.
- **Render**: Next.js dùng Partial Rendering — chỉ `page.tsx` đổi, layout giữ nguyên DOM và state.
- **Build**: `cookies()`/`headers()` cần request context, phải nằm trong sub-layout chứ không phải root layout.

```text
app/(shop)/checkout/page.tsx  ->  /checkout
```

## Q1: Bản chất của Route Groups là gì và vì sao nó không hiển thị trên URL?

- **Trả lời:** Route Groups dùng quy ước đặt tên thư mục trong ngoặc đơn `(tên_group)`. Trình biên dịch Next.js bỏ qua tên thư mục này khi phân tích cây định tuyến (Router Tree) để ánh xạ thành URL. Mục đích duy nhất là gom nhóm file mã nguồn để chia sẻ Layout (hoặc middleware cục bộ) mà không làm xáo trộn cấu trúc URL.

## Q2: Nested Layouts hoạt động thế nào khi chuyển trang? Layout có bị re-mount không?

- **Trả lời:** Next.js dùng **Partial Rendering**. Khi chuyển giữa hai trang cùng cấp trong một Route Group (ví dụ `/portal/debt` sang `/portal/profile`), Next.js chỉ render lại `page.tsx` tương ứng; `layout.tsx` của `(portal)` được giữ lại, DOM không bị tạo lại (no re-mount) và React State bên trong layout được bảo toàn.

## Q3: Làm sao giải quyết lỗi `DYNAMIC_SERVER_USAGE` trên Vercel khi dùng `cookies()` hoặc `headers()` ở layout?

- **Trả lời:** Nguyên nhân là Next.js cố tối ưu tĩnh toàn ứng dụng lúc build, còn các hàm dynamic cần request context thực tế ở runtime. Cách giải quyết là dùng **Route Groups** để cô lập logic động vào một sub-layout riêng cho khu vực cần bảo mật (ví dụ bọc toàn bộ dashboard vào nhóm `(dashboard)`). Root Layout bên ngoài giữ hoàn toàn tĩnh (chỉ chứa Providers), nhờ đó Next.js build thành công các trang tĩnh độc lập.

## Related Notes

- Cơ chế Route Groups, kế thừa layout và cấu trúc thư mục dự án: [[NextJS_Route_Groups_and_Nested_Layouts]]
- Cơ chế Dynamic Opt-out: [[NextJS_Dynamic_Opt_Out_Connection]]
- [[000_Tech_MOC]]
