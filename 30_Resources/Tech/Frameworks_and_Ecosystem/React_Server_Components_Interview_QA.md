---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Bộ câu hỏi phỏng vấn về React Server Components kèm câu trả lời mẫu dạng nói, tập trung vào Pre-render, Hydration và lỗi serialize."
---

# Phỏng vấn: React Server Components

## TL;DR

- **Bản chất**: Ba câu hỏi hay gặp về RSC: Client Component có chạy trên server không, vì sao không lạm dụng `'use client'`, và cách xử lý lỗi serialize `Date`.
- **Mục đích**: Luyện câu trả lời ngắn có mốc kỹ thuật (Pre-render, Hydration, bundle size, TTFB) thay vì định nghĩa suông.
- **Điểm mấu chốt**: Quy tắc vàng là để Server Component làm mặc định và chỉ chuyển sang Client ở tầng lá chứa tương tác trực tiếp.

## Core Concept: Khung trả lời và mốc kỹ thuật

- **Nói bằng mốc kỹ thuật, không nói bằng định nghĩa**: Pre-render, Hydration, bundle size, TTFB là bốn mốc để câu trả lời có trọng lượng.
- **Luôn chốt bằng quy tắc hành động**: Server Component là mặc định, Client Component chỉ ở tầng lá.
- **Nêu cả cái giá**: RSC không miễn phí — nó thêm ràng buộc serialize và một ranh giới dễ vô tình mở rộng.

```typescript
// Chốt lỗi serialize bằng một dòng: đổi Date thành ISO trước khi qua ranh giới
props = { createdAt: order.createdAt.toISOString() };
```

## Q1: Có phải Client Component chỉ được chạy trên trình duyệt không?

- **Trả lời:** Không. Đây là hiểu lầm phổ biến. Client Component trong Next.js App Router vẫn chạy trên Server ở lần tải trang đầu tiên (Pre-rendering) để tạo HTML tĩnh gửi về trình duyệt. Sau đó file JavaScript của component mới được tải về client để thực hiện **Hydration** (ghép nối event listener và kích hoạt React state). Chỉ code bên trong `useEffect` hoặc các đoạn kiểm tra `typeof window !== 'undefined'` mới thực sự chỉ chạy trên Client.

## Q2: Tại sao không nên dùng `'use client'` cho mọi Component để code cho tiện?

- **Trả lời:** Lạm dụng `'use client'` sẽ làm mất toàn bộ lợi thế của App Router:
  1. **Bundle Size tăng vọt:** mọi thư viện thêm vào (như Drizzle ORM, Zod, date-fns) trong Client Component đều bị đóng gói gửi về trình duyệt.
  2. **Tốc độ tải trang chậm hơn:** Server không thể tối ưu render tĩnh hoặc stream nội dung tốt, làm tăng TTFB.
  3. **Lộ thông tin bảo mật:** API key hoặc biến môi trường bí mật có nguy cơ lộ ra client.
- _Quy tắc vàng:_ luôn để component là Server Component mặc định, chỉ chuyển sang Client Component ở các tầng lá (Leaf Components) chứa tương tác trực tiếp của người dùng.

## Q3: Làm sao giải quyết lỗi "Cannot serialize Date object" khi truyền dữ liệu từ Server sang Client?

- **Trả lời:** Ba cách phổ biến:
  1. Chuyển `Date` thành string ISO hoặc timestamp số nguyên trên Server trước khi truyền làm prop: `createdAt: order.createdAt.toISOString()`.
  2. Dùng tầng Data Transfer Object (DTO) để lọc và chuẩn hóa dữ liệu trước khi chuyển giao.
  3. Dùng thư viện hỗ trợ truyền tải nâng cao (như Superjson) nếu framework đã cấu hình, nhưng chuyển đổi kiểu dữ liệu thủ công vẫn tường minh và tối ưu nhất.

## Related Notes

- Ranh giới, quy tắc serialize và streaming: [[React_Server_Components]]
- Ví dụ dựng form qua ranh giới: [[React_Server_Client_Boundary_Examples]]
- [[000_Tech_MOC]]
