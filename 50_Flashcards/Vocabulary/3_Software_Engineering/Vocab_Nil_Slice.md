---
noteId: 1785979184636
---

What is the core meaning and primary technical collocation of **nil slice**?

---

- **Meaning**: A slice initialized with no backing array (`ptr = nil`, `len = 0`, `cap = 0`), which evaluates equal to `nil` in Go (slice rỗng chưa cấp phát bộ nhớ).
- **Primary Collocation**: `check for a nil slice` / `nil slice vs empty slice`

---

Extra:
- Pronunciation: /ˈnɪl ˌslaɪs/
- Type: Noun Phrase
- Collocations:
  - `check for a nil slice`
  - `nil slice vs empty slice`
  - `return a nil slice`
- Examples:
  - _A **nil slice** consumes zero heap allocation and is preferred when returning empty results from functions._
