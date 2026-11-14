---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Rò rỉ bộ nhớ do sub-slice ghim mảng ngầm khổng lồ, quy tắc chọn giữa cắt trực tiếp và `copy()`, kèm số đo HeapAlloc."
---

# Sub-slice Memory Leak trong Go

## TL;DR

- **Bản chất**: Sub-slice giữ con trỏ tới mảng ngầm lớn, nên một slice 10 phần tử vẫn ghim hàng triệu byte trên Heap.
- **Mục đích**: Biết khi nào `copy()` hoặc `bytes.Clone()` là bắt buộc: sub-slice sống lâu phải tách khỏi mảng gốc.
- **Điểm mấu chốt**: Thực nghiệm `HeapAlloc` cho thấy 10.020 KB khi rò rỉ xuống còn 257 KB sau `copy()`, thu hồi được ~9.7 MB.

## Core Concept: Cơ chế ghim mảng ngầm

```go
small := hugeArray[:10]      // vẫn giữ con trỏ tới mảng gốc khổng lồ
safe := make([]int, len(small))
copy(safe, small)            // tách khỏi mảng gốc -> GC thu hồi được hugeArray
```

- **Nguyên nhân**: Khi trích xuất một Sub-slice nhỏ (`small := hugeArray[:10]`) từ một mảng gốc dung lượng lớn và lưu vào biến sống lâu (Global Variable, Cache, Struct long-lived), trường `small.Data` vẫn chĩa con trỏ vào mảng gốc khổng lồ.
- **Hậu quả**: Garbage Collector (Mark-and-Sweep) thấy con trỏ `small.Data` vẫn tham chiếu đến địa chỉ mảng gốc nên coi toàn bộ mảng gốc là **Reachable**, khiến hàng triệu bytes RAM bị khóa lại không thể giải phóng.

## Quy tắc ra quyết định (Memory Lifecycle Rule)

- **Dùng Sub-slice trực tiếp**: Khi Sub-slice có **vòng đời ngắn (Short-lived)** trong hàm -> Đạt **Zero Allocation** với tốc độ $O(1)$.
- **Bắt buộc dùng `copy()` hoặc `bytes.Clone()`**: Khi Sub-slice có **vòng đời dài (Long-lived)** nhưng mảng gốc khổng lồ không còn dùng đến nữa -> Tạo mảng độc lập mới để Garbage Collection thu hồi ngay mảng gốc khổng lồ.

## Kết quả thực nghiệm (`HeapAlloc`)

- Khi bị rò rỉ: `10020 KB` (~10 MB RAM bị giam giữ trên Heap).
- Sau khi dùng `copy()`: `257 KB` (Thu hồi thành công ~9.7 MB RAM).

## Related Notes

- Cấu trúc header và tính chất tham chiếu quyết định hành vi này: [[Go_Slice_Underlying_Mechanics]]
- Cấp phát lại khi `append` vượt `cap`: [[Go_Append_Growth_and_Reallocation]]
- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nguyên lý nền tảng.
- [[Garbage_Collection_Fundamentals]] - Nguyên lý cốt lõi về cơ chế dọn rác tự động.
- Giữ sub-slice là giữ luôn vùng Heap gốc: [[Stack_vs_Heap_Memory_Fundamentals]]
