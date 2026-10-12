---
noteId: 1791469635769
---

Trong Laravel Routing, cú pháp khai báo Optional Parameter là gì và yêu cầu bắt buộc ở Controller/Closure là gì?

---

- **Cú pháp định tuyến:** Đặt dấu chấm hỏi sau tên tham số trong URL pattern: `Route::get('/users/{name?}', ...)`.
- **Ràng buộc xử lý:** Biến nhận trong hàm callback hoặc Controller bắt buộc phải có giá trị mặc định: `function ($name = 'Guest')`.

---

Extra: Nếu không đặt giá trị mặc định cho tham số trong hàm, PHP sẽ ném lỗi `ArgumentCountError` khi người dùng truy cập URL không kèm tham số.
