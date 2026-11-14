---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Thứ tự ưu tiên Call Stack, Microtask Queue và Macrotask Queue trong JavaScript Event Loop, kèm ví dụ in ra kết quả."
---

# JS Event Loop Ordering: Microtask vs Macrotask

## TL;DR

- **Bản chất**: Event Loop luôn chạy hết mã đồng bộ, rồi dọn sạch Microtask Queue, rồi mới lấy một tác vụ từ Macrotask Queue.
- **Mục đích**: Đoán được thứ tự in ra của `Promise.then` so với `setTimeout` mà không phải chạy thử.
- **Điểm mấu chốt**: Microtask chèn thêm trong lúc chạy vẫn được xử lý ngay trong cùng lượt dọn, nên một microtask có thể giam Macrotask vô hạn.

## Core Concept: Ba tầng và thứ tự

```
[Call Stack] ──(Khi stack trống)──> [Microtask Queue] (Promise.then, queueMicrotask)
                                            │
                                    (Khi Microtask Queue trống)
                                            │
                                            ▼
                                     [Macrotask Queue] (setTimeout, I/O Events, setImmediate)
```

1. **Call Stack:** thực thi toàn bộ mã đồng bộ trước.
2. **Microtask Queue:** ngay khi Call Stack trống, chạy _tất cả_ microtask cho đến khi hàng đợi trống hoàn toàn — bao gồm cả microtask mới được chèn thêm trong lúc chạy.
3. **Macrotask Queue:** Event Loop lấy _một_ tác vụ macrotask ra chạy, rồi quay lại dọn Microtask Queue trước khi lấy tác vụ tiếp theo.

```typescript
console.log("Start");
setTimeout(() => console.log("Macrotask"), 0);
Promise.resolve().then(() => console.log("Microtask"));
console.log("End");
// Kết quả: Start, End, Microtask, Macrotask
```

## Related Notes

- Kiến trúc runtime và vì sao thứ tự này giống nhau trên Bun và Node: [[JS_Runtimes_Bun_vs_NodeJS]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[JS_Runtimes_Interview_QA]]
- [[Redis_Single_Threaded_Event_Loop_Architecture]]: Cùng mô hình single-thread + queue ở tầng server.
- [[000_Tech_MOC]]
