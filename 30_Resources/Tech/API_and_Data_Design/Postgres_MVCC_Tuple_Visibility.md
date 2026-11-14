---
title: Postgres MVCC Tuple Visibility
tags: [type/concept, status/permanent]
date: 2026-09-16
description: "Cơ chế quản lý truy cập đồng thời đa phiên bản (MVCC), vòng đời Tuple và khả năng hiển thị dữ liệu (Visibility) trong PostgreSQL."
---

# Postgres MVCC Tuple Visibility

## TL;DR

- **Bản chất**: PostgreSQL không sửa đè (Out-of-place Update): `UPDATE`/`DELETE` ghi Tuple phiên bản mới và đánh dấu hết hạn Tuple cũ bằng Transaction ID.
- **Mục đích**: Hiện thực hóa triết lý "người đọc không chặn người ghi, người ghi không chặn người đọc", cho phép hàng nghìn truy vấn đồng thời độ trễ tối thiểu.
- **Điểm mấu chốt**: Visibility của một Tuple xác định bằng cách so Transaction ID của truy vấn với hai trường ẩn `xmin` (ID tạo) và `xmax` (ID hủy) trong Header.

---

## 1. Cấu trúc vật lý của một Tuple Header

Mỗi hàng dữ liệu (Tuple) lưu trữ trên các trang đĩa (Heap Page 8KB) của PostgreSQL đều chứa một phần Header với các trường điều khiển trạng thái đồng thời:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TUPLE HEADER                              │
├──────────────┬──────────────┬──────────────────┬───────────────────────┤
│    xmin      │    xmax      │  t_ctid (vị trí) │  t_infomask (flags)   │
│  (4 bytes)   │  (4 bytes)   │    (6 bytes)     │       (2 bytes)       │
├──────────────┴──────────────┴──────────────────┴───────────────────────┤
│                             USER DATA PAYLOAD                          │
│                   id = 1, name = 'Product A', price = 100              │
└────────────────────────────────────────────────────────────────────────┘
```

- **`xmin` (Creation XID)**: Transaction ID của giao dịch đã `INSERT` hoặc sinh ra phiên bản Tuple này.
- **`xmax` (Expiry XID / Lock XID)**:
  - Nếu Tuple còn hiệu lực: $xmax = 0$.
  - Nếu Tuple bị xóa/cập nhật: $xmax$ lưu Transaction ID của giao dịch thực hiện hành động đó.
  - Nếu hàng bị khóa (`SELECT FOR UPDATE`): $xmax$ tạm thời lưu Transaction ID của giao dịch giữ khóa.
- **`t_ctid` (Current Tuple ID)**: con trỏ địa chỉ vật lý `(page_number, tuple_index)`. Khi Tuple bị `UPDATE`, `t_ctid` của bản cũ trỏ tới vị trí bản mới sinh ra.

---

## 2. Vòng đời của Tuple qua INSERT, UPDATE và DELETE

```
[ INSERT ] ──► Ghi Tuple 1: [xmin = 100, xmax = 0, ctid = (0,1)]
                  │
[ UPDATE ] ──► Không sửa đè! Thực hiện 2 hành động:
                  1. Cập nhật Tuple 1: [xmin = 100, xmax = 101, ctid = (0,2)]  (Tuple cũ hết hạn)
                  2. Chèn mới Tuple 2: [xmin = 101, xmax = 0,   ctid = (0,2)]  (Tuple mới hiệu lực)
                  │
[ DELETE ] ──► Cập nhật Tuple 2: [xmin = 101, xmax = 102, ctid = (0,2)]        (Đánh dấu đã bị xóa)
```

1. **Khi `INSERT`**:
   - Engine tạo Tuple mới với `xmin = XID_hiện_tại`, `xmax = 0`.
2. **Khi `UPDATE`**:
   - Tuple cũ được gán `xmax = XID_hiện_tại`.
   - Tuple mới được tạo ra ở trang đĩa khác với `xmin = XID_hiện_tại` và `xmax = 0`.
   - Cả hai phiên bản cùng tồn tại trên đĩa cho đến khi được thu hồi.
3. **Khi `DELETE`**:
   - Engine không giải phóng bộ nhớ ngay lập tức mà chỉ cập nhật `xmax = XID_hiện_tại` trên Tuple mục tiêu.

---

## 3. Quy tắc kiểm tra tính hiển thị (Visibility Rules)

Khi một câu lệnh `SELECT` thực thi, nó chụp một **Snapshot** của cơ sở dữ liệu tại thời điểm đó. Snapshot chứa:

- `xmin`: Transaction ID nhỏ nhất vẫn đang hoạt động (Active).
- `xmax`: Transaction ID đầu tiên chưa được cấp phát.
- `xip_list`: Danh sách các Transaction ID đang chạy đồng thời tại thời điểm chụp snapshot.

```
                    ĐIỀU KIỆN TUPLE HIỂN THỊ TRONG SNAPSHOT
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
       1. ĐÃ ĐƯỢC TẠO CHƯA?                          2. ĐÃ BỊ HỦY CHƯA?
  • Tuple xmin đã COMMIT?                       • Tuple xmax = 0? (Chưa ai hủy)
  • xmin < Snapshot.xmin?                                     HOẶC
  • xmin KHÔNG nằm trong Snapshot.xip_list?     • xmax chưa COMMIT hoặc bị ROLLBACK?
                                                              HOẶC
                                                • xmax > Snapshot.xmax?
```

Một Tuple hiển thị với câu lệnh `SELECT` khi và chỉ khi:

1. Giao dịch tạo ra nó (`xmin`) đã hoàn tất `COMMIT` trước khi Snapshot được tạo.
2. Giao dịch xóa/sửa nó (`xmax`) chưa xảy ra, đã bị `ROLLBACK`, hoặc được thực thi bởi một giao dịch chưa `COMMIT` tại thời điểm chụp Snapshot.

Nhờ cơ chế này, câu lệnh `SELECT` đọc trực tiếp phiên bản hợp lệ của Tuple mà không cần đợi các câu lệnh `UPDATE` hay `DELETE` khác nhả khóa.

---

## 4. Hệ quả vật lý: Dead Tuples và vai trò của VACUUM

Cơ chế "Không sửa đè" cho khả năng song song cao, nhưng đánh đổi bằng việc tích lũy bản ghi rác trên đĩa:

- **Dead Tuples (Hàng chết)**: Tuple có `xmax` thuộc giao dịch đã `COMMIT` và không còn Snapshot nào nhìn thấy.
- **Table Bloat (Phình bảng)**: không gian chứa Dead Tuples không tự co lại; nếu bảng nhận nhiều `UPDATE/DELETE`, kích thước tệp vật lý tăng mất kiểm soát.
- **Cơ chế VACUUM / AutoVacuum**:
  1. Quét qua các Heap Page để xác định Dead Tuples.
  2. Xóa các mục trỏ đến Dead Tuples trong B+ Tree Index.
  3. Đánh dấu không gian Dead Tuples là "vùng trống khả dụng" (Free Space Map) để `INSERT`/`UPDATE` sau tái sử dụng.

---

## 5. Truy vấn quan sát thực tế trong PostgreSQL

Ta có thể quan sát trực tiếp các trường ẩn `xmin`, `xmax`, và `ctid` bằng SQL:

```sql
-- Tạo bảng thử nghiệm
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT
);

-- 1. Thao tác INSERT
INSERT INTO items (name) VALUES ('Laptop');
SELECT ctid, xmin, xmax, id, name FROM items;
-- Kết quả: ctid = (0,1), xmin = 501, xmax = 0

-- 2. Thao tác UPDATE
UPDATE items SET name = 'Laptop Pro' WHERE id = 1;
SELECT ctid, xmin, xmax, id, name FROM items;
-- Kết quả: ctid = (0,2), xmin = 502, xmax = 0
-- (Tuple cũ ở ctid (0,1) đã trở thành Dead Tuple với xmax = 502)
```

---

## Related Notes

- Khóa hàng tương tác với xmax: [[Postgres_Select_For_Update_Pessimistic_Locking]]
- Cách tránh phụ thuộc visibility khi ghi: [[Atomic_Conditional_Update]]
- Index phải hiểu Dead Tuple để quét: [[Index_BPlusTree]]
- Thiết kế index dưới MVCC: [[Database_Indexing_Guidelines]]
- [[000_Tech_MOC]]
