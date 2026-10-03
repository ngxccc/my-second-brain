---
noteId: 1789565951188
---

Trong bài toán trừ tồn kho Flash Sale tải cao, kỹ thuật nào giúp trừ kho an toàn mà không cần mở Transaction và không dùng `FOR UPDATE`?

---

- **Atomic Conditional Update**: Dùng câu lệnh `UPDATE ... WHERE id = :id AND stock >= 1` và kiểm tra số dòng bị ảnh hưởng (`affected rows` = 1 là thành công, 0 là hết hàng).

---

Extra: Câu lệnh UPDATE đơn lẻ trong Storage Engine vốn mang tính nguyên tử. Giải phóng Connection tức thì, không giữ lock dài trên Connection Pool, throughput cao hơn 5-10 lần so với `FOR UPDATE`.
