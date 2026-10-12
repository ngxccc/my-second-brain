---
noteId: 1791101391579
---

Điểm khác biệt cốt lõi giữa `BITMAP` và `BITFIELD` trong Redis là gì?

---

- **`BITMAP`**: Thao tác bit đơn lẻ (0 hoặc 1) trên mảng byte của String thông qua các lệnh như `SETBIT`, `GETBIT`.
- **`BITFIELD`**: Đọc, ghi và tính toán số học trên các số nguyên có độ rộng tùy ý (Arbitrary-width Integers, từ `u1` đến `u63` / `i1` đến `i64`) được nén liên tiếp trong cùng 1 Key.

---

Extra: `BITFIELD` hỗ trợ các phép toán con lồng nhau (`GET`, `SET`, `INCRBY`) trong cùng 1 command atomic duy nhất và cho phép cấu hình kiểm soát tràn số qua `OVERFLOW WRAP|SAT|FAIL`.
