---
noteId: 1783427811355
---

Why does 100% Statement Coverage not guarantee 100% Decision Coverage? Explain using a code structure.

---

Because decision branches without statements inside them (e.g., an `if` statement without an `else` block) can be skipped without affecting Statement Coverage. For example, if we only test the `True` branch of a simple `if` block, we execute all statements, but the `False` branch outcome remains untested.
