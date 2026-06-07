---
tags: [type/concept, topic/tech, monorepo, devops]
aliases: [Monorepo, Turbo]
---
# Turborepo và Kiến trúc Monorepo

## TL;DR
Turborepo là một công cụ xây dựng (build system) hiệu suất cao cho các dự án Monorepo sử dụng JavaScript/TypeScript. Nó giúp chia sẻ code cực dễ dàng qua cơ chế workspace, quản lý luồng phụ thuộc task (Dependency Graph), và tối ưu tốc độ build cực hạn thông qua Caching.

## Core Concept
- **Tại sao nó tồn tại?** Quản lý nhiều apps và packages trong cùng một repo sinh ra vấn đề thời gian build quá lâu và khó quản lý thứ tự build của các module phụ thuộc nhau.
- **Giải quyết bài toán gì?** Khắc phục vấn đề build lại những phần code không thay đổi (Caching) và thực thi script song song một cách thông minh dựa trên graph.
- **Nó có thay thế cái gì hay không?** Thay thế các công cụ chạy lệnh đồng thời đơn giản (như `concurrently`, `npm-run-all`) hay Lerna cũ kĩ.
- **Áp dụng dụng vào những dự án nào?** Hyundai B2B E-commerce.
- **Cơ chế hoạt động (How it works under the hood).**
  - **Dependency Graph**: Đọc `turbo.json` để biết thằng nào phụ thuộc thằng nào (ví dụ: build database xong mới build admin).
  - **Caching**: Tạo mã băm (hash) cho toàn bộ source code của từng package. Lần build sau nếu hash không đổi, nó bỏ qua build và lôi từ Cache ra luôn, giúp CI/CD giảm từ vài phút xuống vài giây.
  - **Code Sharing**: Kết hợp với tính năng `workspace:*` của trình quản lý package (Bun/npm/yarn), cho phép các app `import` chéo logic của nhau một cách Type-Safe 100%.

## Practical Implementation
- **Trade-offs**: Cấu hình ban đầu có thể phức tạp. Nếu cấu hình caching sai (`inputs`, `outputs`) có thể dẫn đến việc code cũ bị kẹt trong bộ nhớ đệm (stale cache).
- **Mẫu trả lời phỏng vấn (Flex)**: "Dự án của em có nhiều ứng dụng (Admin, Storefront) xài chung một Database schema và Types. Em dùng kiến trúc Monorepo với Turborepo để dễ dàng chia sẻ code qua protocol `workspace:*` giúp 100% Type-Safe ở mọi app. Điểm em thích nhất ở Turbo là khả năng định nghĩa Task Pipeline trong `turbo.json` giúp chạy các job song song theo đúng dependency graph, kết hợp với cơ chế Caching giúp bỏ qua việc build lại những package không bị thay đổi source code, từ đó tăng tốc độ CI/CD lên rất nhiều lần."

---
**Related Notes:**
- [[Route_Groups_SSR]]
- [[AST_ESLint]]
