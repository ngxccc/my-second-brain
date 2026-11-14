---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Cơ chế `runtime.growslice`: khi nào append cấp phát mảng mới, công thức tăng capacity từ Go 1.18, size class roundup, và kết quả benchmark pre-allocation."
---

# Cấp phát lại khi append và Chiến lược Tăng capacity

## TL;DR

- **Bản chất**: `append` chỉ xin mảng mới khi `len == cap`; dưới `cap` nó ghi thẳng vào ô trống của mảng ngầm đang có.
- **Mục đích**: Giải thích vì sao pre-allocate bằng `make([]int, 0, n)` cắt số lần cấp phát từ 38 xuống 1.
- **Điểm mấu chốt**: Từ Go 1.18 tăng cap theo đường cong mượt thay cho mốc nhân đôi rồi tụt còn 1.25x, và `runtime.roundupsize` làm tròn lên size class gần nhất.

---

## Core Concept: Cơ chế Tăng Trưởng

Khi gọi `append(slice, val)`:

1. **Trường hợp `len < cap`**: Go ghi phần tử mới vào ô trống tiếp theo của mảng gốc có sẵn mà không cấp phát lại bộ nhớ (**Zero Allocation**).
2. **Trường hợp `len == cap`**: Mảng gốc đã đầy. Go tự động kích hoạt thuật toán **`runtime.growslice`** để Memory Reallocation sang mảng mới:
   - **Thuật toán tăng trưởng lũy thừa (Exponential Growth Algorithm)**:
     - Dựa trên nguyên lý Khoa học Máy tính của [[Dynamic_Array_Exponential_Growth]], Go áp dụng tăng trưởng lũy thừa để đưa chi phí chèn mảng về độ phức tạp khấu trắc **Amortized $O(1)$** thay vì thảm họa $O(N^2)$ (giảm từ 500 tỷ lượt copy mảng xuống còn ~2 triệu lượt cho 1 triệu phần tử, tương đương 38 lần xin RAM).
     - Khi `cap < 256`: Capacity **nhân đôi** ($2 \times$). Ví dụ: 1 -> 2 -> 4 -> 8 -> 16 -> 32 -> 64 -> 128 -> 256 (9 lần xin RAM).
     - Khi `cap >= 256`: Go 1.18+ áp dụng công thức đường cong chuyển tiếp mượt (Smooth Transition Curve):
       $$\text{newcap} = \text{oldcap} + \frac{\text{oldcap} + 3 \times 256}{4}$$
       - **Lý do thiết kế**: Loại bỏ độ hẫng đột ngột (Cliff) ở phiên bản Go cũ (trước Go 1.18, `cap < 1024` nhân đôi $2.0\times$, nhưng `cap >= 1024` giảm đột ngột xuống $1.25\times$). Công thức mới giúp tỷ lệ tăng trưởng giảm dần một cách liên tục và mượt mà từ $2.0\times$ (khi `cap = 256`) xuống tiến gần $1.25\times$ (khi `cap` rất lớn).
     - **Size Class Roundup (`runtime.roundupsize`)**:
       - Áp dụng nguyên lý quản lý bộ nhớ Heap của [[Heap_Memory_Size_Classes_and_Alignment]], Heap Allocator của Go không cấp phát các kích thước byte lẻ loi để tránh **Rò rỉ mảnh bộ nhớ ngoài (External Memory Fragmentation)**.
       - Go định nghĩa sẵn ~67 ô nhớ tiêu chuẩn (**Size Classes**): 8B, 16B, 24B, 32B, 48B, 64B, 80B, 96B, 112B, 128B...
       - Khi `growslice` tính ra một `newcap` lẻ (ví dụ 104 bytes), `roundupsize(104)` sẽ tự động làm tròn lên ô nhớ tiêu chuẩn gần nhất là **112 bytes** (tương đương 14 phần tử `int`). Go gán luôn `cap = 14` cho Slice mà không tốn thêm chi phí RAM.
   - **Tách đứt liên kết**: Sau khi copy dữ liệu sang mảng mới, Slice mới trỏ sang `ptr` mới và cắt đứt với mảng cũ.

---

## Hệ Quả qua Function Boundary

Đoạn mã dưới đây minh họa sự khác biệt khi truyền Slice qua Function Boundary: trường hợp tràn Capacity (`modifyA`) bị tách mảng gốc, so với trường hợp còn Capacity (`modifyB`) bị ghi đè trực tiếp mảng gốc:

```go
package main

import "fmt"

// modifyA: append khi len == cap -> Kích hoạt Memory Reallocation sang mảng mới
func modifyA(val []int) {
 val = append(val, 4) // Tràn cap -> Cấp phát mảng mới 0xNEW!
 val[0] = 99          // Chỉ tác động tới mảng mới 0xNEW
}

// modifyB: append khi len < cap -> Ghi trực tiếp vào mảng ngầm chung
func modifyB(val []int) {
 val = append(val, 4) // Còn cap -> Ghi 4 vào underlying_array[3] tại 0xADDR
 val[0] = 99          // Ghi 99 vào underlying_array[0] tại 0xADDR
}

func main() {
 // 1. Trường hợp len == cap (3 == 3)
 s := []int{1, 2, 3}
 modifyA(s)
 fmt.Printf("s sau modifyA:  %v (len=%d, cap=%d)\n", s, len(s), cap(s))
 // Kết quả: [1 2 3] -> s hoàn toàn không bị thay đổi vì modifyA đã nhảy sang mảng mới!

 // 2. Trường hợp len < cap (3 < 10)
 s2 := make([]int, 3, 10)
 modifyB(s2)
 fmt.Printf("s2 sau modifyB: %v (len=%d, cap=%d)\n", s2, len(s2), cap(s2))
 // Kết quả: [99 0 0] -> s2[0] bị đổi thành 99 vì modifyB dùng chung mảng 0xADDR!

 // 3. Reslice s2 để xem phần tử đã append ở vị trí index 3
 fmt.Printf("s2[:4] Reslice: %v\n", s2[:4])
 // Kết quả: [99 0 0 4] -> Số 4 đã nằm sẵn ở ô nhớ 0xADDR[3]!
}
```

---

## Đối Chiếu Hiệu Năng Thực Nghiệm Pre-allocation (`go test -benchmem`)

Quy trình chi tiết về kỹ thuật đo đạc Benchmarking (`b.Loop()`), phân tích Escape Analysis (`-gcflags="-m"`), và phòng chống Dead Code Elimination được quy định tại SOP **[[Go_Benchmarking_and_Allocation_Guide]]**.

Dưới đây là kết quả đối chiếu thực nghiệm giữa việc **Không Pre-allocate** (`make([]int, 0)`) vs **Có Pre-allocate** (`make([]int, 0, 1_000_000)`):

```text
BenchmarkAppendNoAlloc-12     130    9263964 ns/op    41678261 B/op    38 allocs/op
BenchmarkAppendPrealloc-12    729    1591648 ns/op     8003584 B/op     1 allocs/op
```

- **`allocs/op`**: Pre-allocation giảm số lần xin cấp phát bộ nhớ từ **38 lần xuống còn đúng 1 lần duy nhất** (Heap Allocation giảm 97.4%).
- **`ns/op`**: Thời gian thực thi giảm từ **9.26 ms xuống còn 1.59 ms** (tốc độ xử lý **nhanh hơn gần 6 lần**).
- **`B/op`**: Dung lượng RAM cấp phát trung gian giảm từ **41.6 MB xuống còn 8.0 MB** (loại bỏ hoàn toàn rác bộ nhớ từ các mảng trung gian).

## Related Notes

- Cấu trúc header `ptr`/`len`/`cap` và tính chất tham chiếu của Slice: [[Go_Slice_Underlying_Mechanics]]
- Rò rỉ bộ nhớ khi sub-slice ghim mảng ngầm khổng lồ: [[Sub_Slice_Memory_Leak]]
- [[Dynamic_Array_Exponential_Growth]] - Nguyên lý Khoa học Máy tính cốt lõi về thuật toán tăng trưởng lũy thừa của mảng động.
- [[Heap_Memory_Size_Classes_and_Alignment]] - Nguyên lý Khoa học Máy tính cốt lõi về phân chia Size Classes và Memory Alignment của Heap Allocator.
- [[Go_Benchmarking_and_Allocation_Guide]] - Quy trình SOP đo đạc hiệu năng Benchmark và Escape Analysis trong Go.
- [[Go_Array_Vs_Slice_Distinction]] - Phân biệt Array là giá trị và Slice là header.
