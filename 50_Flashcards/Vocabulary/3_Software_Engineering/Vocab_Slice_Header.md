---
noteId: 1785938347673
---

In Go, a ~~slice header~~ contains three words: a pointer to the underlying array, length, and capacity.

---

Extra:

- Meaning: The internal 24-byte data structure representing a slice in Go, consisting of a pointer to the backing array, an integer length, and an integer capacity.
- Pronunciation: /ˈslaɪs ˌhed.ɚ/
- Collocations:
  - `pass a slice header by value` (truyền slice header theo giá trị)
  - `inspect the slice header` (kiểm tra slice header qua gói reflect)
  - `slice header memory footprint` (kích thước bộ nhớ của slice header, 24 bytes trên kiến trúc 64-bit)
