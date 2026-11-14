---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Microtask queue được drain hoàn toàn trước khi event loop lấy macrotask tiếp theo, nên thứ tự output không theo thứ tự schedule."
---

# JS Event Loop Macrotask vs Microtask

## TL;DR

- **Bản chất**: Event loop chạy hết call stack, rồi **drain sạch microtask queue** (kể cả microtask sinh ra microtask), rồi mới lấy **một** macrotask tiếp theo.
- **Mục đích**: Giải thích vì sao `setTimeout(fn, 0)` luôn chạy sau `Promise.then`, và vì sao `await` không nhường quyền cho timer.
- **Điểm mấu chốt**: Microtask có quyền ưu tiên tuyệt đối trong một tick. Đây là nguồn gốc của cả thứ tự log bất ngờ lẫn hiện tượng starvation.

## Core Concept

- **Call stack**: code đang chạy đồng bộ.
- **Microtask queue**: promise reaction (`.then`, `.catch`, `await` continuation), `queueMicrotask`, `MutationObserver`.
- **Macrotask queue**: `setTimeout`, `setInterval`, I/O callback, `setImmediate`.
- Một tick gồm: chạy hết stack, drain microtask đến khi rỗng, lấy đúng một macrotask, lặp lại.
- `await x` biến phần còn lại của hàm thành một microtask continuation. Nó không nhường cho macrotask.
- Drain microtask là **không giới hạn**: microtask sinh ra microtask sẽ được chạy ngay trong cùng tick. Vòng lặp tự sinh microtask sẽ chặn timers và I/O vĩnh viễn (starvation).

## Practical Implementation

```js
console.log("1 sync");
setTimeout(() => console.log("2 timer"), 0); // macrotask
Promise.resolve().then(() => console.log("3 microtask")); // microtask
console.log("4 sync");

// Output: 1, 4, 3, 2
// 4 chay truoc 3 vi stack phai rong truoc khi drain microtask.
// 3 chay truoc 2 vi microtask duoc drain het truoc khi lay macrotask.
```

```js
// Starvation: timer khong bao gio chay
function spin() {
  queueMicrotask(spin);
}
setTimeout(() => console.log("never"), 0);
spin();
```

## Điều kiện sai

- **"`setTimeout(fn, 0)` nghĩa là chạy ngay"** - sai. Nó là macrotask, phải chờ stack rỗng và toàn bộ microtask xong.
- **"`await` nhường quyền cho macrotask"** - sai. Nó chỉ nhường cho microtask queue.
- **"Thứ tự log phản ánh thứ tự gọi"** - sai khi có cả hai loại queue trộn vào.
- **"Microtask rẻ nên dùng thoải mái"** - sai. Microtask chặn render và timers; lạm dụng trong vòng lặp lớn gây đơ UI hoặc trễ health check.
- **"Event loop của Node/Bun giống browser"** - gần đúng ở mô hình queue, khác ở các phase I/O và `setImmediate`. Đừng suy diễn chi tiết phase từ browser sang runtime server.

## Related Notes

- [[JS_Closure_Binding_Lifetime]] - closure là lý do loop `var` in ra `3 3 3`
- [[Redis_Single_Threaded_Event_Loop_Architecture]] - cùng mô hình single-thread + queue ở tầng server
- [[Process_vs_Thread_Memory_Model]] - vì sao "single thread" không có nghĩa là không có concurrency
