---
tags: [type/concept, status/permanent]
date: 2026-06-12
description: "Cơ chế và cách thức các Cloud Platform hỗ trợ triển khai Partial Prerendering."
---

# NextJS PPR Platform Support

## TL;DR

- **Bản chất**: PPR gửi static HTML shell lúc build và stream phần dynamic lúc request, qua `PostponedState` và Resume Protocol.
- **Mục đích**: Một route vừa có TTFB của static vừa có dữ liệu theo request.
- **Điểm mấu chốt**: Platform phải lưu shell và `postponedState` như một cặp nguyên tử, và phải coi `postponedState` là dữ liệu opaque - không tự parse hay sửa.

## Core Concept

- **Thành phần tạo ra lúc Build-time**:
  - **Static HTML Shell**: Giao diện tĩnh của trang chứa các phần fallback Suspense tại vị trí nội dung động.
  - **PostponedState**: Chuỗi serialized biểu diễn trạng thái render bị hoãn lại của React. Cần lưu trữ và xử lý dạng dữ liệu thô (opaque data), không tự ý phân tích hoặc sửa đổi.
  - **RSC Payload**: Dữ liệu React Server Components của phần tĩnh.
- **Quy trình hoạt động lúc Request-time**:
  1. Platform/Server trả ngay static HTML shell về cho client (giúp giảm TTFB tối đa).
  2. Server khôi phục trạng thái render động bằng `postponedState`.
  3. Phần HTML động được sinh ra và stream tiếp về client để React tiến hành hydrate.
- **Nguyên tắc lưu trữ (Storage Atomicity)**:
  - Shell tĩnh và `postponedState` có tính liên kết chặt chẽ. Khi Route được revalidate (qua ISR hoặc On-demand), cả hai tệp này phải được cập nhật đồng thời (atomically). Sử dụng callback `onCacheEntryV2` trong adapter để bắt các cập nhật này.
- **Các cấp độ triển khai trên Platform**:
  - **Origin-Only**: Phù hợp cho mọi nền tảng hỗ trợ HTTP streaming. Toàn bộ quá trình từ đọc cache shell đến render động đều diễn ra trực tiếp trên Next.js origin server (giống hành vi của `next start`).
  - **CDN Shell + Origin Compute**: Tối ưu hóa TTFB ở CDN Edge. CDN trả ngay shell tĩnh từ cache của edge, đồng thời gửi request song song tới Origin server để thực hiện render động bằng Resume Protocol, sau đó ghép nối hai luồng dữ liệu này trả về cho client.

## Practical Implementation

- **Giao thức Resume (Resume Protocol)**:
  Khi sử dụng mô hình CDN-to-origin, CDN kích hoạt việc render động tại Origin thông qua request HTTP POST:

  ```http
  POST /path-to-route HTTP/1.1
  Host: origin.platform.com
  next-resume: 1
  Content-Type: text/plain

  <postponedState_content_here>
  ```

  _Lưu ý:_ Nếu request POST kết hợp cả Server Action, header `x-next-resume-state-length` sẽ chứa độ dài byte của phần `postponedState` nằm ở đầu request body để server tách biệt với phần body của action.

- **Cấu hình Adapter (Adapter-based)**:
  Nếu platform gọi trực tiếp handler function:
  ```javascript
  // Ví dụ cấu hình gọi handler trong adapter
  await handler(req, res, {
    postponed: postponedState, // Bỏ qua tầng HTTP để truyền trực tiếp trạng thái postponed
  });
  ```
- **Graceful Degradation**:
  Trường hợp không có hoặc `postponedState` bị lỗi/lạc hậu, server phải tự động hạ cấp về hành vi render động toàn trang (Full Server Render) để đảm bảo trang web hoạt động bình thường.

---

**Related Notes:**

- [[React_Server_Components]]
- [[NextJS_Server_Actions]]
- [[000_Tech_MOC]]
