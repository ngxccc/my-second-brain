---
noteId: 1791469634942
---

Trong Anonymous Blade Component, biến `$slot` mặc định và Named Slot (`<x-slot:header>`) hoạt động như thế nào?

---

- **Default `$slot`:** Tiếp nhận toàn bộ nội dung HTML không nằm trong named slot được chèn trực tiếp giữa hai thẻ đóng mở component.
- **Named Slot:** Cho phép tiêm nội dung vào các vị trí cụ thể định trước trong component thông qua cú pháp `<x-slot:name>...</x-slot:name>`.

---

Extra: Component file lưu tại `resources/views/components/card.blade.php` được gọi ngoài view qua thẻ tag `<x-card>`.
