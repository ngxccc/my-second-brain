---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Correctness của distributed lock phải được enforce ở tầng lưu trữ bằng token tăng đơn điệu, không phải ở tầng lock."
---

# Fencing Token Correctness Requirement

## TL;DR

- **Bản chất**: Fencing token là số thứ tự tăng đơn điệu, cấp kèm mỗi lần acquire lock, và **tầng lưu trữ từ chối** mọi ghi có token nhỏ hơn token lớn nhất đã thấy.
- **Mục đích**: Biến lock từ "giảm xác suất" thành "an toàn kể cả khi hai owner cùng tồn tại", bằng cách để nơi ghi dữ liệu làm trọng tài.
- **Điểm mấu chốt**: Lock không bao giờ cấp được correctness. Correctness chỉ có thể enforce ở nơi dữ liệu được ghi.

## Core Concept

- Khi owner cũ bị pause lâu hơn TTL, nó vẫn tin mình giữ lock. Fencing token khiến lần ghi của nó bị từ chối thay vì ghi đè.
- Yêu cầu của token:
  - **Đơn điệu tăng**, không cần liên tục. Nguồn cấp phải đáng tin (Redis `INCR`, database sequence, hoặc chính tầng lưu trữ).
  - So sánh được bằng thứ tự toàn phần. **UUID không dùng được** vì không có thứ tự.
  - **Không dùng timestamp** làm token: clock skew làm thứ tự sai.
- Điều kiện áp dụng: mọi thao tác ghi dữ liệu được bảo vệ phải **kèm** token và bị kiểm tra trong cùng statement hoặc cùng transaction.
- Hệ quả quan trọng: nếu tầng lưu trữ đã tự enforce được invariant (unique constraint, `WHERE version = ?`, `UPDATE ... WHERE stock >= 1`), thì **không cần lock** cho correctness. Lock trở thành tối ưu hiệu năng, không phải điều kiện đúng.

## Practical Implementation

```sql
-- Moi lan acquire lock cap mot token tang dan
-- (day la so thu tu cua lan acquire, khong phai version cua row)
CREATE TABLE resource_guard (
  resource_id UUID PRIMARY KEY,
  last_token  BIGINT NOT NULL DEFAULT 0
);

-- Ghi du lieu chi thanh cong khi token moi hon token da thay
UPDATE resource_guard
SET last_token = $1
WHERE resource_id = $2 AND last_token < $1;  -- 0 row = bi tu choi, khong ghi du lieu

-- Sau do moi ghi du lieu nghiep vu, cung transaction
```

```text
Owner A: token 33  -> ghi thanh cong
Owner A bi pause
Owner B: token 34  -> ghi thanh cong, last_token = 34
Owner A tinh day: token 33 -> WHERE 34 < 33 false -> bi tu choi
```

Trong nhiều hệ thống, unique constraint đã là một dạng fencing tự nhiên: `INSERT` trùng ghế sẽ fail ở tầng index, không cần lock nào cả.

## Điều kiện sai

- **"Đã có lock thì không cần token"** - sai. Lock có TTL không đảm bảo mutual exclusion tại thời điểm ghi.
- **"Dùng timestamp làm fencing token"** - sai. NTP nhảy làm token giảm, và hai máy có thể cùng timestamp.
- **"Dùng UUID làm token"** - sai. Không so sánh thứ tự được nên không từ chối được owner cũ.
- **"Kiểm tra token ở tầng ứng dụng trước khi ghi"** - sai. Đó lại là check-then-act. Phải kiểm tra trong cùng statement hoặc cùng transaction với lần ghi.
- **"Fencing chỉ dành cho giao dịch tài chính"** - sai. Mọi invariant có thể bị hai writer vi phạm đều cần nó, kể cả cấp phát ID hay chọn một bản ghi duy nhất.
- **"Có fencing rồi thì lock không cần nữa"** - đúng một nửa. Lock vẫn hữu ích để giảm contention và tránh làm việc vô ích, nhưng không còn là điều kiện đúng.

## Related Notes

- [[Distributed_Lock_Failure_Modes]] - lý do tồn tại của fencing
- [[Redis_Redlock_Quorum_Mechanics]] - tầng lock phía trên
- [[Atomic_Conditional_Update]] - dạng fencing đơn giản nhất ở tầng row
- [[Postgres_Select_For_Update_Pessimistic_Locking]] - giải pháp khi chỉ có một database
