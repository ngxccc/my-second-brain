---
tags: [type/concept, status/permanent]
date: 2026-08-09
description: "Các mô hình gây rò rỉ bộ nhớ (Memory Leaks) phổ biến trong JavaScript và phương pháp phòng ngừa."
---

# JS Memory Leaks and Mitigation

Tài liệu này là một ghi chép Layer 2 mô tả chi tiết các nguyên nhân và phương pháp khắc phục rò rỉ bộ nhớ (Memory Leaks) trong môi trường JavaScript Engine (V8), dựa trên nguyên lý khoa học máy tính cốt lõi của [[Memory_Leaks_Core_Mechanics]].

## TL;DR

- **Bản chất**: Memory leak là object không còn dùng trong nghiệp vụ nhưng vẫn reachable từ GC Roots, nên Garbage Collector không thu hồi được.
- **Mục đích**: Nhận diện ba pattern gây leak phổ biến trên backend: dangling closure, timer không dọn, và accidental global.
- **Điểm mấu chốt**: Leak trong JS không phải "quên free" mà là còn tham chiếu; cách sửa là cắt tham chiếu (clear timer, bỏ listener, không giữ closure dài hạn).

---

## Core Concept

### Các Mô hình Gây Rò rỉ Bộ nhớ Cốt lõi

1. **Dangling Closures (Closure giữ tham chiếu thừa):** Nhiều closure trong cùng một scope dùng chung Lexical Environment. Nếu một closure lưu giữ biến có dung lượng lớn, closure còn lại (dù sống lâu hơn) sẽ giữ biến dung lượng lớn đó không bị GC thu hồi.
2. **Forgotten Timers (Quên dọn dẹp Timer):** Khai báo `setInterval` hoặc `setTimeout` nhưng không lưu Timer ID để dọn dẹp khiến callback và các biến nằm trong scope của nó bị treo vĩnh viễn trên Event Loop.
3. **Accidental Globals (Biến toàn cục ẩn danh):** Khai báo biến không dùng từ khóa (`var`/`let`/`const`) hoặc gán thuộc tính vào `global` / `globalThis` làm đối tượng đó sống vô hạn.

---

## Practical Implementation

### Ví dụ Code & Phương pháp Khắc phục

```typescript
// 1. Khắc phục Dangling Closures
let leakedData: any = null;

function createScopedTask() {
  const originalData = leakedData;
  const largeObject = new Array(1000000).fill("data");

  leakedData = {
    cleanTask: function () {
      // Đảm bảo không giữ lại tham chiếu largeObject
    },
  };
}

// 2. Khắc phục Forgotten Timers
function startManagedTimer(userData: { id: string }) {
  const timerId = setInterval(() => {
    console.log(`Processing ${userData.id}`);
  }, 5000);

  // Trả về hàm cleanup
  return () => clearInterval(timerId);
}
```

---

## Related Notes

- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nguyên lý nền tảng.
- [[Garbage_Collection_Fundamentals]] - Nguyên lý khoa học máy tính cốt lõi về cơ chế dọn rác tự động.
- Tham chiếu sót lại nằm ở Heap: [[Stack_vs_Heap_Memory_Fundamentals]]
- Nơi các tham chiếu rò rỉ trú ngụ: [[JS_Stack_vs_Heap_Memory]]
- Cơ chế lẽ ra phải thu hồi chúng: [[JS_Generational_Garbage_Collection]]
- Engine ảnh hưởng cách phát hiện leak: [[JS_Runtimes_Bun_vs_NodeJS]]
- [[000_Tech_MOC]]
