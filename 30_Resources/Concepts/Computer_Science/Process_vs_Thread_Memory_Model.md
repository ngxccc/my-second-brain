---
tags: [type/concept, status/permanent]
date: 2026-09-22
description: "Mô hình bộ nhớ của Process và Thread: không gian địa chỉ ảo, Page Table riêng, PCB/TCB, và phần bộ nhớ dùng chung giữa các Thread."
---

# Process vs Thread: Mô hình Bộ nhớ và Quyền Sở hữu Tài nguyên

## TL;DR

- **Bản chất**: Process sở hữu Page Table và không gian địa chỉ ảo riêng; Thread trong cùng Process chia sẻ Text/Data/Heap/File Descriptor và chỉ giữ riêng Stack + Registers.
- **Mục đích**: Chọn giữa isolation tuyệt đối (Process) và chia sẻ dữ liệu không cần IPC (Thread) dựa trên cấu trúc bộ nhớ, không theo cảm tính.
- **Điểm mấu chốt**: MMU chặn Process A ghi vào bộ nhớ Process B (Segmentation Fault), còn hai Thread ghi cùng một ô Heap là nguyên nhân trực tiếp của Race Condition.

---

## Core Concept

### 1. Góc nhìn Logic & Sở hữu Tài nguyên

```
+-------------------------------------------------------------------+
|                        PROCESS MEMORY SPACE                       |
|                                                                   |
|  +--------------------+  +--------------------+  +-------------+  |
|  |    Text Segment    |  |    Data Segment    |  |    Heap     |  |
|  |   (Machine Code)   |  |  (Global Variables)|  | (Dynamic Alloc)|  |
|  +--------------------+  +--------------------+  +-------------+  |
|          ^                         ^                    ^         |
|          |                         |                    |         |
|     (SHARED)                  (SHARED)             (SHARED)   |
|          |                         |                    |         |
|  +-------+-------------------------+--------------------+------+  |
|  |                                                             |  |
|  |   +-----------------------+     +-----------------------+   |  |
|  |   |       THREAD 1        |     |       THREAD 2        |   |  |
|  |   |  - Private Stack      |     |  - Private Stack      |   |  |
|  |   |  - Registers (PC, SP) |     |  - Registers (PC, SP) |   |  |
|  |   |  - TCB (Thread State) |     |  - TCB (Thread State) |   |  |
|  |   +-----------------------+     +-----------------------+   |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

### 2. Bố cục Không gian Địa chỉ RAM Ảo

```
High Memory Address
+-------------------------------------------------------------+
| KERNEL SPACE (Dành riêng cho Kernel khi bẫy System Call)    |
+-------------------------------------------------------------+
| STACK (Phát triển đi XUỐNG vvv)                             |
|  - Stack của Thread 1 (Local variables, Stack Frames)       |
|  - Stack của Thread 2 (Local variables, Stack Frames)       |
+-------------------------------------------------------------+
|                          ...                                |
|             (Unallocated Free Memory Gap)                   |
|                          ...                                |
+-------------------------------------------------------------+
| HEAP (Phát triển đi LÊN ^^^)                                |
|  - Dynamic memory allocation (malloc, new, pointer)         |
|  - SHARED: Mọi Thread trong Process đều đọc/ghi vào đây     |
+-------------------------------------------------------------+
| BSS & DATA SEGMENT                                          |
|  - Global variables và Static variables                     |
|  - SHARED: Mọi Thread trong Process đều đọc/ghi vào đây     |
+-------------------------------------------------------------+
| TEXT / CODE SEGMENT (Read-Only)                             |
|  - Binary machine code (CPU instructions)                   |
|  - SHARED: Tất cả Thread cùng đọc chung mã này              |
+-------------------------------------------------------------+
Low Memory Address
```

### 3. Process (Đơn vị cấp phát tài nguyên)

- **Tài nguyên độc lập**: Mỗi Process có một bảng phân trang riêng (**Page Table**) ánh xạ không gian địa chỉ ảo (Virtual Memory) vào RAM vật lý. Process A **không thể đọc hoặc ghi** vào bộ nhớ của Process B (bị phần cứng MMU chặn và kích hoạt `Segmentation Fault` nếu cố truy cập).
- **Cấu trúc quản lý**: Hệ điều hành quản lý Process thông qua **PCB (Process Control Block)** gồm: Process ID (PID), Trạng thái (Ready/Running/Waiting), Con trỏ Page Table, File Descriptors, Permissions.

### 4. Thread (Đơn vị điều phối thực thi)

- **Tài nguyên dùng chung**: Mọi Thread trong cùng một Process đều dùng chung Text Segment, Data/BSS Segment, Heap, và File Descriptors.
- **Thread-private**:
  1. **Stack**: Lưu biến cục bộ và Stack Frames của riêng Thread đó.
  2. **Registers & Program Counter (PC)**: Lưu trạng thái CPU tức thời (Thread đang thực thi đến lệnh máy nào).
- **Cấu trúc quản lý**: Hệ điều hành quản lý Thread thông qua **TCB (Thread Control Block)** gồm: Thread ID (TID), Register Set, Stack Pointer, Con trỏ trỏ về PCB cha.

## Kiểm chứng bằng Thực nghiệm trong Go

- **Kiểm chứng Process Isolation**: Tạo Process con qua `os/exec`. Thay đổi biến toàn cục ở con $\rightarrow$ Không gian bộ nhớ của cha không đổi.
- **Kiểm chứng Thread Memory Sharing**: Chạy 4 Goroutines cùng `counter++` không dùng lock $\rightarrow$ Race Condition chứng minh dữ liệu bị ghi đè do dùng chung Heap.

## Related Notes

- Chi phí chuyển đổi giữa các đơn vị này: [[Context_Switching_Cost_Mechanics]]
- Chọn kiến trúc Multi-Process hay Multi-Thread: [[Process_vs_Thread_Tradeoff_Matrix]]
- [[Stack_vs_Heap_Memory_Fundamentals]]: Cơ chế phân bổ bộ nhớ Stack và Heap.
- [[Master_Backend_Engineering_SSOT]]: Khung chương trình và bản đồ thực hành Backend.
- [[000_Concepts_MOC]]: Danh mục lý thuyết nền tảng khoa học máy tính.
