---
noteId: 1790738820413
---

So sánh tác động I/O của 3 phương án xử lý quan hệ 1-N (ví dụ: `Quote` và `QuoteItem`): (1) Vòng lặp queries lẻ, (2) Một câu `LEFT JOIN` khổng lồ, (3) Batch `IN (...)` kết hợp In-Memory Map?

---

1. **Vòng lặp lẻ ($2N+1$ queries):** Bùng nổ Network Round-trips, nghẽn Connection Pool và tăng vọt độ trễ hệ thống ($N=20 \rightarrow 41$ round-trips).
2. **Một câu `LEFT JOIN` lớn:** Gây hiệu ứng **Cartesian Product** (nhân bản dữ liệu bản ghi cha trên đường truyền mạng) và làm hỏng phân trang `LIMIT / OFFSET`.
3. **Batch `IN (...)` + In-Memory Map:** Cố định đúng 3 câu truy vấn song song (`Promise.all()`), dùng `Map` gom nhóm trên RAM với chi phí $O(1)$, triệt tiêu cả 2 điểm nghẽn trên.

---

Extra: Kỹ thuật này chính là nguyên lý hoạt động bên dưới của thư viện nổi tiếng **DataLoader** trong kiến trúc GraphQL/REST API.
