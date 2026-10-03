---
noteId: 1785938347673
---

What is the core meaning and primary technical collocation of **slice header**?

---

- **Meaning**: The internal 24-byte data structure representing a slice in Go, consisting of a pointer to the backing array, an integer length, and an integer capacity (cấu tr...
- **Primary Collocation**: `pass a slice header by value` / `inspect the slice header`

---

Extra:
- Pronunciation: /ˈslaɪs ˌhed.ɚ/
- Type: Noun Phrase
- Collocations:
  - `pass a slice header by value` (truyền slice header theo giá trị)
  - `inspect the slice header` (kiểm tra slice header qua gói reflect)
  - `slice header memory footprint` (kích thước bộ nhớ của slice header, 24 bytes trên kiến trúc 64-bit)
- Examples:
  - _In Go, a **slice header** contains three words: a pointer to the underlying array, length, and capacity._
  - _Passing a slice to a function copies only its lightweight 24-byte **slice header**, not the underlying elements._
