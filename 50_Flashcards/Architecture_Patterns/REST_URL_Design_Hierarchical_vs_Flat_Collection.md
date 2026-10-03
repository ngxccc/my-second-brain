---
noteId: 1790738820445
---

Khi thiết kế RESTful API cho quan hệ nhiều-nhiều, tại sao Flat Collection kèm Query Filter linh hoạt hơn Hierarchical URL?

---

- **Lọc đa chiều**: URL phẳng (`/shows?movieId=X&cinemaId=Y`) cho phép tìm kiếm theo bất kỳ thuộc tính nào, trong khi URL phân cấp (`/movies/{id}/shows`) khóa cứng theo quan hệ cha-con.

---

Extra: Dùng Path Parameter (`/parents/:id/children`) khi tài nguyên con bị sở hữu độc quyền; dùng Query Parameter (`?filter=val`) để tìm kiếm, lọc và phân trang.
