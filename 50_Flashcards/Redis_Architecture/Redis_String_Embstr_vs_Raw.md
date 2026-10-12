---
noteId: 1791101391630
---

Trong Redis String, điểm khác biệt kiến trúc cốt lõi giữa encoding `EMBSTR` và `RAW` là gì?

---

- **`EMBSTR`**: Gom `robj` (16 bytes) và SDS header + buffer vào đúng 1 khối nhớ liên tục duy nhất (64 bytes), chỉ gọi allocator 1 lần và tối ưu CPU Cache Line.
- **`RAW`**: Cấp phát `robj` và SDS ở 2 vùng nhớ tách biệt trên Heap, tốn 2 lần gọi memory allocator độc lập.

---

Extra: Ngưỡng chuyển đổi là chuỗi $\le 44$ bytes (trên 64-bit OS). Khi chuỗi vượt quá 44 bytes hoặc bị biến đổi (append làm tăng độ dài), Redis tự động nâng cấp từ `EMBSTR` lên `RAW`.
