---
noteId: 1785979181661
---

What is the core meaning and primary technical collocation of **index out of range**?

---

- **Meaning**: A runtime panic or error triggered when a program attempts to read or write an element at an index that exceeds array bounds (lỗi chỉ mục vượt ngoài phạm vi).
- **Primary Collocation**: `panic: index out of range` / `prevent index out of range errors`

---

Extra:
- Pronunciation: /ˈɪn.deks aʊt əv ˈreɪndʒ/
- Type: Noun Phrase
- Collocations:
  - `panic: index out of range` (lỗi panic do chỉ số vượt mảng)
  - `prevent index out of range errors` (ngăn ngừa lỗi index out of range)
  - `bounds checking for index out of range` (kiểm tra biên để tránh index out of range)
- Examples:
  - _Accessing element `slice[len(slice)]` triggers an immediate runtime panic: **index out of range**._
  - _Always check slice length before direct indexing to prevent **index out of range** panics in production._
