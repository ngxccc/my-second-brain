---
noteId: 1790950898738
---

Sự khác biệt cốt lõi giữa `DEL` và `UNLINK` trong Redis khi giải phóng một Large Key (>10,000 phần tử) là gì?

---

- **Lệnh `DEL` (Synchronous):** Thu hồi bộ nhớ của toàn bộ phần tử trực tiếp trên luồng chính ($O(M)$), khiến Event Loop bị block cho đến khi hoàn tất phân bổ lại bộ nhớ.
- **Lệnh `UNLINK` (Asynchronous / Lazy Free):** Tách Key ra khỏi Keyspace ngay lập tức trong thời gian $O(1)$, sau đó chuyển giao con trỏ dữ liệu cho background thread (`bio.c` - `bio_lazy_free`) thu hồi bộ nhớ bất đồng bộ mà không cản trở các Client khác.

---

Extra: Kỹ thuật Lazy Freeing tương tự được áp dụng cho toàn bộ Database bằng lệnh `FLUSHALL ASYNC` hoặc `FLUSHDB ASYNC`.
