---
noteId: 1785979181686
---

Passing concrete structs to `any` (`interface{}`) causes ~~interface boxing~~, allocating heap memory.

---

Extra:

- Meaning: The runtime process of wrapping a concrete value inside an interface value, which copies the data to heap memory unless small enough to inline.
- Pronunciation: /ˈɪn.tɚ.feɪs ˈbɑːk.sɪŋ/
- Collocations:
  - `cost of interface boxing` (chi phí của việc đóng gói interface)
  - `interface boxing allocation` (cấp phát bộ nhớ do interface boxing)
  - `avoid unnecessary interface boxing` (tránh đóng gói interface không cần thiết)
