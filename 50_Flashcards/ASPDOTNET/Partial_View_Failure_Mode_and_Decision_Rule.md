---
noteId: 1790774286880
---

Quy tắc chọn lựa giữa Partial View và View Component là gì, và trường hợp nào Partial View thất bại hoàn toàn?

---

- **Quy tắc chọn lựa 1 dòng:**
  - **Partial View:** Dùng khi UI **phụ thuộc 100% vào dữ liệu có sẵn** từ trang cha (ví dụ: Card hiển thị sản phẩm trong vòng lặp `foreach`).
  - **View Component:** Dùng khi UI cần **tự độc lập lấy dữ liệu** từ Database/Service và dùng ở nhiều trang (ví dụ: Menu chuyên mục, Widget giỏ hàng trên Header).
- **Thất bại của Partial View:** Nếu dùng Partial View cho Menu chuyên mục xuất hiện ở 20 trang, lập trình viên bị ép phải vào CẢ 20 Controller Action gõ `db.Categories.ToList()` truyền qua `ViewBag`. Chỉ cần 1 Action quên truyền là sập trang (`NullReferenceException`).

---

Extra: View Component là một "Mini Controller" độc lập có class C# riêng (`InvokeAsync`), giải quyết triệt để vấn đề phụ thuộc dữ liệu của trang cha.
