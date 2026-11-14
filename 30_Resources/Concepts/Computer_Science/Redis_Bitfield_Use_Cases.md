---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Hai ví dụ dùng Redis BITFIELD/BITMAP: điểm danh 30 ngày và lưu level, gold cho 1 triệu người chơi theo bucket."
---

# Ứng dụng BITFIELD và BITMAP: Điểm danh và Dữ liệu Game

## TL;DR

- **Bản chất**: Hai mẫu lệnh cho hai dạng dữ liệu nhỏ: trạng thái có/không theo ngày, và các chỉ số số nguyên như cấp độ và lượng vàng.
- **Mục đích**: Có mẫu lệnh chạy được để áp cho bài toán đếm trạng thái và lưu chỉ số nhỏ.
- **Điểm mấu chốt**: Gom 1.000 người chơi vào một key bucket biến 2 triệu String keys thành 1.000 key, và cú pháp `#<index>` tự nhân offset theo độ rộng kiểu.

## Mô hình Hóa Hệ thống Điểm danh 30 ngày (Bitmap)

Lưu trạng thái điểm danh trong 30 ngày của người dùng `user:42`:

```redis
# Ngày 1 (bit 0): Điểm danh
SETBIT user:42:checkin:202610 0 1

# Ngày 2 (bit 1): Vắng mặt (mặc định 0)

# Ngày 3 (bit 2): Điểm danh
SETBIT user:42:checkin:202610 2 1

# Đếm tổng số ngày đã điểm danh trong tháng
BITCOUNT user:42:checkin:202610
# Trả về: 2
```

## Quản lý Cấp độ (Level) và Vàng (Gold) bằng `BITFIELD`

Một game cần lưu trữ dữ liệu của 1 triệu người chơi:

- `level`: 8-bit không dấu (`u8`, giá trị từ 0 đến 255).
- `gold`: 16-bit không dấu (`u16`, giá trị từ 0 đến 65535).

Thay vì tạo 2 triệu String keys, gom nhóm 1,000 người chơi vào một key `game:bucket:0`:

```redis
# Khởi tạo người chơi ID 0: level = 5, gold = 1000
# level u8 ở offset 0, gold u16 ở offset 8
BITFIELD game:bucket:0 SET u8 0 5 SET u16 8 1000

# Người chơi ID 0 nhặt được 200 vàng, chặn tràn số ở 65535 (SAT)
BITFIELD game:bucket:0 OVERFLOW SAT INCRBY u16 8 200

# Đọc đồng thời level và gold của người chơi ID 0 trong 1 lượt Atomic:
BITFIELD game:bucket:0 GET u8 0 GET u16 8
# Trả về: 1) (integer) 5
#        2) (integer) 1200
```

## Related Notes

- Cơ chế, cú pháp offset và ba chế độ `OVERFLOW`: [[Redis_Bitfield_and_Bitmap_Mechanics]]
- Vì sao không dùng key String riêng cho từng giá trị: [[Redis_String_Metadata_Overhead]]
- Cấu trúc SDS bên dưới các key này: [[Redis_String_SDS_and_Object_Encodings]]
- [[Redis_Roadmap]]
