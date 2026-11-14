---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Chi phí RAM thực tế của một String key trong Redis: dictEntry, robj, SDS và padding của jemalloc, kèm phép tính cho 100 triệu key."
---

# Chi phí Metadata của String Key trong Redis

## TL;DR

- **Bản chất**: Một cặp key-value String tốn 60-90 bytes RAM: `dictEntry` 24 bytes, hai `robj` 16 bytes, SDS của key và value, cộng padding của `jemalloc`.
- **Mục đích**: Ước lượng dung lượng trước khi thiết kế key schema, thay vì chỉ đếm độ dài chuỗi dữ liệu.
- **Điểm mấu chốt**: 100 triệu cờ trạng thái lưu bằng String keys phẳng ngốn 6-9 GB RAM, cùng lượng dữ liệu đó ở dạng bit chỉ còn vài chục MB.

## Phân rã Chi phí

Khi lưu một cặp Key-Value String đơn giản:

```text
SET user:1000:status "active"
```

Lượng RAM thực tế bị chiếm dụng trong Redis không chỉ là 16 bytes ký tự mà bao gồm toàn bộ chuỗi mắt xích:

1. **`dictEntry`**: 1 con trỏ key + 1 con trỏ value + 1 con trỏ `next` trong Hash Table bucket = 24 bytes.
2. **Key Object**: `robj` (16 bytes) + SDS cho `"user:1000:status"` (~19 bytes).
3. **Value Object**: `robj` (16 bytes) + SDS cho `"active"` (~9 bytes).
4. **Allocator Padding (`jemalloc`)**: `jemalloc` cấp phát bộ nhớ theo các Size Classes cố định (8, 16, 32, 48, 64, 80, 96, 112, 128 bytes...). Mọi phần dư thừa không dùng hết đều trở thành Internal Fragmentation.

## Hệ quả

- Một cặp Key-Value chỉ chứa vài bytes ký tự có thể tiêu tốn thực tế từ **60 đến 90 bytes RAM**.
- Nếu lưu 100,000,000 cờ trạng thái người dùng bằng String Keys phẳng, hệ thống tiêu tốn từ **6 GB đến 9 GB RAM**.
- Cách thoát: gom các giá trị nhỏ vào một key duy nhất bằng [[Redis_Bitfield_and_Bitmap_Mechanics]].

## Related Notes

- Cấu trúc SDS và `robj` tạo ra chi phí này: [[Redis_String_SDS_and_Object_Encodings]]
- Cơ chế nén nhiều giá trị nhỏ vào một String: [[Redis_Bitfield_and_Bitmap_Mechanics]]
- Ví dụ dùng nén bit cho điểm danh và dữ liệu game: [[Redis_Bitfield_Use_Cases]]
- [[Heap_Memory_Size_Classes_and_Alignment]] - Cơ chế size class và alignment đứng sau padding của allocator.
- [[Redis_Roadmap]]
