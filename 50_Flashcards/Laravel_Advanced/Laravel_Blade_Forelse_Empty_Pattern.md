---
noteId: 1791469634969
---

Lợi thế kỹ thuật của directive `@forelse ... @empty ... @endforelse` trong Blade so với vòng lặp `@foreach` truyền thống là gì?

---

- **Xử lý tập dữ liệu rỗng:** Tự động lặp qua Collection nếu có phần tử, và hiển thị khối giao diện dự phòng `@empty` nếu mảng rỗng.
- **Loại bỏ Boilerplate:** Loại bỏ hoàn toàn khối kiểm tra điều kiện lồng nhau `@if(count($items) > 0) ... @else ... @endif`.

---

Extra: `@forelse` hoạt động tối ưu cả với PHP array thuần túy lẫn đối tượng `Illuminate\Support\Collection`.
