---
tags: [type/concept, topic/tech, react, frontend]
date: 2026-04-28
aliases: [RSC]
---
# React Server Components (RSC)

## TL;DR

Cơ chế cho phép React components thực thi trực tiếp trên Server và chỉ gửi về trình duyệt một khối dữ liệu HTML tĩnh, loại bỏ hoàn toàn gánh nặng phải tải JavaScript để vẽ UI ở phía Client.

## Core Concept (Lý thuyết)

- **Vấn đề của CSR (Client-Side Rendering):** Trình duyệt phải tải một đống file JS cồng kềnh, sau đó tự chạy đống JS đó để fetch data và vẽ UI. Máy user yếu thì web lag.
- **Cơ chế RSC:** Component chạy xong xuôi trên server. Quá trình này truy vấn thẳng vào Database mà không cần gọi qua API. Kết quả được đóng gói thành một định dạng đặc biệt gọi là **RSC Payload**. Trình duyệt nhận cục này và hiển thị ngay lập tức.

## Practical Implementation (Thực chiến)

- **Bảo mật tuyệt đối:** Do code chạy trên server, em có thể import secret keys (`process.env.DB_PASS`) thẳng vào component mà không sợ bị lộ ra tab Network của trình duyệt.
- **Bundle Size:** Giảm đáng kể dung lượng JS tải về máy user, tối ưu Core Web Vitals (điểm SEO).

---
**Related Notes:**

- Khái niệm đối lập: [[Client_Side_Rendering_CSR]]
- Cách thay đổi dữ liệu khi dùng RSC: [[NextJS_Server_Actions]]
