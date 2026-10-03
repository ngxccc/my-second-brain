---
noteId: 1790761561131
---

Trong ASP.NET Core, Conventional Routing và Attribute Routing khác nhau như thế nào về cơ chế và phạm vi áp dụng?

---

- **Conventional Routing**: Định nghĩa tập trung tại Program.cs qua mẫu URL chung (`{controller}/{action}/{id?}`); phù hợp cho ứng dụng MVC Razor View đồng nhất.
- **Attribute Routing**: Gắn trực tiếp `[Route]` và `[HttpGet]` lên Action; bắt buộc cho RESTful Web API để kiểm soát chính xác URI và HTTP verbs.

---

Extra: Nếu một Action vừa có Attribute Routing vừa nằm trong vùng Conventional Routing, Attribute Routing luôn ghi đè và chiếm quyền ưu tiên tuyệt đối.
