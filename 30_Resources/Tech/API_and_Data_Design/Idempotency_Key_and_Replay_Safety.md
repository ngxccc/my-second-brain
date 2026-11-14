---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Idempotency không phải thuộc tính của request mà là state phải lưu ở server, cùng transaction với side effect."
---

# Idempotency Key and Replay Safety

## TL;DR

- **Bản chất**: Cơ chế: server ghi cặp (key, kết quả) vào bảng riêng; lần retry sau đọc lại kết quả cũ thay vì chạy lại nghiệp vụ.
- **Mục đích**: Làm cho endpoint `POST` chịu được retry của client, timeout của load balancer, và redelivery của message queue mà không tạo side effect lần hai.
- **Điểm mấu chốt**: Key phải được chèn **trong cùng transaction** với side effect. Lưu key trước hoặc sau đều tạo ra cửa sổ crash làm hỏng tính idempotent.

## Core Concept

- Hệ thống thực tế chỉ đảm bảo **at-least-once** delivery. Client retry sau timeout là hành vi bình thường, không phải lỗi. Vì vậy server phải tự chống trùng.
- Cơ chế chuẩn:
  1. Client sinh key (UUID) cho **một thao tác logic**, dùng lại đúng key đó cho mọi lần retry.
  2. Server lưu `(key, user_id, request_fingerprint, response, status)` với **unique constraint** trên `(key, user_id)`.
  3. Chèn bản ghi key trong cùng transaction với side effect nghiệp vụ.
  4. Nếu chèn key bị conflict: trả lại response đã lưu, hoặc 409 nếu đang xử lý.
- **Ba trạng thái** cần phân biệt: `new`, `in_progress`, `completed`. Thiếu `in_progress` thì hai request đồng thời cùng key sẽ cùng chạy side effect.
- **Request fingerprint**: hash của body. Cùng key nhưng body khác là lỗi client, phải trả 422 chứ không im lặng trả kết quả cũ.
- **TTL**: key chỉ cần sống lâu hơn cửa sổ retry lớn nhất. Với hầu hết hệ thống, 24 giờ là đủ; giữ mãi là tăng chi phí vô ích.
- Phân biệt với **HTTP method idempotent tự nhiên**: `PUT` và `DELETE` đã idempotent theo định nghĩa vì thay thế cùng một resource. `POST` tạo resource nên cần key.

## Practical Implementation

```sql
-- Bang luu key, unique constraint la co che chong trung that su
CREATE TABLE idempotency_keys (
  key         UUID NOT NULL,
  user_id     UUID NOT NULL,
  fingerprint TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'in_progress',
  response    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
```

```ts
// Dung unique constraint, khong dung SELECT roi INSERT (check-then-act van race)
await db.transaction(async (tx) => {
  await tx.insert(idempotencyKeys).values({ key, userId, fingerprint });
  const order = await tx.insert(orders).values(payload).returning();
  await tx
    .update(idempotencyKeys)
    .set({ status: "completed", response: order })
    .where(
      and(eq(idempotencyKeys.key, key), eq(idempotencyKeys.userId, userId)),
    );
});
// Conflict tren PRIMARY KEY = da xu ly, doc lai response va tra ve.
```

## Điều kiện sai

- **"Đã kiểm tra trạng thái trước khi insert nên an toàn"** - sai. Đó là check-then-act: hai request cùng đọc `not_exists` rồi cùng insert. Chỉ unique constraint hoặc lock mới chặn được.
- **"Client gửi key là đủ"** - sai. Server không lưu response thì retry sau timeout sẽ nhận 409 thay vì kết quả, và client không phân biệt được "đã xong" với "đang chạy".
- **"Để server sinh key"** - sai. Mỗi lần retry server sinh key mới, nên không chống trùng được gì.
- **"Ghi key sau khi side effect xong"** - sai. Crash giữa hai bước làm side effect đã xảy ra mà không có key, retry sẽ nhân đôi.
- **"Dùng key làm khóa duy nhất cho cả hệ thống"** - sai. Key phải scope theo user, nếu không một client có thể chặn key của client khác.
- **"Idempotent nghĩa là chỉ trả cùng status code"** - sai. Phải trả cùng **kết quả nghiệp vụ**, nếu không client không reconcile được.

## Related Notes

- [[Idempotent_Consumer_Mechanism]] - cùng nguyên lý nhưng áp cho message consumer thay vì HTTP
- [[Database_Transaction_Isolation_and_MVCC]] - tại sao check-then-act vẫn race dưới READ COMMITTED
- [[Outbox_Pattern]] - ghép idempotency với dual-write để không mất hoặc nhân đôi sự kiện
