---
noteId: 1785979182236
---

What is the core meaning and primary technical collocation of **slice header fields**?

---

- **Meaning**: The three constituent structural components of Go's `reflect.SliceHeader`: `Data` (pointer to array), `Len` (current element count), and `Cap` (total capacity)...
- **Primary Collocation**: `modify slice header fields` / `examine slice header fields`

---

Extra:
- Pronunciation: /ˈslaɪs ˌhed.ɚ ˈfiːldz/
- Type: Noun Phrase
- Collocations:
  - `modify slice header fields` (chỉnh sửa các trường của slice header)
  - `examine slice header fields` (xem xét các trường của slice header)
  - `the three slice header fields` (ba trường của slice header: ptr, len, cap)
- Examples:
  - _Understanding the three **slice header fields** clarifies why reallocations disconnect sub-slice views._
  - _When `append` exceeds capacity, Go allocates a new array and updates the **slice header fields**._
