---
noteId: 1790738820413
---

Giải pháp tối ưu I/O nhất để giải quyết bài toán N+1 truy vấn quan hệ 1-N giữa Parent và Children là gì?

---

- **Batch `IN (...)` + In-Memory Map**: Gom toàn bộ ID cha để truy vấn con trong 1 câu `SELECT ... WHERE parent_id IN (...)`, rồi dùng Hash Map trên RAM gom nhóm con về cha với chi phí $O(1)$.

---

Extra: Tránh vòng lặp $2N+1$ queries gây nghẽn Connection Pool; tránh `LEFT JOIN` lớn gây hiệu ứng Cartesian Product nhân bản dữ liệu trên mạng. Đây là nguyên lý của DataLoader.
