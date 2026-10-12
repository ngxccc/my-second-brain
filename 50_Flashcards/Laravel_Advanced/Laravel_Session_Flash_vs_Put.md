---
noteId: 1791469635844
---

Sự khác biệt về vòng đời lưu trữ dữ liệu giữa `session()->flash()` và `session()->put()` trong Laravel là gì?

---

- **`session()->flash('key', $val)`:** Chỉ tồn tại duy nhất cho Request kế tiếp (Next Request), sau đó framework tự động dọn dẹp và hủy bỏ.
- **`session()->put('key', $val)`:** Lưu trữ trạng thái bền vững trong Session cho đến khi người dùng đóng trình duyệt hoặc bị xóa thủ công.

---

Extra: Nếu muốn kéo dài thời gian tồn tại của Flash data thêm một request nữa, sử dụng lệnh `session()->reflash()` hoặc `session()->keep(['key'])`.
