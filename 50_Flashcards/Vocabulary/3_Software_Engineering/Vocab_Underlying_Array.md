---
noteId: 1785938347823
---

What is the core meaning and primary technical collocation of **underlying array**?

---

- **Meaning**: The actual contiguous fixed-length memory array that holds the elements referenced by one or more slice headers in Go (mảng nền tảng chứa dữ liệu thực của slice).
- **Primary Collocation**: `allocate an underlying array` / `share the same underlying array`

---

Extra:
- Pronunciation: /ˌʌn.dɚˈlaɪ.ɪŋ əˈreɪ/
- Type: Noun Phrase
- Collocations:
  - `allocate an underlying array` (cấp phát mảng nền tảng)
  - `share the same underlying array` (dùng chung mảng nền tảng)
  - `detach from the underlying array` (tách rời khỏi mảng nền tảng khi reallocation)
- Examples:
  - _Multiple slices created from the same source point to the identical **underlying array** in RAM._
  - _Mutating an element through one slice modifies the shared **underlying array** for all connected views._
