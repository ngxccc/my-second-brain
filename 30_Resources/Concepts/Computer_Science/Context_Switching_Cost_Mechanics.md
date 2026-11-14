---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Cơ học và ba mức chi phí của Context Switching: Process switch (CR3, TLB invalidation), Kernel Thread switch, và Goroutine switch ở User Space."
---

# Cơ học và Chi phí của Context Switching

## TL;DR

- **Bản chất**: Context Switch lưu trạng thái luồng đang chạy, chọn luồng mới theo scheduler rồi khôi phục CPU; chi phí thật nằm ở TLB và Cache bị nguội, không ở vài lệnh lưu thanh ghi.
- **Mục đích**: Biết vì sao mô hình Blocking I/O một thread mỗi kết nối làm tê liệt CPU, còn Goroutine switch chỉ tốn vài chục nano-giây.
- **Điểm mấu chốt**: Process switch 1.000-3.000 ns vì phải ghi CR3 và invalidate TLB; Thread cùng Process 500-1.000 ns vì TLB còn ấm; Goroutine 10-100 ns vì chỉ lưu 3 thanh ghi ở User Space.

## Core Concept: Ba Cấp độ Chi phí

**Context Switching** là quá trình CPU dừng thực thi một Thread/Process để chuyển sang thực thi Thread/Process khác khi hết Time Slice hoặc khi gặp I/O Blocking.

```
[Running: Thread 1] ──> [Interrupt/System Call] ──> [Save TCB 1]
                                                          │
[Restore TCB 2] <── [Select Thread 2 (OS Scheduler)] <────┘
      │
      └──> [Running: Thread 2]
```

| Cấp độ                                         | Thao tác phần cứng / Hệ điều hành                                         | Chi phí thời gian    | Nguyên nhân tốn chi phí                                                                                                |
| :--------------------------------------------- | :------------------------------------------------------------------------ | :------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **1. Process Switch** (Nặng nhất)              | Đổi PCB, lưu thanh ghi, ghi đè thanh ghi **CR3** để đổi Page Table.       | **1,000 – 3,000 ns** | **TLB Invalidation**: Toàn bộ bộ nhớ đệm dịch địa chỉ bị vô hiệu hóa; gây CPU Cache Miss hàng loạt (Cold Cache).       |
| **2. Kernel Thread Switch** (Trung bình)       | Đổi TCB, lưu/khôi phục CPU Registers (PC, SP, FP). Giữ nguyên Page Table. | **500 – 1,000 ns**   | Bẫy vào Kernel Space (Ring 0), nhưng giữ lại được TLB mapping và CPU L1/L2 Cache ấm.                                   |
| **3. Goroutine / Coroutine Switch** (Siêu nhẹ) | Đổi context ở User Space thông qua Go Runtime Scheduler (M:N model).      | **10 – 100 ns**      | **Hoàn toàn ở User-space**, không chuyển đổi Ring 0/Ring 3, chỉ lưu 3 thanh ghi (PC, SP, DX), Stack siêu nhỏ (từ 2KB). |

## Kiểm chứng bằng Thực nghiệm trong Go

- Dùng Ping-Pong Unbuffered Channel để đo latency chuyển đổi ngữ cảnh siêu nhỏ của User-space Threading (Goroutine) so với OS Kernel Thread.
- Kỳ vọng: chênh lệch bậc độ lớn phản ánh đúng ba cấp trong bảng trên — không bẫy Kernel thì không mất TLB và Cache.

## Related Notes

- Cấu trúc bộ nhớ quyết định vì sao Process switch phải đổi Page Table: [[Process_vs_Thread_Memory_Model]]
- Chọn kiến trúc Multi-Process hay Multi-Thread: [[Process_vs_Thread_Tradeoff_Matrix]]
- [[Redis_Single_Threaded_Event_Loop_Architecture]]: Kiến trúc loại bỏ hoàn toàn chi phí này bằng một luồng duy nhất.
- [[000_Concepts_MOC]]: Danh mục lý thuyết nền tảng khoa học máy tính.
