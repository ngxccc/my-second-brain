---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Câu hỏi phỏng vấn về hệ thống kiểu TypeScript: Structural vs Nominal Typing, Type Erasure, và ánh xạ sang Go/Java."
---

# Phỏng vấn: Hệ thống kiểu TypeScript

## TL;DR

- **Bản chất**: Bộ đáp án ngắn cho ba câu hỏi so khớp kiểu ở compile-time, sự biến mất của kiểu ở runtime, và cách Go/Java xử lý tương thích kiểu.
- **Mục đích**: Trả lời bằng cơ chế so khớp kiểu ở compile-time và runtime thay vì định nghĩa suông.
- **Điểm mấu chốt**: Vì kiểu không tồn tại ở runtime, mọi kiểm tra dữ liệu ngoài biên (API, form) đều phải dựa vào Type Guard do mình viết.

## Core Concept: Ba câu trả lời mẫu

```typescript
function isUser(arg: unknown): arg is User {
  /* type guard thủ công */
}
```

### Q1: Structural Typing của TypeScript khác Nominal Typing của Java/C# thế nào?

- **Trả lời:**
  - Nominal Typing (Java/C#) so kiểu theo tên lớp khai báo và quan hệ kế thừa rõ ràng; hai class giống hệt nhau về thuộc tính nhưng khác tên thì không gán được cho nhau.
  - Structural Typing (TypeScript) so kiểu theo hình dáng và thuộc tính dữ liệu: nếu đối tượng truyền vào có đủ thuộc tính mà nơi gọi yêu cầu thì được chấp nhận, không cần quan tâm tên hay nguồn gốc.

### Q2: Type Erasure là gì và ảnh hưởng thế nào đến việc viết mã TypeScript?

- **Trả lời:** Type Erasure xóa bỏ toàn bộ cú pháp kiểu tĩnh (interface, type annotations, generics) khi biên dịch sang JavaScript. Vì kiểu không tồn tại ở runtime, không thể dùng `instanceof` cho `interface` hoặc `type`; buộc phải tự viết Type Guard bằng toán tử thật (`typeof`, `"prop" in object`) hoặc hàm trả về **Type Predicate** (`arg is Type`) để compiler thu hẹp kiểu an toàn.

### Q3: Ánh xạ hệ thống kiểu TypeScript sang Go và Java?

- **Trả lời:**
  - **Java:** hệ thống kiểu tĩnh định danh (**Nominal Typing**); mọi lớp muốn tương thích phải kế thừa hoặc implement chung interface một cách tường minh lúc compile.
  - **Go:** rất tương đồng TypeScript vì dùng **Duck Typing** cho interface; struct không cần khai báo kế thừa, chỉ cần định nghĩa đủ phương thức mà interface yêu cầu là compiler tự coi là hợp lệ — tương tự việc so hình dáng của Structural Typing.

## Related Notes

- Cơ chế Structural Typing, Type Erasure và cách viết Type Guard: [[TS_Type_System_Structural_Type_Erasure]]
- [[000_Tech_MOC]]
