---
noteId: 1789565951214
---

Hiện tượng Deadlock (Khóa chết) giữa 2 Transaction xảy ra khi nào, và nguyên tắc bất biến (Invariant) nào giúp lập trình viên triệt tiêu Deadlock 100%?

---

**Hiện tượng**: Transaction 1 khóa tài nguyên A và chờ B; cùng lúc đó Transaction 2 khóa tài nguyên B và chờ A $\rightarrow$ Hai bên chờ nhau vĩnh viễn cho đến khi bị `deadlock_timeout` ép hủy (Abort).

**Giải pháp triệt để**: **Lock Ordering Invariant** (Luôn sắp xếp thứ tự khóa tài nguyên theo chiều tăng dần của ID):

```typescript
// Luôn sort ID trước khi SELECT FOR UPDATE
const [firstId, secondId] = [userA, userB].sort((a, b) => a - b);
await lock(firstId);
await lock(secondId);
```

---

Extra: "Muốn không bao giờ bị tắc đường, tất cả xe cộ phải đi chung một chiều" $\rightarrow$ Luôn sắp xếp ID trước khi Lock!
