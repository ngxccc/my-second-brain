---
noteId: 1791448209980
---

Lỗi 'There is already an open DataReader associated with this Command' trong EF Core xuất hiện do đâu và cách khắc phục?

---

- **Nguyên nhân:** Chạy nhiều truy vấn `async` đồng thời trên **CÙNG MỘT instance `DbContext`** (ví dụ `Task.WhenAll(q1, q2)`). `DbContext` **không an toàn đa luồng (non-thread-safe)** và chỉ mở 1 luồng đọc DataReader tại một thời điểm.
- **Cách khắc phục:**
  - Chạy tuần tự bằng cách `await` từng truy vấn một.
  - Bật tính năng Multiple Active Result Sets trong connection string (`MultipleActiveResultSets=True`).

---

Extra: Không bao giờ chia sẻ 1 instance `DbContext` giữa nhiều tác vụ chạy ngầm song song.
