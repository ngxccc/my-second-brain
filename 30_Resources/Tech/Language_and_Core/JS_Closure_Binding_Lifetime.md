---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Closure giữ binding của biến theo environment record, không giữ bản sao giá trị tại thời điểm tạo hàm."
---

# JS Closure Binding Lifetime

## TL;DR

- **Bản chất**: Ô nhớ của biến nằm trong environment record sống cùng hàm; hàm đọc giá trị ở thời điểm được gọi, nên giá trị có thể đã đổi.
- **Mục đích**: Giải thích vì sao `var` trong loop in ra `3 3 3` còn `let` in ra `0 1 2`, và vì sao state trong `makeCounter()` sống sau khi hàm cha return.
- **Điểm mấu chốt**: Giá trị được đọc lúc **gọi hàm**, không phải lúc **định nghĩa hàm**. Đây là nguồn gốc của gần như mọi bug closure.

## Core Concept

- Mỗi function object giữ một internal slot `[[Environment]]` trỏ tới environment record nơi nó được tạo.
- Khi hàm chạy, identifier được tra qua **scope chain** tại thời điểm gọi, nên nó thấy giá trị **hiện tại** của binding, không phải giá trị lịch sử.
- Environment record chỉ bị giải phóng khi không còn ai tham chiếu. Hàm còn sống thì record còn sống.
- `var` khai báo **một** binding cho toàn function scope, được tái sử dụng qua mọi iteration.
- `let` trong `for` tạo **binding mới cho mỗi iteration** (per-iteration environment), nên mỗi closure giữ một binding riêng.
- Hệ quả bộ nhớ: closure giữ cả environment record, không chỉ biến nó dùng tới. Một closure nhỏ có thể giữ sống một object lớn nằm cùng scope.

## Practical Implementation

```js
// Binding, không phải giá trị
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next(); // 1
next(); // 2

// var: mot binding duy nhat
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 3 3 3

// let: binding moi moi iteration
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0); // 0 1 2
```

## Điều kiện sai

Hiểu theo note này sai ở các điểm sau sẽ tạo bug thật:

- **"Closure copy giá trị lúc tạo hàm"** - sai. Nếu biến bị gán lại sau khi closure được tạo, closure thấy giá trị mới. Đây chính là cơ chế làm `var + loop` in ra `3 3 3`.
- **"Closure chỉ giữ biến mà nó dùng"** - sai. Nó giữ environment record. Trong service dài sống (singleton, module scope), closure capture một object lớn là memory leak thật, không phải lý thuyết.
- **"`let` trong loop tạo closure riêng vì nó block-scoped"** - chưa đủ và dễ dẫn đến kết luận sai. Lý do đúng là per-iteration binding, không phải block scope nói chung.
- **"Closure là functional programming nên không có state"** - ngược lại, closure chính là state ẩn. Bug "config đọc một lần lúc khởi tạo" là closure giữ binding, không đọc lại env.

## Related Notes

- [[JS_Event_Loop_Macrotask_vs_Microtask]] - closure là cơ chế làm cho loop + timer sai thứ tự
- [[JS_Immer_Immutable_State]] - phân biệt binding với giá trị khi làm việc với state
- [[JS_Stack_vs_Heap_Memory]] - closure giữ environment record ở heap, không ở stack
