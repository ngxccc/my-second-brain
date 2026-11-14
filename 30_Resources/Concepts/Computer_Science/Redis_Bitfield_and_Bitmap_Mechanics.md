---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Cơ chế `BITMAP` và `BITFIELD` trong Redis: định vị offset, số nguyên độ rộng tùy ý, ba chế độ `OVERFLOW`, và so sánh với String keys."
---

# Redis BITMAP và BITFIELD: Nén Nhiều Giá trị vào Một Key

## TL;DR

- **Bản chất**: `BITMAP` là các lệnh bit (`SETBIT`, `BITCOUNT`) chạy trên một String thường; `BITFIELD` mở rộng thành số nguyên độ rộng tùy ý (`u8`, `i16`) nén liền kề.
- **Mục đích**: Nhồi hàng triệu trạng thái nhỏ vào một key duy nhất, tiết kiệm hơn 90% RAM so với việc tạo key riêng cho từng giá trị.
- **Điểm mấu chốt**: Cả hai đều $O(1)$ nhờ dịch bit; `OVERFLOW` có ba chế độ `WRAP`, `SAT`, `FAIL` quyết định hành vi khi `INCRBY` vượt ngưỡng.

---

## Core Concept

### `BITMAP` Mechanics

`BITMAP` không phải là một Data Type độc lập trong Redis, mà là tập hợp các thao tác bit (`SETBIT`, `GETBIT`, `BITCOUNT`, `BITOP`) thực thi trực tiếp trên một Redis String thông thường:

- Khi gọi `SETBIT key 1000000 1`, Redis tự động cấp phát một chuỗi SDS có độ dài đủ chứa bit thứ 1,000,000:
  $$\text{Required Bytes} = \lceil \frac{1000000 + 1}{8} \rceil = 125,001 \text{ bytes} \approx 122 \text{ KB}$$
- Toàn bộ các bit từ 0 đến 999,999 mặc định mang giá trị `0`.
- **Độ phức tạp**: Thao tác `SETBIT` và `GETBIT` đạt $O(1)$ vì việc định vị offset diễn ra qua phép toán dịch bit:
  $$\text{Byte Index} = \lfloor \frac{\text{Offset}}{8} \rfloor, \quad \text{Bit Index} = 7 - (\text{Offset} \pmod 8)$$

### `BITFIELD` Mechanics

Trong khi `BITMAP` chỉ thao tác trên từng bit đơn lẻ (0 hoặc 1), lệnh `BITFIELD` cho phép đọc, ghi và thực hiện các phép toán số học tăng/giảm trên các **số nguyên có độ rộng tùy ý** (Arbitrary-width Integers) được nén liền kề trong cùng một String Key:

- Hỗ trợ số nguyên có dấu: `i1` đến `i64`.
- Hỗ trợ số nguyên không dấu: `u1` đến `u63`.
- Hỗ trợ các thao tác con trong cùng 1 lệnh Atomic:
  - `GET <type> <offset>`
  - `SET <type> <offset> <value>`
  - `INCRBY <type> <offset> <increment>`

#### Quy chuẩn Định vị Offset trong `BITFIELD`:

- **Bit Offset (`<offset>`)**: Số nguyên phẳng chỉ định chính xác vị trí bit bắt đầu (ví dụ: `0`, `8`, `16`).
- **Index Offset (`#<index>`)**: Tiền tố `#` bảo Redis tự động nhân `index` với độ rộng của kiểu dữ liệu. Ví dụ: Với kiểu `u4`, offset `#0` là bit 0, `#1` là bit 4, `#2` là bit 8.

#### Kiểm soát Tràn số (Overflow Control):

Lệnh `BITFIELD` tích hợp sẵn cờ `OVERFLOW` để kiểm soát hành vi số học khi thực hiện phép `INCRBY`:

1. **`WRAP` (Mặc định)**: Tràn số quay vòng (Mod arithmetic vòng quanh giá trị cực đại/cực tiểu).
2. **`SAT` (Saturation)**: Bão hòa. Khi vượt quá giá trị cực đại, giá trị giữ nguyên ở max; khi giảm dưới cực tiểu, giữ ở min. Rất hữu ích cho các bộ đếm giới hạn (Rate Limiter, cấp độ game).
3. **`FAIL`**: Thất bại. Từ chối thực hiện phép toán và trả về `nil` khi phát hiện tràn số.

### So sánh Kiến trúc: String Keys vs BITFIELD

| Tiêu chí                      | String Keys Độc lập (`SET key val`)             | BITFIELD / BITMAP (`BITFIELD key ...`)                          |
| :---------------------------- | :---------------------------------------------- | :-------------------------------------------------------------- |
| **Bản chất lưu trữ**          | 1 Dict Entry + 1 `robj` + 1 SDS cho mỗi giá trị | 1 Dict Entry duy nhất cho hàng triệu giá trị trong 1 SDS String |
| **Overhead Metadata**         | Cực lớn (~48–64 bytes overhead trên mỗi key)    | Cận biên bằng 0 (chỉ tốn dung lượng bit dữ liệu thuần túy)      |
| **RAM Footprint (10M Items)** | ~600 MB – 1 GB RAM                              | ~5 MB – 20 MB RAM (tùy bit-width)                               |
| **Time Complexity**           | $O(1)$                                          | $O(1)$ cho các bit truy vấn trực tiếp                           |
| **TTL từng phần tử**          | Hỗ trợ TTL riêng biệt trên từng Key             | Không hỗ trợ TTL từng bit (toàn bộ key dùng chung TTL)          |
| **Khả năng Sharding**         | Phân phối đều tự nhiên qua Redis Hash Slots     | Một Key lớn nằm trên 1 Slot (cần Sharding thủ công theo Bucket) |

## Related Notes

- Ví dụ lệnh chạy được cho điểm danh và dữ liệu game: [[Redis_Bitfield_Use_Cases]]
- Vì sao key String riêng lẻ đắt đỏ: [[Redis_String_Metadata_Overhead]]
- Cấu trúc SDS bên dưới mọi thao tác bit này: [[Redis_String_SDS_and_Object_Encodings]]
- [[Redis_Single_Threaded_Event_Loop_Architecture]] - Vì sao lệnh $O(N)$ trên key lớn là rủi ro riêng.
- [[Redis_Roadmap]]
