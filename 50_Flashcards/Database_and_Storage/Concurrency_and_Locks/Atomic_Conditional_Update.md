---
noteId: 1789565951188
---

Trong bài toán Flash Sale trừ tồn kho hàng nghìn request/giây, làm thế nào để trừ kho an toàn tuyệt đối mà KHÔNG cần mở Transaction `BEGIN...COMMIT` và KHÔNG cần dùng `FOR UPDATE`?

---

Sử dụng kỹ thuật **Atomic Conditional Update** (Cập nhật nguyên tử có điều kiện):

```sql
UPDATE products
SET stock = stock - 1
WHERE id = 101 AND stock >= 1;
```

Bản thân mỗi câu lệnh `UPDATE` đơn lẻ trong Storage Engine đã là một thao tác nguyên tử (Indivisible Operation). Kiểm tra số dòng bị ảnh hưởng (`affected rows`):

- `1`: Trừ thành công.
- `0`: Đã hết hàng (Fail-fast ngay lập tức).

---

Extra: Giải phóng Database Connection tức thì, không giữ khóa dài trên Connection Pool, thông lượng (Throughput) cao hơn gấp 5 - 10 lần so với `FOR UPDATE`.
