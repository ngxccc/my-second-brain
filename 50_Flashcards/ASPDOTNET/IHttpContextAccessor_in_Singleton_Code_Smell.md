---
noteId: 1791448210011
---

Tại sao việc Inject `IHttpContextAccessor` vào một dịch vụ Singleton bị coi là một Code Smell nguy hiểm?

---

- **Bản chất nguy hiểm:** `HttpContext` có vòng đời theo request (`Scoped`) và không an toàn đa luồng. Khi service `Singleton` sống suốt vòng đời app truy cập vào nó, dễ dẫn đến **Race Condition**.
- **Hậu quả thực tế:** Luồng này đọc nhầm dữ liệu user của request khác, hoặc truy cập vào một context đã bị hủy (`Disposed`) khi request trước đó vừa kết thúc.

---

Extra: Chỉ inject `IHttpContextAccessor` vào các service `Scoped` hoặc `Transient`. Tránh dùng trong `Singleton`.
