---
noteId: 1785979184636
---

A ~~nil slice~~ consumes zero heap allocation and is preferred when returning empty results from functions.

---

Extra:

- Meaning: A slice initialized with no backing array (`ptr = nil`, `len = 0`, `cap = 0`), which evaluates equal to `nil` in Go (slice rỗng chưa cấp phát bộ nhớ).
- Pronunciation: /ˈnɪl ˌslaɪs/
- Collocations:
  - `check for a nil slice`
  - `nil slice vs empty slice`
  - `return a nil slice`
