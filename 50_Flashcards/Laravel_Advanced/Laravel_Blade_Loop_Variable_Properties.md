---
noteId: 1791469634992
---

Biến nội tại `$loop` trong vòng lặp `@foreach` của Blade cung cấp những thuộc tính quan trọng nào để kiểm soát trạng thái lặp?

---

- **Vị trí & Chỉ số:** `$loop->first` / `$loop->last` (kiểm tra phần tử đầu/cuối), `$loop->index` (bắt đầu từ 0), `$loop->iteration` (bắt đầu từ 1).
- **Quy mô & Chẵn lẻ:** `$loop->count` (tổng số phần tử), `$loop->even` / `$loop->odd` (phục vụ tô màu dòng bảng xen kẽ).

---

Extra: Khi sử dụng vòng lặp lồng nhau, thuộc tính `$loop->parent` cho phép truy cập trạng thái vòng lặp của cấp cha bên ngoài.
