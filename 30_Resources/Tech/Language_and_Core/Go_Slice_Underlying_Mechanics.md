---
tags: [type/concept, status/permanent]
date: 2026-08-05
description: "Slice trong Go không lưu trữ dữ liệu trực tiếp mà đóng vai trò như một cấu trúc Slice Header 24-byte (gồm con trỏ `ptr`, độ dài `len`, và sức chứa `cap`) trỏ vào một Mảng ngầm bên dưới (Underlying Array)."
---

# Go Slice Underlying Mechanics

Ghi chép Layer 2 về cấu trúc bên dưới của Slice trong Go (Slice Header, Underlying Array, Memory Reallocation), dựa trên [[Stack_vs_Heap_Memory_Fundamentals]] và liên quan tới cơ chế dọn rác của [[Garbage_Collection_Fundamentals]].

## TL;DR

- **Bản chất**: Ba trường `ptr`, `len`, `cap` là toàn bộ state của slice; mọi hành vi chia sẻ dữ liệu quan sát được đều suy ra từ chúng.
- **Mục đích**: Giải thích vì sao hai slice cắt từ cùng mảng ngầm thấy thay đổi của nhau, và vì sao truyền slice vào hàm vẫn ghi được vào dữ liệu gốc.
- **Điểm mấu chốt**: `cap` đo từ `ptr` tới cuối mảng ngầm, nên hai slice cùng `len` có thể khác `cap`; phần nằm trước `ptr` không truy cập ngược lại được.

---

## Core Concept & Rationales

### 1. Cấu Trúc Slice Header

Trên hệ thống 64-bit, một Slice thực chất chỉ chiếm **24 bytes** bộ nhớ trên Stack dưới dạng một cấu trúc `struct`:

```go
type SliceHeader struct {
    Data uintptr // ptr: Con trỏ địa chỉ ô nhớ RAM của phần tử đầu tiên (8 bytes)
    Len  int     // len: Số lượng phần tử hiện tại được phép đọc/ghi (8 bytes)
    Cap  int     // cap: Sức chứa tối đa tính từ ptr đến hết mảng gốc (8 bytes)
}
```

- **`ptr` (Pointer)**: Xác định vị trí "cửa sổ" Slice bắt đầu mở ra ở đâu trong mảng ngầm.
- **`len` (Length)**: Giới hạn đọc/ghi an toàn. Truy cập ngoài chỉ số `len` sẽ kích hoạt `panic: index out of range`. Vòng lặp `for range` dựa trực tiếp vào trường `len` này để giới hạn số lượt duyệt từ `0` đến `len - 1`.
- **`cap` (Capacity)**: Sức chứa tối đa tính từ con trỏ `ptr` về phía cuối của mảng ngầm gốc. Công thức xác định `cap`:

$$\text{Cap} = \text{Total Array Size} - \text{Start Index}$$

---

### 2. Mảng Ngầm & Phân Tích Sự Khác Biệt Capacity (sliceA vs sliceB)

Cho mảng gốc `array := [5]int{10, 20, 30, 40, 50}` (tổng 5 phần tử):

- **`sliceA := array[0:3]`**:
  - Con trỏ `ptr` trỏ vào `array[0]` (`Start Index = 0`).
  - Chiều dài `len` = `3 - 0 = 3` (`[10, 20, 30]`).
  - Sức chứa `cap` = $5 - 0 = 5$ (truy cập tối đa từ `array[0]` tới `array[4]`).

- **`sliceB := array[1:4]`**:
  - Con trỏ `ptr` trỏ vào `array[1]` (`Start Index = 1`).
  - Chiều dài `len` = `4 - 1 = 3` (`[20, 30, 40]`).
  - Sức chứa `cap` = $5 - 1 = 4$ (truy cập tối đa từ `array[1]` tới `array[4]`). Phần tử tại `array[0]` nằm phía trước con trỏ `ptr` nên không thể truy cập ngược lại được nữa.

---

### 3. Mảng Ngầm & Tính Chất Tham Chiếu

- **Không tự chứa dữ liệu**: Slice chỉ mô tả một phân đoạn của mảng ngầm liên tục (Contiguous Memory Block).
- **Truyền tham trị nhưng mang hiệu ứng tham chiếu**: Khi truyền Slice vào hàm, Go chỉ sao chép 24-byte header. Do `ptr` vẫn trỏ tới cùng địa chỉ mảng gốc, các chỉnh sửa phần tử bên trong hàm sẽ **thay đổi mảng gốc trực tiếp** (Mutate underlying array).
- **Side Effects**: Nếu hai hoặc nhiều Slice (`sliceA`, `sliceB`) cùng tham chiếu vào một ô bộ nhớ chung, thay đổi ở `sliceA` sẽ lập tức xuất hiện ở `sliceB`.

---

### 4. Can Thiệp Trực Tiếp Vào Slice Header (`unsafe.Pointer`)

Bằng chứng thực nghiệm can thiệp trực tiếp vào cấu trúc bộ nhớ 24-byte `SliceHeader` để mở rộng tầm nhìn của Slice mà không cần gọi hàm `append()` hay cấp phát thêm RAM:

```go
package main

import (
	"fmt"
	"unsafe"
)

type sliceHeader struct {
	Data unsafe.Pointer
	Len  int
	Cap  int
}

func main() {
	arr := [5]int{10, 20, 30, 40, 50}

	// 1. Tạo Slice thủ công bằng unsafe.Slice (Go 1.17+) trỏ vào arr[1]
	s := unsafe.Slice(&arr[1], 3) // len=3, cap=4 -> [20 30 40]

	// 2. Ép kiểu địa chỉ biến s thành con trỏ *sliceHeader
	hdr := (*sliceHeader)(unsafe.Pointer(&s))

	// 3. Can thiệp trực tiếp vào trường Len trên RAM từ 3 lên 4
	hdr.Len = 4

	// 4. Kết quả: Slice mở rộng góc nhìn tới arr[4] (50) mà KHÔNG cần call append()
	fmt.Printf("Mutated Slice (Len=4): %v\n", s) // Output: [20 30 40 50]
}
```

- **Lưu ý bộ nhớ (Go 1.17+)**: Tránh sử dụng `reflect.SliceHeader` nguyên thủy trong mã nguồn Production vì lưu `uintptr` có thể gây GC Race Condition (Garbage Collector không nhận diện được con trỏ và giải phóng nhầm mảng gốc). Bắt buộc ưu tiên sử dụng `unsafe.Slice` và `unsafe.SliceData`.

## Related Notes

- Cấp phát lại khi `append` vượt `cap` và chiến lược tăng trưởng: [[Go_Append_Growth_and_Reallocation]]
- Rò rỉ bộ nhớ khi sub-slice ghim mảng ngầm khổng lồ: [[Sub_Slice_Memory_Leak]]
- [[Go_Array_Vs_Slice_Distinction]] - Phân biệt Array là giá trị và Slice là header.
- [[Go_Benchmarking_and_Allocation_Guide]] - Quy trình SOP đo đạc hiệu năng Benchmark và Escape Analysis trong Go.
- Backing array được cấp phát ở Heap: [[Stack_vs_Heap_Memory_Fundamentals]]
- [[Garbage_Collection_Fundamentals]] - Nguyên lý cốt lõi về cơ chế dọn rác tự động.
- [[Go_Escape_Analysis_Mechanics]] - Bản chất cấu trúc Slice Header và sự ảnh hưởng của Escape Analysis đến Underlying Array.
- [[Go_Roadmap]] - Lộ trình làm chủ ngôn ngữ Go và các cấu trúc dữ liệu cốt lõi.
