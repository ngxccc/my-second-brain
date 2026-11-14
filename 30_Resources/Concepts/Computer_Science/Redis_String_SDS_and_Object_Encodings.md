---
tags: [type/concept, status/permanent]
date: 2026-10-03
description: "Cấu trúc nội bộ Redis String: SDS header 5 loại, `robj` 16 bytes, và ba encoding INT, EMBSTR, RAW theo độ dài chuỗi."
---

# Redis String: SDS và các Object Encodings

## TL;DR

- **Bản chất**: Redis String là SDS (Simple Dynamic String) bọc trong `robj`, không phải `char*` kết thúc bằng `\0`.
- **Mục đích**: Lấy độ dài $O(1)$, chứa được dữ liệu nhị phân tùy ý, và kiểm tra tràn buffer trước khi nối chuỗi.
- **Điểm mấu chốt**: Ba encoding quyết định chi phí: `INT` nhét số vào chính con trỏ `ptr`, `EMBSTR` gộp `robj` + SDS vào một khối 64 bytes khi chuỗi $\le 44$ bytes, `RAW` tách thành 2 lần cấp phát.

---

## Core Concept

### Cấu trúc Simple Dynamic String (SDS)

Trong C, một chuỗi ký tự (`char*`) kết thúc bằng ký tự `\0`. Thao tác tính độ dài qua `strlen()` tiêu tốn $O(N)$ và không thể chứa dữ liệu nhị phân tùy ý (ảnh JPEG, Protobuf, hoặc mã nén zstd) vì các byte `0x00` bị nhận diện nhầm là điểm kết thúc chuỗi.

Redis giải quyết bài toán này bằng **SDS (Simple Dynamic String)**. Kể từ Redis 3.2+, SDS được tối ưu hóa thành 5 kiểu Header khác nhau (`sdshdr5`, `sdshdr8`, `sdshdr16`, `sdshdr32`, `sdshdr64`) dựa trên độ dài dữ liệu để tiết kiệm tối đa byte siêu dữ liệu:

```text
┌────────────────────────────────────────────────────────┐
│                      SDS Structure                     │
├───────────┬──────────┬──────────┬──────────────────────┤
│    len    │  alloc   │  flags   │     buf[]            │
│  (1-8 B)  │ (1-8 B)  │  (1 B)   │  (Binary Safe Data)  │
└───────────┴──────────┴──────────┴──────────────────────┘
```

- **`len`**: Số lượng bytes thực tế đang sử dụng. Cho phép truy xuất độ dài trong thời gian $O(1)$ mà không cần duyệt chuỗi.
- **`alloc`**: Tổng số bytes đã cấp phát cho mảng `buf` (chưa tính header và byte null kết thúc). Cho phép Redis kiểm tra buffer overflow ngay lập tức trước khi nối chuỗi.
- **`flags`**: 3 bits đầu lưu loại header (SDS_TYPE_5, SDS_TYPE_8, ...), 5 bits còn lại không sử dụng.
- **`buf[]`**: Mảng byte chứa dữ liệu thô. Redis luôn tự động thêm ký tự `\0` vào cuối mảng để có thể tái sử dụng trực tiếp các hàm chuẩn của C libc (`printf`, `strcasecmp`) mà không cần copy buffer.

### Lớp bọc Redis Object (`robj`) và Các Encodings của String

Mọi giá trị lưu trong Dict của Redis đều được bọc trong một cấu trúc gọi là `redisObject` (`robj`):

```c
struct redisObject {
    unsigned type:4;       // OBJ_STRING = 0 (4 bits)
    unsigned encoding:4;   // OBJ_ENCODING_INT, EMBSTR, RAW (4 bits)
    unsigned lru:24;       // Thông tin LRU / LFU eviction (24 bits = 3 bytes)
    int refcount;          // Reference counter cho Memory Sharing (4 bytes)
    void *ptr;             // Con trỏ trỏ tới dữ liệu thực tế (8 bytes trên 64-bit OS)
}; // Tổng kích thước cố định: đúng 16 bytes.
```

Đối với kiểu dữ liệu String, Redis hỗ trợ 3 kiểu **Encoding** nội bộ:

1. **`OBJ_ENCODING_INT`**:
   - Áp dụng khi giá trị chuỗi là một số nguyên có thể biểu diễn trong kiểu `long` (64-bit integer, ví dụ từ lệnh `INCR`).
   - Redis không cấp phát SDS mà lưu trực tiếp giá trị số nguyên vào ngay chính con trỏ `void *ptr` (8 bytes). Kỹ thuật này triệt tiêu hoàn toàn chi phí cấp phát SDS trên Heap.
2. **`OBJ_ENCODING_EMBSTR`**:
   - Áp dụng khi chuỗi có độ dài $\le 44$ bytes (trên kiến trúc 64-bit).
   - Redis cấp phát `robj` (16 bytes) và `sdshdr8` (3 bytes header + $\le 44$ bytes dữ liệu + 1 null byte) trong **cùng 1 khối bộ nhớ liên tục duy nhất** (Contiguous Memory Chunk) có kích thước đúng 64 bytes.
   - **Lợi ích**: Chỉ gọi Memory Allocator (`jemalloc`) đúng 1 lần thay vì 2 lần; tận dụng tối đa CPU L1/L2 Cache Line (thường là 64 bytes) khi đọc dữ liệu.
3. **`OBJ_ENCODING_RAW`**:
   - Áp dụng khi chuỗi có độ dài $> 44$ bytes.
   - `robj` và SDS được cấp phát ở 2 vùng nhớ tách biệt trên Heap, `ptr` trỏ tới khối bộ nhớ SDS. Khi giải phóng hoặc mở rộng chuỗi, Redis phải gọi allocator 2 lần độc lập.

## Related Notes

- Vì sao một key String nhỏ vẫn tốn 60-90 bytes RAM: [[Redis_String_Metadata_Overhead]]
- Cơ chế nén nhiều giá trị nhỏ vào một String: [[Redis_Bitfield_and_Bitmap_Mechanics]]
- Ví dụ dùng nén bit cho điểm danh và dữ liệu game: [[Redis_Bitfield_Use_Cases]]
- Lý do encoding phải rẻ trên event loop đơn luồng: [[Redis_Single_Threaded_Event_Loop_Architecture]]
- [[Redis_Roadmap]]
- [[000_Tech_MOC]]
