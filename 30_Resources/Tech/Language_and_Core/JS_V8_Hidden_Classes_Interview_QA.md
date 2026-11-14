---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Câu trả lời mẫu cho ba câu hỏi phỏng vấn về Class Transition, Dictionary Mode và trạng thái Megamorphic của V8."
---

# Phỏng vấn: Hidden Classes và Inline Caching

## TL;DR

- **Bản chất**: Ba câu hỏi hay gặp: vì sao gán thuộc tính động làm chậm Engine, cách viết code tối ưu cho Node/Bun, và quan hệ giữa Inline Caching với hidden class.
- **Mục đích**: Trả lời bằng cơ chế (Class Transition, offset tĩnh, Megamorphic) thay vì nói chung về "tối ưu".
- **Điểm mấu chốt**: Câu trả lời ăn điểm là quy tắc giữ object shape ổn định: khởi tạo đủ thuộc tính, không `delete`, và giữ nguyên thứ tự khai báo.

## Core Concept: Ba quy tắc nằm lòng

- **Khởi tạo đủ thuộc tính** trong biểu thức `{}` hoặc qua Constructor của Class.
- **Không `delete`**: xóa thuộc tính đẩy object về Dictionary Mode ngay lập tức.
- **Giữ thứ tự cố định**: thứ tự khác nhau sinh Class ẩn khác nhau, phá Inline Caching.

```javascript
// Một Class ẩn duy nhất cho mọi object nhờ cùng thứ tự và đủ thuộc tính
const user = { name, age, isContractor };
```

## Q1: Vì sao gán thuộc tính động trong JavaScript làm giảm hiệu năng Engine?

- **Trả lời:** Để truy cập thuộc tính nhanh như ngôn ngữ tĩnh, các Engine (V8, JSC) dùng Class ẩn (Hidden Class/Shape). Khi gán thuộc tính động, Engine phải thực hiện chuỗi chuyển đổi Class ẩn (Class Transition) và tính lại offset bộ nhớ. Nếu thứ tự gán khác nhau, Engine tạo ra nhiều Class ẩn khác nhau, phá bộ đệm Inline Caching và buộc quay về Dictionary Mode chậm chạp.

## Q2: Làm thế nào để viết code JavaScript tối ưu cho Node.js/Bun Backend?

- **Trả lời:** Luôn giữ cấu trúc đối tượng ổn định (stable object shapes):
  1. Khởi tạo toàn bộ thuộc tính ngay trong biểu thức `{}` hoặc qua Constructor của Class.
  2. Không bao giờ `delete obj.x` vì hành động này đưa object về Dictionary Mode.
  3. Giữ thứ tự thuộc tính đồng nhất khi khởi tạo để các object dùng chung một Class ẩn, tối ưu Inline Caching.

## Q3: Inline Caching hoạt động ra sao và liên hệ gì với Hidden Classes?

- **Trả lời:** Inline Caching ghi nhớ vị trí ô nhớ của thuộc tính ngay tại nơi gọi mã, dựa trên Class ẩn của object. Khi cùng một Class ẩn được truy cập nhiều lần, IC bỏ qua bước tìm trong Hash Map và nhảy thẳng tới ô nhớ chứa giá trị. Nếu cấu trúc object thay đổi liên tục, IC bị vô hiệu hóa (Megamorphic state) và hiệu năng giảm rõ rệt.

## Related Notes

- Cơ chế hidden class, class transition và inline caching: [[JS_V8_Hidden_Classes_Inline_Caching]]
- Code phản mẫu, bản viết lại và benchmark: [[JS_Object_Shape_Optimization_Guide]]
- [[000_Tech_MOC]]
