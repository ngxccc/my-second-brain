---
noteId: 1783153909146
---

When designing a composite index `(col1, col2)`, the index skip scan performance in Postgres 18+ is optimal when `col1` has:

_low cardinality_
