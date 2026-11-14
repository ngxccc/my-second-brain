---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Câu hỏi phỏng vấn về hai thế hệ TypeScript Decorator và lựa chọn trong NestJS."
---

# Phỏng vấn: TypeScript Decorators

## TL;DR

- **Bản chất**: Một câu hỏi phỏng vấn trọng tâm: khác biệt giữa Decorator mặc định TS 5.0+ và Decorator cũ (experimentalDecorators), và chọn loại nào trong NestJS.
- **Mục đích**: Trả lời gọn bằng chữ ký hàm và khả năng hỗ trợ parameter decorator thay vì mô tả cú pháp.
- **Điểm mấu chốt**: Decorator mới (Stage 3) là chuẩn ECMAScript nhưng không hỗ trợ parameter decorator, nên NestJS buộc dùng `"experimentalDecorators": true`.

## Core Concept: Câu trả lời mẫu

```json
// tsconfig.json cho NestJS
{ "experimentalDecorators": true, "emitDecoratorMetadata": true }
```

**Q: Sự khác biệt lớn nhất giữa Decorator mặc định của TS 5.0+ và Decorator cũ (experimentalDecorators) là gì? Trong NestJS bạn sẽ chọn loại nào?**

**A:**

- Sự khác biệt lớn nhất nằm ở chữ ký hàm và khả năng tương thích. Decorator cũ (Stage 2) nhận đối số `(target, key, descriptor)` và cho phép trang trí tham số của hàm (parameter decorators). Decorator mới của TS 5.0 (Stage 3) là chuẩn ECMAScript chính thức, nhận đối số `(value, context)` giúp bảo vệ ngữ cảnh tốt hơn nhưng **không hỗ trợ parameter decorators**.
- Vì vậy, trong **NestJS**, bắt buộc phải cấu hình `"experimentalDecorators": true` và `"emitDecoratorMetadata": true` để NestJS có thể thực hiện Dependency Injection qua các parameter decorator ở constructor và suy luận kiểu dữ liệu phục vụ IoC Container lúc runtime.

## Related Notes

- Cơ chế hai thế hệ Decorator và cách viết từng loại: [[TS_Decorators]]
- [[Dependency_Injection]]: Cơ chế mà parameter decorator phục vụ trong NestJS.
- [[000_Tech_MOC]]
