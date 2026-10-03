---
noteId: 1790774286880
---

Quy tắc chọn lựa giữa Partial View và View Component là gì, và khi nào Partial View thất bại?

---

- **Quy tắc chọn lựa**: Partial View dùng khi UI phụ thuộc dữ liệu có sẵn từ trang cha; View Component dùng khi UI cần tự độc lập lấy dữ liệu từ DB/Service.
- **Thất bại của Partial View**: Dùng cho widget xuất hiện ở 20 trang (như Menu danh mục) ép 20 Action phải truyền dữ liệu qua ViewBag, quên truyền sẽ sập trang.

---

Extra: View Component là một Mini Controller có method InvokeAsync riêng, giải quyết triệt để sự phụ thuộc dữ liệu vào Controller cha.
