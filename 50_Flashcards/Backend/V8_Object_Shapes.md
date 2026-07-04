---
noteId: 1783153909380
---

In V8, dynamic object modification and property deletion force objects to transition from optimized static offsets using ~~Hidden Classes _also known as Shapes_~~ into slow Hash Map lookups known as ~~Dictionary Mode~~.
