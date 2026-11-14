---
tags: [type/concept, status/permanent]
date: 2026-08-13
description: "Nguyên lý Khoa học Máy tính cốt lõi về cơ chế phân chia Size Classes và Memory Alignment của Heap Allocator giúp triệt tiêu hiện tượng External Memory Fragmentation."
---

# Heap Memory Size Classes and Alignment

Ghi chép Layer 1 về cách Heap Allocator (TCMalloc, jemalloc, glibc malloc, Go Heap Allocator) chia RAM thành các **Size Class** tiêu chuẩn để chống **External Memory Fragmentation**.

## TL;DR

- **Bản chất**: Heap allocator làm tròn kích thước yêu cầu lên size class tiêu chuẩn (8B, 16B, ... 32KB) thay vì cấp đúng số byte lẻ.
- **Mục đích**: Triệt tiêu external fragmentation và giữ mỗi lần cấp phát là thao tác O(1) trên free list có sẵn.
- **Điểm mấu chốt**: Cái giá là internal fragmentation - cấp 17 byte sẽ chiếm 24 byte; đây là lý do cấu trúc dữ liệu nhỏ nên nhóm lại thay vì cấp riêng lẻ.

---

## Core Concept & Rationales

### 1. Phân Mảnh Bộ Nhớ Ngoài (External Memory Fragmentation)

Khi một ứng dụng chạy liên tục và xin cấp phát / giải phóng các vùng nhớ có kích thước ngẫu nhiên trên Heap:

- Vùng nhớ 17 bytes được cấp phát, sau đó bị hủy -> Tạo ra lỗ hổng 17 bytes.
- Vùng nhớ 53 bytes được cấp phát, sau đó bị hủy -> Tạo ra lỗ hổng 53 bytes.

- **Triệu chứng:** RAM trống tổng còn nhiều (ví dụ 10MB) nhưng không có lỗ hổng liên tục đủ 100 bytes, nên cấp phát 100 bytes thất bại.
- **Hệ quả:** hệ thống báo Out of Memory, hoặc phải tốn CPU để dồn đống bộ nhớ (Memory Compaction).

---

### 2. Nguyên Lý Size Classes & Memory Alignment

Để giải quyết vấn đề phân mảnh bộ nhớ, các trình cấp phát bộ nhớ hiện đại (dựa trên kiến trúc TCMalloc của Google):

1. **Định nghĩa sẵn các Size Classes cố định**:
   Heap Allocator chia bộ nhớ thành các bảng kích thước chuẩn (Span Classes), ví dụ:
   `8B, 16B, 24B, 32B, 48B, 64B, 80B, 96B, 112B, 128B, 256B, ...`

2. **Làm tròn dung lượng (Size Class Roundup)**:
   Khi ứng dụng yêu cầu cấp phát $N$ bytes:
   - Trình cấp phát không cấp phát đúng $N$ bytes.
   - Trình cấp phát gọi hàm làm tròn `roundupsize(N)` để tìm ô nhớ tiêu chuẩn $M \ge N$ nhỏ nhất trong bảng Size Classes.
   - Gán nguyên khối $M$ bytes đó cho ứng dụng.

3. **Đánh đổi Kỹ thuật (Engineering Trade-off)**:
   - **Tốn một lượng nhỏ RAM thừa bên trong (Internal Fragmentation)**: Ví dụ cần 104B nhưng nhận 112B (thừa 8B).
   - **Triệt tiêu hoàn toàn phân mảnh bên ngoài (External Fragmentation)**: Mọi ô nhớ bị hủy đều rơi đúng vào các Size Class tiêu chuẩn, sẵn sàng được tái sử dụng ngay lập tức cho các yêu cầu tiếp theo.

---

## Bảng Roundup Size khi cấp phát mảng

Dưới đây là bảng minh họa cơ chế Roundup Size khi cấp phát mảng trên Heap trong Go Runtime (`src/runtime/sizeclasses.go`):

| Bytes yêu cầu gốc ($N$) | Size Class gần nhất được làm tròn ($M$) | Bytes thừa cho ứng dụng | Phần tử `int` (8B) khả dụng |
| :---------------------- | :-------------------------------------- | :---------------------- | :-------------------------- |
| 17 bytes                | 24 bytes                                | +7 bytes                | 3 phần tử (thay vì 2.125)   |
| 50 bytes                | 64 bytes                                | +14 bytes               | 8 phần tử (thay vì 6.25)    |
| 104 bytes               | 112 bytes                               | +8 bytes                | 14 phần tử (thay vì 13)     |
| 1000 bytes              | 1024 bytes                              | +24 bytes               | 128 phần tử (thay vì 125)   |

---

## Related Notes

- Đơn vị cấp phát mà allocator dùng: [[Stack_vs_Heap_Memory_Fundamentals]]
- [[Dynamic_Array_Exponential_Growth]] - Thuật toán tăng trưởng lũy thừa mảng động.
- [[Go_Append_Growth_and_Reallocation]] - Ứng dụng `runtime.roundupsize` trong Slice của Go.
