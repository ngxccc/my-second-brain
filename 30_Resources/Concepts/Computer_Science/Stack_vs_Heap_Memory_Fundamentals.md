---
tags:
  [type/concept, topic/concepts, layer/core-mechanics, topic/memory-management]
aliases:
  [
    Stack vs Heap Memory Fundamentals,
    Phân tầng Bộ nhớ Stack Heap Nguyên lý Gốc,
    Stack and Heap CS,
  ]
date: 2026-08-09
description: "Nguyên lý khoa học máy tính cốt lõi của bộ nhớ Stack (LIFO, CPU Stack Pointer) và Heap (Dynamic Memory Allocation, OS Virtual Memory)."
---

# Stack vs Heap Memory Fundamentals

## TL;DR

- **Bản chất**: Stack là cơ chế quản lý phần cứng trực tiếp bằng thanh ghi CPU Stack Pointer theo nguyên lý LIFO; Heap là vùng nhớ cấp phát động quản lý bằng phần mềm qua OS Virtual Memory và Runtime Memory Allocator.
- **Mục đích**: Stack phục vụ lưu trữ ngữ cảnh thực thi hàm và biến cục bộ ngắn hạn với tốc độ tối đa; Heap lưu trữ các đối tượng có kích thước linh hoạt, con trỏ chia sẻ trạng thái, hoặc tuổi thọ vượt ra ngoài phạm vi một hàm.
- **Điểm mấu chốt**: Cấp phát và thu hồi trên Stack tốn chi phí $O(1)$ chỉ bằng 1 phép tính số học trên thanh ghi CPU (như `SUB/ADD RSP`) và không gây áp lực lên Garbage Collector; ngược lại Heap tốn chi phí tra cứu ô nhớ trống và kích hoạt chu kỳ dọn rác (GC overhead qua `runtime.newobject`).

---

## Core Concept

### 1. Cơ chế Phần cứng của STACK (Ngăn xếp)

- **Thanh ghi CPU điều khiển:**
  - `RSP` (Stack Pointer trên kiến trúc x86_64): Lưu địa chỉ đỉnh hiện tại của Stack.
  - `RAX` (Accumulator Register): Lưu trữ giá trị trả về (`return value`) của hàm để caller nhận trực tiếp từ thanh ghi siêu tốc mà không cần qua RAM.
- **Stack Frame (Khung ngăn xếp):** Mỗi hàm khi được gọi sẽ tạo một Stack Frame độc lập ngăn cách với các hàm khác, chứa địa chỉ trả về (Return Address) và các biến cục bộ.
- **Cấp phát & Thu hồi cực nhanh:**
  - Cấp phát chỉ tốn đúng 1 lệnh máy CPU: trừ giá trị con trỏ Stack Pointer (ví dụ: `SUB RSP, 32` để kéo đỉnh stack xuống dành 32 bytes).
  - Khi hàm kết thúc, CPU cộng trả lại giá trị con trỏ (`ADD RSP, 32`). Toàn bộ biến cục bộ bị huỷ bỏ tức thì trong 1 chu kỳ xung nhịp ($O(1)$).
- **Tính chất vật lý:** Vùng nhớ Stack liên tục (Contiguous Memory), nằm gọn trong các tầng CPU Cache (L1/L2) nên tốc độ truy xuất đạt tối đa (độ trễ ~1 nano giây).
- **Giới hạn:** Kích thước cố định (Thread OS thường từ 1MB đến 8MB; Go Goroutine khởi tạo từ 2KB và mở rộng động). Khi gọi đệ quy vô hạn hoặc vượt quá giới hạn, hệ thống ném ra lỗi **Stack Overflow**.

### 2. Cơ chế Phần mềm của HEAP (Vùng nhớ Cấp phát Động)

- **Quản lý bằng phần mềm:** Không có phần cứng nào tự động quản lý Heap. Nhiệm vụ này thuộc về **Runtime Memory Allocator** (như `malloc` trong C, Allocator của Go Runtime, hoặc V8 trong Node.js) phối hợp cùng bộ quản lý bộ nhớ ảo của Hệ điều hành (OS Virtual Memory).
- **Quy trình cấp phát:**
  - Hệ thống phải tra cứu qua danh sách các khối nhớ trống (Free List, Size Classes) để tìm vùng nhớ liên tục vừa vặn với kích thước yêu cầu.
  - Trong môi trường đa luồng (Multi-threading), các luồng phải đồng bộ qua khóa (Lock) hoặc Thread-Local Cache để tránh xung đột ghi đè.
- **Tuổi thọ & Rủi ro:**
  - Dữ liệu trên Heap không tự mất đi khi hàm kết thúc. Nó tồn tại độc lập cho đến khi lập trình viên tự giải phóng (C/C++) hoặc chờ Garbage Collector (GC) quét qua và thu hồi.
  - Cấp phát quá nhiều trên Heap dẫn đến phân mảnh bộ nhớ (Memory Fragmentation), kéo dài thời gian dừng của GC (GC Pause/Latency Spikes) và nguy cơ tràn RAM (**Out of Memory - OOM**).

---

## Practical Implementation

### Bảng đúc kết so sánh bản chất

| Tiêu chí                       | STACK Memory                                       | HEAP Memory                                                |
| :----------------------------- | :------------------------------------------------- | :--------------------------------------------------------- |
| **Quản lý cấp phát**           | Phần cứng CPU (Thanh ghi Stack Pointer `RSP`)      | Phần mềm (Runtime Memory Allocator / GC / OS)              |
| **Tốc độ cấp phát/thu hồi**    | Cực nhanh ($O(1)$ - dịch chuyển con trỏ thanh ghi) | Chậm hơn (tìm ô nhớ trống, dọn phân mảnh)                  |
| **Vị trí dữ liệu**             | Tuyến tính liên tục, tỷ lệ CPU Cache Hit cao       | Phân tán, truy cập thông qua con trỏ (Pointer dereference) |
| **Thời gian sống (Lifecycle)** | Gắn chặt với Scope của hàm thực thi                | Độc lập ngoài Scope hàm, sống đến khi GC thu hồi           |
| **Ngữ nghĩa con trỏ**          | Không an toàn nếu trả về địa chỉ cục bộ (Dangling) | An toàn để chia sẻ trạng thái dùng chung (Shared State)    |
| **Chi phí Garbage Collector**  | Bằng 0 (Không liên quan đến GC)                    | Gây tải trực tiếp lên Garbage Collector                    |
| **Lỗi hệ thống tiêu biểu**     | Stack Overflow (đệ quy sâu, mảng quá lớn)          | Memory Leak / Out of Memory (OOM Killer)                   |

### Thử nghiệm Thực chứng: Escape Analysis trong Go

#### 1. Đoạn mã thí nghiệm (`02_memory/escape.go`)

```go
package main

func createInt() int {
	x := 42
	return x
}

func createPointer() *int {
	x := 42
	return &x
}

func main() {
	_ = createInt()
	_ = createPointer()
}
```

#### 2. Kết quả phân tích Compiler (`go build -gcflags="-m" ./02_memory/escape.go`)

- **Inlining Optimization:**
  - `can inline createInt`, `can inline createPointer`: Compiler nhận diện hàm ngắn và tối ưu hóa bằng cách dán thẳng thân hàm vào nơi gọi (`inlining call`) nhằm triệt tiêu chi phí gọi hàm qua Stack Frame.
- **Escape Decision:**
  - `moved to heap: x`: Biến `x` trong hàm `createPointer` bị buộc phải thoát lên Heap vì địa chỉ `&x` được trả ra ngoài scope hàm. Nếu giữ ở Stack, con trỏ trả về sẽ trỏ vào vùng nhớ rác sau khi Stack Frame bị hủy.
  - Ngược lại, hàm `createInt` trả về giá trị (Pass-by-value), CPU chỉ copy giá trị `42` sang thanh ghi `RAX` nên biến `x` ở lại Stack 100%.

#### 3. Chứng minh ở tầng Hợp ngữ Assembly (`go tool compile -l -S`)

- `createInt`: Không hề có lời gọi cấp phát bộ nhớ nào, giá trị được nạp trực tiếp vào thanh ghi.
- `createPointer`: Xuất hiện lệnh `CALL runtime.newobject(SB)`, chứng minh Go Runtime phải kích hoạt hàm cấp phát ô nhớ trên Heap.

---

## Related Notes

- [[Garbage_Collection_Fundamentals]]
- [[Memory_Leaks_Core_Mechanics]]
- [[Heap_Memory_Size_Classes_and_Alignment]]
- [[Go_Escape_Analysis_Mechanics]]
- [[JS_Stack_vs_Heap_Memory]]
- [[000_Concepts_MOC]]
