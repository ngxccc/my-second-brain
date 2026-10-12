---
noteId: 1785938348463
---

The Go compiler performs ~~escape analysis~~ to place variables on the Stack whenever their lifetime is bounded.

---

Extra:

- Meaning: A compile-time compiler optimization technique that determines whether the pointer reference to a variable escapes outside its declaring function scope (phân tí...
- Pronunciation: /ɪˈskeɪp əˌnæl.ə.sɪs/
- Collocations:
  - `run escape analysis` (chạy phân tích thoát biến)
  - `escape analysis compiler flag` (cờ biên dịch kiểm tra escape analysis, ví dụ -gcflags='-m')
  - `escape to the heap` (thoát ra bộ nhớ Heap)
