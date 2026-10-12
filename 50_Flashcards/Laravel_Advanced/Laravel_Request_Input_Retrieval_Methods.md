---
noteId: 1791469635642
---

Sự khác biệt về bảo mật và chức năng giữa `$request->only()` và `$request->except()` khi lấy dữ liệu từ Request là gì?

---

- **`$request->only([...])` (Whitelist):** Chỉ trích xuất đúng danh sách các trường được chỉ định, chặn đứng các trường dư thừa không mong muốn.
- **`$request->except([...])` (Blacklist):** Lấy toàn bộ dữ liệu ngoại trừ danh sách trường bị loại bỏ, tiềm ẩn rủi ro nhận trường dữ liệu ngoài ý muốn.

---

Extra: Tương tự như Mass Assignment trong Eloquent, lập trình viên nên ưu tiên Whitelist approach (`only()` hoặc form request `validated()`).
