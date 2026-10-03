---
noteId: 1789565951238
---

Nguyên lý cốt lõi của PostgreSQL MVCC giúp lệnh READ không bao giờ khóa lệnh WRITE là gì?

---

- **Multi-Version Tuples**: Mỗi lệnh `UPDATE`/`INSERT` tạo tuple mới độc lập thay vì ghi đè lên đĩa.
- **Snapshot Isolation**: Lệnh `SELECT` đọc snapshot quá khứ tại thời điểm giao dịch bắt đầu nên không chặn Ghi.

---

Extra: Hệ quả vật lý là sinh ra Dead Tuples chiếm dụng đĩa, đòi hỏi tiến trình ngầm AutoVacuum phải quét dọn định kỳ.
