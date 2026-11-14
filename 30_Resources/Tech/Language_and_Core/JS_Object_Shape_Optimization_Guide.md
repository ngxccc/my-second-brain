---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Code phản mẫu phá hidden class, bản viết lại giữ object shape ổn định, và benchmark đo chênh lệch 2-5 lần."
---

# Tối ưu Object Shape cho V8

## TL;DR

- **Bản chất**: Hai phản mẫu (gán động, khác thứ tự) và bản viết lại khởi tạo đủ thuộc tính trong một biểu thức để mọi object dùng chung một Class ẩn.
- **Mục đích**: Có mẫu code sửa được ngay và một benchmark chạy được để tự kiểm chứng chênh lệch.
- **Điểm mấu chốt**: `delete obj.x` và khởi tạo lệch thứ tự là hai tác nhân làm rơi object về Dictionary Mode; giữ thứ tự cố định thì Inline Caching mới phát huy.

## Core Concept: So sánh code tối ưu và không tối ưu

### 1. Code phản mẫu: Gán động và sai thứ tự

```javascript
// Phản mẫu 1: Gán động khiến V8 phải tạo chuỗi chuyển tiếp Class ẩn liên tục
const user1 = {};
user1.name = "Ngoc";
user1.age = 22;

// Phản mẫu 2: Khác biệt về thứ tự gán thuộc tính phá vỡ Inline Caching
function createUser(name, age, isContractor) {
  const user = {};
  if (isContractor) {
    user.isContractor = true;
    user.name = name;
    user.age = age;
  } else {
    user.name = name;
    user.age = age;
    user.isContractor = false;
  }
  return user; // Trả về hai object có Class ẩn khác nhau (phá vỡ IC)
}
```

### 2. Code chuẩn tối ưu hiệu năng cao

Khởi tạo toàn bộ thuộc tính ngay trong biểu thức khai báo ban đầu hoặc dùng một Class Constructor thống nhất:

```typescript
// Tốt nhất: Khởi tạo đầy đủ thuộc tính và đồng nhất thứ tự từ đầu
interface User {
  name: string;
  age: number;
  isContractor: boolean;
}

function createUser(name: string, age: number, isContractor: boolean): User {
  // V8 chỉ tạo duy nhất 1 Class ẩn dùng chung cho mọi User
  return {
    name,
    age,
    isContractor,
  };
}
```

## Benchmark tự kiểm chứng

Lưu đoạn code sau thành `benchmark.js` và chạy bằng `bun benchmark.js` hoặc `node benchmark.js`:

```javascript
const iterations = 10000000; // 10 triệu vòng lặp

// Case 1: Đối tượng có cấu trúc ổn định (Stable Object Shape)
console.time(" Stable Shape (Optimized)");
for (let i = 0; i < iterations; i++) {
  const obj = { x: i, y: i + 1 };
  const z = obj.x + obj.y;
}
console.timeEnd(" Stable Shape (Optimized)");

// Case 2: Đối tượng gán thuộc tính động (Dynamic Shape / Class Transition)
console.time(" Dynamic Shape (Unoptimized)");
for (let i = 0; i < iterations; i++) {
  const obj = {};
  obj.x = i;
  obj.y = i + 1;
  const z = obj.x + obj.y;
}
console.timeEnd(" Dynamic Shape (Unoptimized)");
```

- **Kết quả thực tế:** Case 1 (Stable Shape) thường nhanh hơn **2 đến 5 lần** so với Case 2 do được JIT biên dịch trực tiếp và truy cập offset tĩnh, không qua chuyển đổi Class ẩn liên tục.

## Related Notes

- Cơ chế hidden class và inline caching: [[JS_V8_Hidden_Classes_Inline_Caching]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[JS_V8_Hidden_Classes_Interview_QA]]
- [[000_Tech_MOC]]
- Đo đạc hiệu năng thực nghiệm: [[Go_Benchmarking_and_Allocation_Guide]]
