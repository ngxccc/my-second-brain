---
tags: [type/concept, status/permanent]
date: 2026-06-27
description: "Ghi side effect nghiệp vụ và bản ghi sự kiện trong cùng một transaction, rồi để một relay đọc sau, loại bỏ dual-write."
---

# Outbox Pattern

## TL;DR

- **Bản chất**: Thay vì ghi database và gửi message ở hai nơi, ghi **cả hai** vào database trong cùng một transaction; một relay đọc bảng outbox sau và đẩy message đi.
- **Mục đích**: Loại bỏ dual-write - trạng thái không thể vừa commit database vừa đảm bảo message đã gửi, vì hai hệ thống không chia sẻ transaction.
- **Điểm mấu chốt**: Outbox đổi "gửi message ngay" thành "cam kết sẽ gửi", nên delivery là **at-least-once**, và consumer bắt buộc phải idempotent.

## Core Concept

- **Dual-write là gì**: một luồng nghiệp vụ cần hai thao tác trên hai hệ thống khác nhau (ví dụ ghi `orders` vào PostgreSQL và `add()` vào BullMQ). Không có transaction chung, nên luôn tồn tại thứ tự làm hỏng dữ liệu:
  - Ghi DB trước, gửi message thất bại: user đã mua nhưng không có thông báo, và không có cách nào biết để gửi lại.
  - Gửi message trước, ghi DB rollback: user nhận email xác nhận cho đơn hàng không tồn tại.
- **Cơ chế**: bảng `outbox_events` nằm trong cùng database, nên nó tham gia được transaction. Ghi nghiệp vụ và ghi event là một atomic unit.
- **Relay**: tiến trình nền poll các bản ghi `PENDING`, đẩy lên broker, rồi đánh dấu `PROCESSED`. Relay được phép chạy lại - đó là lý do at-least-once.
- **Cái giá**: tăng độ trễ (từ mili giây thành chu kỳ poll), thêm một bảng phải dọn, và cần index cho query poll.
- **Khi nào không cần**: nếu message không quan trọng (analytics, log) hoặc nếu consumer đọc trực tiếp database thay vì qua broker.

## Practical Implementation

```sql
CREATE TABLE outbox_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT NOT NULL,
  payload      JSONB NOT NULL,
  status       TEXT NOT NULL DEFAULT 'PENDING', -- PENDING | PROCESSING | PROCESSED | FAILED
  attempts     INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Index cho query poll: equality truoc, sort sau
CREATE INDEX outbox_events_status_created_at_idx
  ON outbox_events (status, created_at);
```

```ts
// Ghi nghiep vu va event trong CUNG mot transaction
await db.transaction(async (tx) => {
  const order = await tx.insert(orders).values(payload).returning();
  await tx.insert(outboxEvents).values({
    eventType: "order.created",
    payload: { orderId: order[0].id },
  });
});
```

```sql
-- Relay phai dung SKIP LOCKED, neu khong nhieu instance se tranh lock
BEGIN;
SELECT id, event_type, payload
FROM outbox_events
WHERE status = 'PENDING'
ORDER BY created_at
LIMIT 20
FOR UPDATE SKIP LOCKED;

UPDATE outbox_events SET status = 'PROCESSING', attempts = attempts + 1
WHERE id = ANY($1);
COMMIT;
-- Sau do day len broker, roi danh dau PROCESSED hoac FAILED
```

## Điều kiện sai

- **"Outbox đảm bảo exactly-once"** - sai. Nó đảm bảo **at-least-once**. Trùng là bình thường, xử lý trùng là việc của consumer.
- **"Poll bằng `SELECT` thường là đủ"** - sai khi chạy nhiều instance: hai relay lấy cùng batch và gửi hai lần. Phải có `FOR UPDATE SKIP LOCKED` hoặc một cơ chế claim tương đương.
- **"Đánh dấu `PROCESSED` trước rồi mới publish"** - sai. Crash giữa hai bước làm event mất vĩnh viễn.
- **"Đánh dấu `PROCESSED` ngay sau khi gọi `add()`"** - sai. `add()` thành công không có nghĩa consumer đã xử lý; nhưng đây là đánh đổi chấp nhận được vì consumer phải idempotent.
- **"Outbox thay thế được idempotency"** - sai. Hai thứ giải hai bài toán khác nhau và phải dùng cùng nhau.
- **"Dùng outbox cho mọi message"** - sai. Thêm một bảng, một relay, và một loại sự cố mới; chỉ dùng khi message mang ý nghĩa nghiệp vụ.

## Related Notes

- [[Idempotent_Consumer_Mechanism]] - phía consumer, bắt buộc đi kèm outbox
- [[Idempotency_Key_and_Replay_Safety]] - cùng nguyên lý ở tầng HTTP
- [[Database_Transaction_Isolation_and_MVCC]] - nền tảng transaction phía sau
- [[Clean_Architecture]] - nơi đặt service điều phối transaction
