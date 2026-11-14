---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Isolation level là danh sách anomaly bị loại trừ, không phải thang độ an toàn; transaction một mình không loại trừ race giữa read và write."
---

# Database Transaction Isolation and MVCC

## TL;DR

- **Bản chất**: Isolation level là **tập anomaly được loại trừ**, không phải "mức độ an toàn tăng dần". Mỗi mức trả giá bằng throughput và tỉ lệ abort.
- **Mục đích**: Chọn đúng mức cho từng luồng nghiệp vụ, và biết khi nào phải thêm lock, unique constraint, hoặc atomic update thay vì tin vào isolation.
- **Điểm mấu chốt**: Transaction chỉ đảm bảo all-or-nothing. Nó **không** đảm bảo loại trừ giữa hai transaction cùng đọc rồi cùng ghi.

## Core Concept

Các anomaly cần phân biệt:

- **Dirty read**: đọc dữ liệu chưa commit.
- **Non-repeatable read**: đọc cùng một row hai lần trong một transaction, ra hai giá trị khác nhau.
- **Phantom read**: cùng một query hai lần, ra tập row khác nhau.
- **Lost update**: hai transaction cùng read-modify-write, một cái bị ghi đè mất.
- **Write skew**: hai transaction đọc cùng một tập dữ liệu, mỗi cái ghi một row khác nhau, và tổng thể vi phạm invariant. Đây là anomaly nguy hiểm nhất vì nó **không** xảy ra ở mức row.

PostgreSQL thực tế:

- **READ COMMITTED** (mặc định): mỗi **statement** thấy snapshot tại thời điểm statement bắt đầu. Non-repeatable read và phantom read đều có thể xảy ra.
- **REPEATABLE READ**: snapshot tại statement đầu tiên của transaction, giữ nguyên đến hết. Chặn non-repeatable và phantom. Nhưng vẫn là snapshot isolation, nên **write skew vẫn xảy ra**.
- **SERIALIZABLE**: snapshot isolation cộng Serialization Snapshot Isolation (SSI). Phát hiện cấu trúc nguy hiểm và abort một transaction với lỗi `40001`. Đúng nhưng phải có retry logic ở tầng ứng dụng.

MVCC đổi gì:

- Reader không block writer và ngược lại; mỗi transaction đọc một phiên bản row phù hợp với snapshot của nó.
- Hệ quả: **đọc không thấy dữ liệu mới**, nên logic "đọc rồi quyết định" có thể quyết định trên trạng thái cũ.
- `SELECT ... FOR UPDATE` lấy row lock và đọc bản mới nhất, nên nó tuần tự hóa các transaction tranh chấp **cùng row đó**.
- `FOR UPDATE` **không** bảo vệ invariant trải trên nhiều row (ví dụ "tổng các ghế đã đặt không vượt sức chứa") vì hai transaction có thể lock hai row khác nhau.

## Practical Implementation

```sql
-- Lost update: cach sai (read-modify-write o tang ung dung)
SELECT stock FROM products WHERE id = 1;      -- 10
-- ung dung tinh 10 - 1 = 9
UPDATE products SET stock = 9 WHERE id = 1;   -- hai request chen nhau -> mat 1 lan tru

-- Cach dung 1: atomic update, khong doc truoc
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock >= 1;

-- Cach dung 2: optimistic, phat hien conflict
UPDATE products SET stock = stock - 1, version = version + 1
WHERE id = 1 AND version = 7;  -- 0 row affected = ai do da sua, retry

-- Cach dung 3: pessimistic, giu row trong transaction
BEGIN;
SELECT stock FROM products WHERE id = 1 FOR UPDATE;
UPDATE products SET stock = stock - 1 WHERE id = 1;
COMMIT;
```

```sql
-- Write skew: ca hai deu thay 2 bac si dang truc, ca hai deu xin nghi
-- READ COMMITTED va REPEATABLE READ deu cho phep ca hai commit
BEGIN ISOLATION LEVEL SERIALIZABLE; -- mot cai se bi abort 40001
```

## Điều kiện sai

- **"Đã bọc transaction là an toàn"** - sai. Đây là hiểu sai tốn tiền nhất. Transaction không loại trừ race giữa read và write; nó chỉ đảm bảo rollback toàn bộ.
- **"REPEATABLE READ là đủ, chỉ SERIALIZABLE mới chậm"** - đúng về hiệu năng, sai về correctness: write skew vẫn xảy ra ở REPEATABLE READ.
- **"`FOR UPDATE` một row là bảo vệ được invariant"** - sai khi invariant trải trên nhiều row. Cần unique constraint, predicate lock, hoặc SERIALIZABLE.
- **"MVCC nên không cần lock"** - sai. MVCC tách read khỏi write, nhưng write-write conflict vẫn cần lock hoặc abort.
- **"Isolation level cao làm chậm mọi query"** - không chính xác. Cái giá nằm ở tỉ lệ abort và chi phí phát hiện conflict, không phải ở mọi câu SELECT.
- **"Đặt SERIALIZABLE là xong"** - sai nếu ứng dụng không có retry cho `40001`. Không retry thì tỉ lệ lỗi tăng vọt khi tải cao.

## Related Notes

- [[Postgres_MVCC_Tuple_Visibility]] - cơ chế visibility của tuple bên dưới snapshot
- [[Postgres_Select_For_Update_Pessimistic_Locking]] - chi tiết row lock
- [[Atomic_Conditional_Update]] - atomic update thay cho read-modify-write
- [[Idempotency_Key_and_Replay_Safety]] - tại sao check-then-act vẫn race dù đã có transaction
