---
tags: [type/concept, status/permanent]
date: 2026-06-24
description: "So sánh NestJS, Express, Fastify và ElysiaJS về triết lý thiết kế, hiệu năng và trường hợp sử dụng phù hợp tính đến 06/2026."
---

# JS/TS Backend Frameworks Comparison

## TL;DR

- **Bản chất**: Bốn framework backend JS/TS được chấm trên cùng một thang: triết lý thiết kế, hiệu năng, độ trưởng thành và tương thích runtime.
- **Mục đích**: Chọn framework theo throughput, DX, độ trưởng thành hệ sinh thái và độ tương thích Bun/Node thay vì theo cảm tính.
- **Điểm mấu chốt**: NestJS đổi lấy cấu trúc chặt và DI; Express và Elysia đổi lấy độ mỏng và tốc độ. Lựa chọn phụ thuộc quy mô đội và ràng buộc runtime, không có đáp án chung.

---

## Core Concept

### 1. Bản Đồ Tổng Quan Các Framework

- **NestJS (v11.1.27):** framework hướng đối tượng, có cấu trúc chặt chẽ (opinionated), kế thừa triết lý Dependency Injection của Angular; hợp với dự án doanh nghiệp lớn cần tính bảo trì cao.
- **Express (v5.2.1):** bản Express 5 stable đã thay Express 4 làm mặc định trên npm; giữ tính tối giản và hệ sinh thái middleware khổng lồ, bổ sung xử lý Promise bất đồng bộ tự động.
- **Fastify (v5.8.5):** tối ưu hiệu năng trên Node.js, dùng hệ thống plugin độc lập (`avvio`) và biên dịch JSON Schema (`ajv`) thành hàm JavaScript.
- **ElysiaJS (v1.4.29):** thiết kế tối ưu riêng cho Bun runtime, nổi tiếng với tốc độ Bun-native, suy luận kiểu hai đầu (End-to-End Type Safety qua Eden) và kiến trúc BETH Stack.

### 2. Ma Trận So Sánh Chi Tiết

| Tiêu chí              | NestJS (v11)                          | Express (v5)               | Fastify (v5)              | ElysiaJS (v1.4)              |
| :-------------------- | :------------------------------------ | :------------------------- | :------------------------ | :--------------------------- |
| **Triết lý thiết kế** | Opinionated (OOP, DI)                 | Unopinionated (Middleware) | Plugin-encapsulated       | Bun-native, Type-safe        |
| **Hiệu năng (RPS)**   | Khá tốt (ảnh hưởng bởi DI/Reflection) | Trung bình (Baseline)      | Rất cao (~2-3x Express)   | ~6-8x Express                |
| **Kiểu biên dịch**    | JIT/AOT Metadata                      | JIT JS                     | Compile JSON Schemas      | Static code analysis         |
| **TypeScript DX**     | Tuyệt vời (Decorator)                 | Trung bình (thêm `@types`) | Tốt                       | Xuất sắc (Inference gốc)     |
| **Độ trưởng thành**   | Rất cao (~76k Stars)                  | Tuyệt đối (~69.2k Stars)   | Cao (OpenJS Foundation)   | Trung bình (đang phát triển) |
| **Múi giờ & Date**    | Temporal API + Pipes                  | Phụ thuộc thư viện ngoài   | Phụ thuộc thư viện ngoài  | Tích hợp Standard Schema     |
| **Tương thích Bun**   | Tốt (~95% Node APIs)                  | 100%                       | 100% (Node emulation)     | 100% Native                  |
| **Tương thích Node**  | 100%                                  | 100%                       | 100%                      | Cần Node Adapter (chậm hơn)  |
| **Learning Curve**    | Dốc (DI, Module)                      | Dễ nhất                    | Trung bình (Plugin Scope) | Dễ (Ergonomic)               |

```typescript
// Khác biệt DX nằm ở cách khai báo route
// NestJS: @Controller("users") class + @Post() method, dựa vào decorator + DI
// ElysiaJS: new Elysia().post("/users", handler, { body: t.Object({...}) }), type suy ra từ schema
```

### 3. Định Hướng Lựa Chọn

- **Chọn NestJS khi:** dự án doanh nghiệp lớn (Monolith/Microservices) cần cấu trúc chuẩn chỉnh và mở rộng lâu dài; đội đông người (opinionated structure giảm xung đột style); hệ thống chạy hoàn toàn trên Node.js hoặc cần tối ưu cold start trên Bun Serverless.
- **Chọn Express khi:** bảo trì dự án legacy đã chạy lâu năm; làm MVP nhỏ nhanh, không cần tối ưu chịu tải lớn; cần tận dụng lượng middleware tích lũy hơn 10 năm.
- **Chọn Fastify khi:** cần REST API/Microservices hiệu năng cao trên hạ tầng Node.js truyền thống; cần Schema Validation chặt và an toàn bảo mật; đội thích module khép kín (encapsulated plugins).
- **Chọn ElysiaJS khi:** dùng **Bun Runtime** làm nền tảng ngay từ đầu; cần full-stack TypeScript nối chặt Front-end (Next.js/React) với Back-end qua Eden; dự án real-time cần WebSocket hiệu năng cao nhờ µWebSockets.

## Related Notes

- Mã nguồn route + validation của cả bốn framework: [[Backend_Framework_Code_Samples]]
- [[000_Tech_MOC]]
- [[JS_Runtimes_Bun_vs_NodeJS]]: Vì sao ElysiaJS chỉ đạt hiệu năng tối đa trên Bun.
- [[TS_Decorators]]: Cơ chế đứng sau phong cách khai báo của NestJS.
- [[JS_Temporal_API]]: Chuẩn xử lý thời gian dùng trong bảng so sánh.
