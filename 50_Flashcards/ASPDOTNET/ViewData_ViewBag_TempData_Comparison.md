---
noteId: 1790761562030
---

So sánh cơ chế dữ liệu và vòng đời giữa ViewData/ViewBag và TempData trong ASP.NET Core?

---

- **ViewData & ViewBag**: Sống trong 1 HTTP request hiện tại; ViewData là Dictionary yêu cầu ép kiểu, ViewBag là dynamic wrapper bọc quanh ViewData.
- **TempData**: Lưu trữ ngầm qua Cookie/Session; tồn tại qua một bước chuyển hướng Redirect (PRG Pattern) và tự động bị hủy sau khi được đọc 1 lần.

---

Extra: Muốn đọc dữ liệu trong TempData mà không làm nó bị đánh dấu xóa ở request tiếp theo, sử dụng phương thức `TempData.Peek(key)` hoặc `TempData.Keep(key)`.
