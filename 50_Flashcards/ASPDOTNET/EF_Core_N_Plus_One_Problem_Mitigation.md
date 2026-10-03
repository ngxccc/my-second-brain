---
noteId: 1790774286783
---

Lỗi N+1 Query trong EF Core phát sinh thế nào và phương án khắc phục tối ưu nhất là gì?

---

- **Bản chất phát sinh**: Truy vấn 1 danh sách cha (1 query), sau đó vòng lặp duyệt từng phần tử lại bắn tiếp query con (N queries), gây nghẽn mạng và sập DB.
- **Khắc phục tối ưu**: Dùng Eager Loading (`.Include(p => p.Category)`) để gộp 1 câu `LEFT JOIN`, hoặc dùng Projection (`.Select(p => new Dto { ... })`) chỉ kéo cột cần thiết.

---

Extra: Tuyệt đối không bao giờ gọi truy vấn DB bên trong vòng lặp foreach. Projection với .Select() là phương án tối ưu I/O nhất vì loại bỏ dữ liệu thừa.
