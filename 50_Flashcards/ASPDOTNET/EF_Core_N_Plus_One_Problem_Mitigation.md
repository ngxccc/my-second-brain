---
noteId: 1790774286783
---

Lỗi N+1 Query trong EF Core phát sinh thế nào và 2 cách giải quyết triệt để là gì?

---

- **Bản chất lỗi:** Truy vấn 1 danh sách cha $N$ phần tử (`1` query), sau đó duyệt `foreach` từng phần tử rồi lại gọi tiếp quan hệ con (`N` query riêng lẻ) -> Gửi tổng cộng $1 + N$ câu SQL xuống database gây nghẽn mạng và sập DB.
- **Hai cách giải quyết triệt để:**
  - **Eager Loading với `.Include()`:** `context.Products.Include(p => p.Category).ToListAsync()` -> EF Core sinh 1 câu SQL `LEFT JOIN` lấy cả cha lẫn con trong 1 lần gọi.
  - **Projection với `.Select()` (Tối ưu nhất):** `context.Products.Select(p => new Dto { Name = p.Name, Cat = p.Category.Name })` -> Chỉ kéo đúng các cột cần dùng, không thừa dữ liệu.

---

Extra: Không bao giờ duyệt `foreach` trên danh sách rồi gọi DB bên trong vòng lặp. Luôn nạp dữ liệu liên quan trước (Eager) hoặc map trực tiếp sang DTO.
