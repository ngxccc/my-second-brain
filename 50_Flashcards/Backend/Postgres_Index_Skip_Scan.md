---
noteId: 1783153909247
---

In PostgreSQL 18+, what optimization allows a query filtering only on `col2` to still utilize a composite index `(col1, col2)`?

---

---

Index Skip Scan

---

Extra: The engine skips through the unique groups of `col1` to search `col2`. It is extremely fast for Low-Cardinality `col1` (e.g. status enums) but very slow for High-Cardinality `col1` (e.g. user_ids).
