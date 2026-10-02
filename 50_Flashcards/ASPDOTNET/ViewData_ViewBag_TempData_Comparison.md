---
noteId: 1790761562030
---

So sánh `ViewData`, `ViewBag` và `TempData` trong ASP.NET Core về cơ chế dữ liệu và vòng đời?

---

- **`ViewData`:** Dictionary kiểu `ViewDataDictionary<string, object>`; yêu cầu ép kiểu (type-casting); sống trong 1 HTTP request hiện tại.
- **`ViewBag`:** Dynamic wrapper bọc quanh `ViewData`; không cần ép kiểu tường minh; sống trong 1 HTTP request hiện tại.
- **`TempData`:** Lưu trữ bằng Session/Cookie ngầm; tồn tại qua một bước chuyển hướng **Redirect (PRG Pattern)** và tự động bị hủy sau khi được đọc 1 lần.

---

Extra: Nếu muốn đọc dữ liệu trong `TempData` mà không làm nó bị đánh dấu xóa ở request kế tiếp, sử dụng phương thức `TempData.Peek(key)` hoặc `TempData.Keep(key)`.
