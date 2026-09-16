---
noteId: 1786627528809
---

Hiểm họa Sub-slice Memory Leak trong Go xảy ra trong hoàn cảnh nào và cách khắc phục triệt để là gì?

---

**Hoàn cảnh**: Khi trích xuất một Sub-slice nhỏ từ một mảng dữ liệu khổng lồ (`small := hugeArray[:10]`) và lưu `small` vào một biến sống lâu dài (Long-lived struct / Cache / Global).

Con trỏ `small.Data` vẫn tham chiếu tới mảng ngầm khổng lồ, khiến Garbage Collector không thể giải phóng mảng lớn đó khỏi RAM.

---

Extra: Khắc phục bằng cách dùng `copy(cleanSlice, hugeArray[:10])` để cấp phát một mảng ngầm độc lập mới có kích thước vừa khít, cho phép Garbage Collector thu hồi ngay lập tức mảng gốc.
