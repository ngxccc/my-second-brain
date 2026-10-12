---
noteId: 1791469635314
---

Sự khác biệt cốt lõi giữa hai phương thức `$model->relation()->attach()` và `sync()` trên quan hệ Nhiều - Nhiều (Many-to-Many) là gì?

---

- **`attach($ids)`:** Chỉ đơn thuần chèn thêm các ID mới vào bảng trung gian (Pivot Table) mà không kiểm tra trùng lặp hay xóa dữ liệu cũ.
- **`sync($ids)`:** Đồng bộ chính xác danh sách ID: tự động chèn ID mới, giữ nguyên ID đã có, và xóa bỏ các ID không nằm trong mảng truyền vào.

---

Extra: `sync()` cực kỳ phổ biến khi cập nhật danh sách Tags hoặc Roles của User trên giao diện checkbox của Form Update.
