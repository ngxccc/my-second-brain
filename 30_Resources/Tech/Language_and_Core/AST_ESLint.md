---
tags: [type/concept, status/permanent]
date: 2026-08-19
description: "AST (Abstract Syntax Tree) là cấu trúc cây đại diện cho mã nguồn. Bằng cách viết các bộ chọn (AST Selectors) kết hợp với ESLint (`no-restricted-syntax`), ta có thể ép buộc các quy chuẩn kiến trúc (..."
---

# Phân tích AST và Custom ESLint Rules

## TL;DR

- **Bản chất**: AST là cây cú pháp đại diện cho mã nguồn; ESLint `no-restricted-syntax` cho phép viết selector để chặn một hình dạng code cụ thể ngay lúc lint.
- **Mục đích**: Enforce ranh giới kiến trúc và chặn pattern sai tự động, thay vì review bằng mắt hoặc dùng regex vốn không hiểu ngữ cảnh.
- **Điểm mấu chốt**: Selector dựa trên cấu trúc cây nên không bắt nhầm code nằm trong comment; đây là lý do nó thay được một phần code review thủ công.

## Core Concept

- **Tại sao nó tồn tại?** Máy tính không hiểu code theo dạng text mà biên dịch/phân tích nó thành cây AST (gồm các Node, Identifier, Literal).
- **Giải quyết bài toán gì?** Giải quyết việc review code thủ công quá tốn thời gian cho các lỗi cấu trúc, kiến trúc. Thay thế các lệnh check regex dễ bị false positive (bắt nhầm comment).
- **Nó có thay thế cái gì hay không?** Thay thế cho việc nhắc nhở bằng lời nói, doc quy tắc, hay code review bằng mắt thường.
- **Áp dụng dụng vào những dự án nào?** Hyundai B2B E-commerce.
- **Cơ chế hoạt động (How it works under the hood).**
  - **Tối ưu Next/Image**: Truy vấn `"JSXOpeningElement[name.name='Image']:not(:has(JSXAttribute[name.name='sizes']))"` để bắt lỗi các thẻ `<Image>` quên truyền thuộc tính `sizes` (làm giảm điểm LCP).
  - **Chống Deep Imports**: Phân tích `ImportDeclaration` để chặn các module import thọc sâu vào ruột module khác, đảm bảo ranh giới Server/Client.

## Trade-offs và mẫu trả lời phỏng vấn

- **Trade-offs**: Phải học cú pháp AST Selector. Việc viết các rule phức tạp đòi hỏi hiểu sâu về cấu trúc ngữ pháp của JavaScript/TypeScript.
- **Mẫu trả lời phỏng vấn (Flex)**: "Trong dự án, em không chỉ code feature mà còn setup Code Quality. Thay vì review code thủ công rất dễ sót những lỗi như quên thuộc tính `sizes` của Next/Image làm giảm điểm LCP, hay lỗi anh em phá vỡ ranh giới module (Architecture Boundaries), em đã tận dụng rule `no-restricted-syntax` để viết các **AST Selectors** (ví dụ query tìm thẻ JSXImage thiếu JSXAttribute 'sizes'). Việc dùng AST giúp phân tích chính xác ngữ cảnh thay vì Regex. Điều này tự động hóa việc bắt lỗi ngay trên editor, tiết kiệm cực nhiều công sức lúc Review PR."

---

**Related Notes:**

- [[NextJS_Route_Groups_and_Nested_Layouts]]
