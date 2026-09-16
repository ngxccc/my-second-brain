---
noteId: 1785979182236
---

What is the definition, type, pronunciation, and usage of the term **slice header fields**?

---

- **Type**: Noun Phrase
- **Pronunciation**: /ˈslaɪs ˌhed.ɚ ˈfiːldz/
- **Meaning**: The three constituent structural components of Go's `reflect.SliceHeader`: `Data` (pointer to array), `Len` (current element count), and `Cap` (total capacity) (các trường cấu thành slice header).
- **Collocations**:
  - `modify slice header fields` (chỉnh sửa các trường của slice header)
  - `examine slice header fields` (xem xét các trường của slice header)
  - `the three slice header fields` (ba trường của slice header: ptr, len, cap)
- **Concrete Examples**:
  - _Understanding the three **slice header fields** clarifies why reallocations disconnect sub-slice views._
  - _When `append` exceeds capacity, Go allocates a new array and updates the **slice header fields**._
