---
tags: [type/concept, status/permanent]
date: 2026-08-06
description: "In Go, an Array (`[N]T`) is a fixed-size value type allocated contiguously in memory, while a Slice (`[]T`) is a lightweight 24-byte header descriptor (`ptr`, `len`, `cap`) serving as a dynamic vie..."
---

# Bản Chất Kiến Trúc Và Sự Phân Biệt Giữa Array Và Slice Trong Go

Ghi chép Layer 2 về khác biệt Array và Slice trong Go, cách chúng tương tác với Stack (mảng cố định) và Heap (mảng động), dựa trên [[Stack_vs_Heap_Memory_Fundamentals]] và ảnh hưởng tới áp lực dọn rác của [[Garbage_Collection_Fundamentals]].

## TL;DR

- **Bản chất**: Array `[N]T` là value type kích thước cố định; slice `[]T` là header 24 byte gồm `ptr`, `len`, `cap` trỏ vào một array ngầm.
- **Mục đích**: Hiểu vì sao truyền array copy toàn bộ dữ liệu còn truyền slice chỉ copy header, và vì sao hai slice có thể chia sẻ cùng vùng nhớ.
- **Điểm mấu chốt**: Mọi hành vi bất ngờ của slice đều suy ra được từ ba trường đó: side effect khi sửa, và việc `append` vượt `cap` mới cấp phát mảng mới.

---

## Core Concept & Architectural Rationales

### 1. Memory Semantics: Value Type vs. Header Descriptor

- **Array (`[N]T`)**:
  - **Value Type**: Assigning or passing an array copies the **entire array** (all elements) into a new stack frame.
  - **Fixed Size**: Length is part of its type definition (`[5]int` is completely distinct from `[10]int`).
  - **Zero Allocation Overhead**: Ideal for stack allocation with predictable cache locality and zero GC pressure.

- **Slice (`[]T`)**:
  - **Header Descriptor**: Assigning or passing a slice copies only the 24-byte **slice header** (`ptr`, `len`, `cap`).
  - **Dynamic Viewport**: Length can grow dynamically via `append()`.
  - **Shared Memory**: Multiple slices can reference overlapping regions of the same underlying array.

---

### 2. Why Go Doesn't Unify Them Into a Single Type

Instead of creating a heavy unified object (like Java's `ArrayList` or Python's `list`), Go applies **separation of concerns**:

1. **Arrays handle raw storage**: Fixed-size memory buffer with hardware-friendly layout.

## Practical Code Comparison

### Array Copying

```go
package main

import "fmt"

func main() {
    arr1 := [3]int{10, 20, 30}
    arr2 := arr1 // Copies entire array (3 elements)

    arr2[0] = 99
    fmt.Println(arr1) // Output: [10 20 30] (arr1 is untouched)
    fmt.Println(arr2) // Output: [99 20 30]
}
```

### Slice Copying

```go
package main

import "fmt"

func main() {
    s1 := []int{10, 20, 30}
    s2 := s1 // Copies only 24-byte header pointing to same underlying array

    s2[0] = 99
    fmt.Println(s1) // Output: [99 20 30] (s1 sees the mutation!)
    fmt.Println(s2) // Output: [99 20 30]
}
```

---

## Related Notes

- Lý do Array nằm Stack còn Slice trỏ Heap: [[Stack_vs_Heap_Memory_Fundamentals]]
- [[Garbage_Collection_Fundamentals]] - Nguyên lý cốt lõi về cơ chế dọn rác tự động.
- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nguyên lý nền tảng.
- [[Go_Slice_Underlying_Mechanics]] - Detailed breakdown of slice headers, ptr and len.
- [[Go_Append_Growth_and_Reallocation]] - When append reallocates, and the cap growth strategy.
- [[Go_Escape_Analysis_Mechanics]] - How memory escapes from stack to heap.
- [[English_Learner_Profile]] - Vocabulary tracker and progress milestones.
