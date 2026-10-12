---
noteId: 1791469635717
---

Cú pháp chuyển hướng quay lại trang trước kèm giữ lại dữ liệu form vừa nhập và thông báo lỗi là gì?

---

- **Cú pháp chuyển hướng:** `return back()->withInput()->with('error', 'Nội dung thông báo');`.
- **Cơ chế lưu trữ:** Dữ liệu form được lưu tạm vào Flash Session; View hiển thị lại giá trị cũ qua helper `old('field_name')`.

---

Extra: `withInput()` nhận tham số tùy chọn `$request->except('password')` để tránh lưu lại thông tin nhạy cảm của người dùng vào session.
