---
noteId: 1783153909180
---

In single-column B-Tree indexing, why is specifying the sort direction (ASC vs DESC) generally unnecessary?

---

Because B-Tree leaf nodes are doubly linked, allowing the database engine to perform both forward index scans and backward index scans with equivalent performance.
