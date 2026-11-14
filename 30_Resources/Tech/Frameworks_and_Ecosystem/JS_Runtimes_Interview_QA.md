---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba câu hỏi phỏng vấn về Bun và Node.js: vì sao Bun khởi động nhanh, khác biệt Garbage Collection, và thứ tự Microtask/Macrotask."
---

# Phỏng vấn: Bun vs Node.js

## TL;DR

- **Bản chất**: Ba câu hỏi hay gặp: vì sao Bun nhanh hơn, GC của JSC khác V8 thế nào khi chạy server, và thứ tự Microtask/Macrotask.
- **Mục đích**: Trả lời bằng tầng kiến trúc (Engine, binding FFI, Generational GC) thay vì bằng cảm nhận benchmark.
- **Điểm mấu chốt**: Điểm ăn tiền là nói rõ GC của JSC vốn tối ưu cho client, và Bun phải lập lịch lại để không tạo latency spike trên server.

## Core Concept: Ba mốc để trả lời

- **Tốc độ**: JSC tối ưu startup + Zig tích hợp I/O trực tiếp, bỏ chi phí binding giữa JS và C++.
- **Bộ nhớ**: V8 dùng Generational GC (Orinoco) cho tác vụ dài hạn; JSC tối ưu client, Bun phải viết lại GC scheduling.
- **Bất đồng bộ**: thứ tự Microtask trước Macrotask là đặc tả ECMA/HTML, giống nhau trên cả hai runtime.

```typescript
console.log("Start");
setTimeout(() => console.log("Macrotask"), 0);
Promise.resolve().then(() => console.log("Microtask"));
console.log("End"); // Start, End, Microtask, Macrotask
```

## Q1: Vì sao Bun có tốc độ khởi động và hiệu năng I/O nhanh hơn Node.js?

- **Trả lời:** Hai lý do kiến trúc:
  1. **Lựa chọn Engine:** Bun dùng JavaScriptCore (JSC) vốn tối ưu cho startup nhanh và tốn ít RAM hơn V8.
  2. **Tầng runtime (Zig vs Libuv):** Node.js dùng Libuv (C) và trả chi phí binding lớn khi truyền dữ liệu giữa V8 và C++. Bun viết bằng Zig, tích hợp I/O trực tiếp vào JSC, loại bỏ chi phí bắc cầu và gọi system call với độ trễ gần như bằng không.

## Q2: GC của JavaScriptCore khác gì V8, và ảnh hưởng gì đến ứng dụng server?

- **Trả lời:**
  - V8 của Node.js dùng Generational GC (Orinoco) rất trưởng thành, tối ưu cho tác vụ server dài hạn nơi biến được sinh và giải phóng liên tục.
  - JSC của Bun dùng bộ dọn rác vốn tối ưu cho client/browser (ưu tiên startup nhanh, tiết kiệm RAM); khi chạy server dài hạn có thể gây phân mảnh bộ nhớ nếu không tinh chỉnh. Đội Bun đã viết lại GC scheduling để buộc JSC thu gom rác ngoài các pha xử lý request chính, giảm latency spike.

## Q3: Thứ tự ưu tiên Microtask và Macrotask, và kết quả của đoạn code trên cả hai runtime?

- **Trả lời:** Kết quả giống nhau trên cả Bun và Node.js:
  ```
  Start
  End
  Microtask
  Macrotask
  ```
  - Giải thích: mã đồng bộ chạy trước, in `Start` và `End`; `setTimeout` đẩy callback vào Macrotask Queue còn `Promise.then` đẩy vào Microtask Queue. Khi Call Stack trống, Event Loop dọn sạch Microtask Queue trước (in `Microtask`), rồi mới lấy tác vụ từ Macrotask Queue (in `Macrotask`).

## Related Notes

- Kiến trúc Engine, GC và event loop của hai runtime: [[JS_Runtimes_Bun_vs_NodeJS]]
- Thứ tự Microtask/Macrotask chi tiết: [[JS_Event_Loop_Ordering]]
- [[000_Tech_MOC]]
