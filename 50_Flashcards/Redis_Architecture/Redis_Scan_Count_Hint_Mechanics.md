---
noteId: 1790958170387
---

Tại sao tham số `COUNT` trong lệnh `SCAN` của Redis không đảm bảo trả về chính xác số lượng phần tử yêu cầu?

---

- **Hint trên Hash Buckets**: `COUNT` chỉ là gợi ý cho số lượng Hash Slots được duyệt trong bảng băm (`dict.c`), không phải mệnh đề `LIMIT` của SQL.

---

Extra: Tùy số lượng key trong các bucket được duyệt, một lần gọi `SCAN` có thể trả về 0, vài chục hoặc nhiều hơn `COUNT`. Client phải lặp lại với `cursor` mới cho đến khi cursor quay về `0`. Cơ chế tương tự với `HSCAN`, `SSCAN`.
