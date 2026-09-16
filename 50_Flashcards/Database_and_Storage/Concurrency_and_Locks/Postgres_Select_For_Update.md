---
noteId: 1789565951264
---

Khi 2 transaction cùng muốn đọc dữ liệu lên để tính toán nghiệp vụ trước khi cập nhật (Check-then-Act), mệnh đề nào trong PostgreSQL giúp khóa chặt hàng dữ liệu để ngăn ngừa Race Condition?

---

Mệnh đề **`SELECT ... FOR UPDATE`** (Pessimistic Locking).

PostgreSQL áp đặt Exclusive Row-level Lock lên các hàng thỏa mãn điều kiện. Các transaction khác chạy `FOR UPDATE` hoặc `UPDATE` trên cùng hàng đó bắt buộc phải chờ (Block) cho đến khi transaction giữ khóa `COMMIT` hoặc `ROLLBACK`.

---

Extra: Nếu câu lệnh `SELECT FOR UPDATE` lọc trên cột không có Index, Database Engine sẽ thực hiện **Full Table Scan** và khóa sạch toàn bộ tất cả các hàng trong bảng, làm nghẽn toàn bộ hệ thống.
