---
noteId: 1791469635364
---

Lỗi N+1 Query xảy ra do nguyên nhân nào và kỹ thuật Eager Loading `with()` giải quyết vấn đề đó ra sao?

---

- **Nguyên nhân N+1:** Truy cập quan hệ của từng đối tượng bên trong vòng lặp gây phát sinh 1 query lấy danh sách cha cộng thêm N queries lấy con.
- **Giải pháp Eager Loading:** Sử dụng `Model::with('relation')->get()` gom các khóa ngoại để nạp toàn bộ quan hệ con chỉ trong đúng 2 câu SQL queries.

---

Extra: Hai câu truy vấn: `SELECT * FROM categories;` và `SELECT * FROM products WHERE category_id IN (1, 2, ...);`.
