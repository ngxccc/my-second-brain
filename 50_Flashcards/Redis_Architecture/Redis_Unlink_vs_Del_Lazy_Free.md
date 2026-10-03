---
noteId: 1790950898738
---

Điểm khác biệt cốt lõi giữa `DEL` và `UNLINK` khi giải phóng một Large Key (>10,000 phần tử) trong Redis là gì?

---

- **`DEL` (Synchronous)**: Thu hồi RAM đồng bộ trên Main Thread ($O(M)$), làm treo Event Loop cho đến khi giải phóng xong.
- **`UNLINK` (Lazy Free)**: Tách Key khỏi Keyspace tức thì ($O(1)$), đẩy việc thu hồi RAM cho Background Bio-Thread (`bio.c`).

---

Extra: Với scalar key nhỏ (< 64 bytes), chi phí dispatch sang bio-thread khiến `UNLINK` không nhanh hơn `DEL`, nhưng với Collection lớn `UNLINK` là bắt buộc. Toàn bộ DB có thể xóa async qua `FLUSHALL ASYNC`.
