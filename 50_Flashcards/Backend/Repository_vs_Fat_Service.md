---
noteId: 1783153909297
---

What is the primary difference in how Business Logic interacts with the Database in Repository Pattern vs Fat Service (Direct ORM)?

---

In Repository Pattern, the Service interacts with a clean Interface (abstraction) while implementation details are hidden in Infrastructure. In Fat Service, the Service directly queries the database using ORM instances (e.g. db.select().from(users)...) to reduce boilerplate.
