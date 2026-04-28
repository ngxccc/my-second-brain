---
tags: [type/concept, topic/tech, nextjs, backend]
date: 2026-04-28
aliases: [Server Actions]
---
# Next.js Server Actions

## TL;DR

Tính năng cho phép định nghĩa các hàm `async` chạy trên Server nhưng có thể được kích hoạt (trigger) trực tiếp từ các tương tác ở Client (như submit Form hoặc bấm nút), thay thế hoàn toàn việc phải viết REST API thủ công.

## Core Concept (Lý thuyết)

- **Sự chuyển dịch (Paradigm Shift):** Trước đây, để sửa user name, em phải: Viết 1 router Express (Backend) $\rightarrow$ Viết 1 hàm `fetch/axios` (Frontend) $\rightarrow$ Bấm nút gọi API. Với Server Actions, em chỉ cần viết 1 hàm đánh dấu `"use server"` và ném nó vào sự kiện `action` của `<form>`.
- **Under the hood:** Dưới nền tảng, Next.js tự động tạo ra một HTTP endpoint ẩn (RPC - Remote Procedure Call) để hai bên giao tiếp mượt mà.

## Practical Implementation (Thực chiến)

- **Progressive Enhancement:** Tính năng cực hay. Nếu user bị rớt mạng hoặc trình duyệt tắt JavaScript, form sử dụng Server Actions vẫn có thể submit dữ liệu thành công lên server (giống hệt cách web thời PHP cổ đại hoạt động).
- **Kết hợp hoàn hảo:** Thường đi kèm với `useFormState` hoặc `useFormStatus` để xử lý loading state, và kết hợp với thư viện xác thực như Zod để validate dữ liệu đầu vào.

---
**Related Notes:**

- Môi trường hiển thị dữ liệu: [[React_Server_Components]]
- So sánh kiến trúc: [[REST_API_Design]]
