---
tags: [type/concept, topic/tech, nextjs, ssr, vercel]
aliases: [Route Groups, Next.js DYNAMIC_SERVER_USAGE]
---
# Next.js Route Groups và SSR Vercel

## TL;DR
Route Groups trong Next.js (thư mục có dấu ngoặc đơn `()`) giúp áp dụng một layout cụ thể cho một nhóm trang mà không làm thay đổi URL. Kết hợp với việc cô lập các hàm động (như `headers()`, `cookies()`), ta có thể giữ cho các trang public là Static HTML siêu nhanh và chặn đứng lỗi `DYNAMIC_SERVER_USAGE` trên Vercel.

## Core Concept
- **Tại sao nó tồn tại?** Next.js mặc định áp dụng layout từ trên xuống. Nếu Root Layout có hàm check Auth (làm cho trang bị Dynamic), thì toàn bộ app sẽ bị biến thành Dynamic, làm mất đi khả năng Static Site Generation (SSG).
- **Giải quyết bài toán gì?** Giải quyết mâu thuẫn giữa việc muốn bảo vệ một số trang (Admin) cần SSR nhưng vẫn muốn giữ các trang Public (Login, Not Found) là SSG tĩnh.
- **Nó có thay thế cái gì hay không?** Thay thế việc tạo các file layout phức tạp chèn ép bằng điều kiện if/else, hay chia app ra thành các sub-domains khác nhau.
- **Áp dụng dụng vào những dự án nào?** Hyundai B2B E-commerce.
- **Cơ chế hoạt động (How it works under the hood).** 
  - Đưa phần logic check session vào `app/[locale]/(dashboard)/layout.tsx` và đánh dấu `export const dynamic = "force-dynamic"`.
  - Để `app/[locale]/layout.tsx` hoàn toàn tĩnh (chỉ chứa HTML, Body và Providers).
  - Vercel lúc build sẽ an tâm pre-render các trang nằm ngoài Route Group thành tĩnh, còn các trang nằm trong Route Group sẽ được bọc bởi Serverless Functions.

## Practical Implementation
- **Trade-offs**: Làm cho cấu trúc thư mục sâu hơn và URL path không còn khớp 1:1 với cấu trúc thư mục vật lý.
- **Mẫu trả lời phỏng vấn (Flex)**: "Trong dự án Hyundai B2B, em gặp bài toán là hàm check Authentication ở Root Layout làm mất khả năng SSG của Next.js và gây crash `DYNAMIC_SERVER_USAGE` trên Vercel do xung đột môi trường Serverless. Em đã áp dụng Route Groups để cô lập hoàn toàn logic SSR và Sidebar vào một sub-layout riêng được đánh dấu `force-dynamic`, trả lại trạng thái Static HTML siêu nhẹ cho các route public bên ngoài."

---
**Related Notes:**
- [[Turborepo]]
