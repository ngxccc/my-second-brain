---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Trong JavaScript, object thực chất là Hash Map động; JS Engine tạo hidden class để biến property lookup thành đọc theo offset cố định và dùng inline caching ghi nhớ offset tại call site."
---

# JS Hidden Classes & Inline Caching

## TL;DR

- **Bản chất**: V8 tạo hidden class để biến property lookup từ băm chuỗi thành đọc theo offset cố định, và inline cache ghi nhớ offset đó ngay tại điểm truy cập.
- **Mục đích**: Giải thích vì sao cùng một logic nhưng khác thứ tự khởi tạo property lại chênh hiệu năng rõ rệt.
- **Điểm mấu chốt**: Thêm/xóa property động hoặc khởi tạo sai thứ tự phá hidden class, đẩy object về dictionary mode và mất toàn bộ lợi ích.

---

## Core Concept

### 1. Tại sao JavaScript động lại chậm?

- **Ở ngôn ngữ biên dịch tĩnh:** kiểu dữ liệu và cấu trúc class biết trước khi chạy, nên compiler biết offset chính xác của từng thuộc tính; truy xuất chỉ là một lệnh CPU nhảy thẳng địa chỉ, $O(1)$.
- **Trong JavaScript:** thuộc tính có thể thêm/bớt động tại runtime. Nếu không tối ưu, mỗi lần viết `obj.x` Engine phải tìm chuỗi khóa `"x"` trong Hash Map của object — rất tốn chuỗi lệnh CPU (String Hashing, Hash Collision handling).

### 2. Giải pháp của JS Engine: Hidden Classes

Để đạt hiệu năng của ngôn ngữ tĩnh, JS Engine tạo các Class ẩn tại runtime:

- Mỗi object được gán một Class ẩn (V8 gọi là _Hidden Class_, JavaScriptCore gọi là _Shape_).
- Class ẩn lưu ánh xạ: tên thuộc tính $\rightarrow$ offset của nó trong bộ nhớ.
- Hai object có chung chính xác các thuộc tính **và cùng thứ tự** sẽ dùng chung một Class ẩn.

### 3. Chuỗi chuyển đổi Class ẩn

Khi gán thuộc tính động, Engine phải tính lại địa chỉ và tạo chuỗi Class ẩn chuyển tiếp:

```
const obj = {};        // (1) Tạo Class_0 (Rỗng)
obj.x = 1;            // (2) Chuyển tiếp: Class_0 -> Class_1 (Có 'x' ở offset 0)
obj.y = 2;            // (3) Chuyển tiếp: Class_1 -> Class_2 (Có 'x' ở offset 0, 'y' ở offset 8)
```

Nếu object khác được gán theo thứ tự ngược lại (`obj.y = 2` trước `obj.x = 1`), V8 tạo nhánh chuyển tiếp khác (`Class_3` và `Class_4`); hai object chứa cùng thuộc tính nhưng mang hai Class ẩn khác nhau.

### 4. Inline Caching là gì?

Inline Caching ghi nhớ kết quả tìm kiếm thuộc tính trước đó ngay tại điểm gọi mã (call site).

- Lần đầu `getX(obj)` chạy, V8 tìm vị trí của `x` và ghi nhớ: _"Nếu object thuộc Class ẩn X thì `x` nằm ở offset 0"_.
- Các lần sau, V8 chỉ kiểm tra object mới có thuộc `Class X` hay không; nếu đúng thì nhảy thẳng tới offset 0.
- Nếu object truyền vào thuộc nhiều Class ẩn khác nhau (Polymorphic/Megamorphic), Inline Caching thất bại và V8 quay lại Dictionary Mode chậm.

## Related Notes

- Cách viết code giữ object shape ổn định, kèm benchmark: [[JS_Object_Shape_Optimization_Guide]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[JS_V8_Hidden_Classes_Interview_QA]]
- [[000_Tech_MOC]]
- Quản lý bộ nhớ: [[JS_Stack_vs_Heap_Memory]]
