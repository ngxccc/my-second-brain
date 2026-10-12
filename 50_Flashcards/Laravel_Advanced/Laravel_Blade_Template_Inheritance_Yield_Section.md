---
noteId: 1791469635017
---

Trong cơ chế kế thừa giao diện của Blade, `@yield('content')` ở Master Layout phối hợp với `@section('content')` ở Child View như thế nào?

---

- **`@yield` (Placeholder):** Định vị một khoảng trống chờ nội dung tại Layout cha (`layouts/app.blade.php`).
- **`@section` (Injector):** View con kế thừa bằng `@extends` và tiêm nội dung thực tế vào đúng vị trí placeholder tương ứng.

---

Extra: Nếu muốn kế thừa nội dung mặc định của layout cha thay vì ghi đè hoàn toàn, View con gọi thêm directive `@parent` bên trong `@section`.
