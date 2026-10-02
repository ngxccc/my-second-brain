---
noteId: 1790958170387
---

Khi thực thi lệnh `SCAN 0 COUNT 100`, Redis có đảm bảo trả về chính xác đúng 100 phần tử không? Giải thích cơ chế bên dưới.

---

- **Không bao giờ đảm bảo:** Tham số `COUNT` trong Redis chỉ là một **gợi ý (Hint)** về lượng công việc mà Engine nên quét qua, hoàn toàn không phải là mệnh đề `LIMIT` như trong SQL.
- **Cơ chế Hash Table Buckets:** Redis duyệt qua các Slots trong bảng băm nội bộ (`dict.c`). Tùy thuộc vào số lượng Keys rơi vào các Buckets được duyệt, kết quả trả về có thể là $0$, vài chục, hoặc hơn $100$ phần tử trong một lần gọi.
- **Quy tắc lặp Cursor:** Client bắt buộc phải tiếp tục gọi `SCAN` với giá trị con trỏ (`cursor`) mới được trả về cho đến khi con trỏ quay trở lại giá trị `0` thì toàn bộ tập dữ liệu mới được duyệt hết.

---

Extra: Cơ chế Hint tương tự cũng áp dụng cho `HSCAN`, `SSCAN` và `ZSCAN` khi duyệt qua các cấu trúc dữ liệu tập hợp lớn.
