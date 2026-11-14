---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Vì delivery là at-least-once, consumer phải tự chống trùng bằng khoá dedupe ở tầng lưu trữ, không dựa vào job id của broker."
---

# Idempotent Consumer Mechanism

## TL;DR

- **Bản chất**: Consumer phải giả định mỗi message có thể đến nhiều lần, nên nó cần một khoá dedupe được enforce ở tầng lưu trữ, không phải một câu `if` trong code.
- **Mục đích**: Làm cho việc xử lý lại một message trở thành no-op, để at-least-once delivery trở nên vô hại.
- **Điểm mấu chốt**: `jobId` của BullMQ chỉ chống **enqueue trùng**, không chống **xử lý trùng**. Retry của worker vẫn chạy lại toàn bộ handler.

## Core Concept

- Nguồn gốc của trùng lặp, tất cả đều bình thường:
  - Broker redeliver khi worker chết trước khi ack.
  - Relay outbox gửi lại vì lần trước không chắc đã thành công.
  - Retry theo exponential backoff sau lỗi tạm thời.
  - Hai instance cùng nhận message do visibility timeout hết hạn.
- Cơ chế chuẩn: bảng `processed_events(event_id, handler)` với **unique constraint** trên `(event_id, handler)`. Chèn vào cùng transaction với side effect. Conflict nghĩa là đã xử lý, bỏ qua.
- Phải có `handler` trong khoá: cùng một event có thể cần hai consumer khác nhau xử lý, và cả hai đều cần chống trùng riêng.
- Với side effect **ngoài database** (gửi email, gọi API thanh toán, upload file): không thể đưa vào transaction. Phải dùng idempotency key của chính provider đó, hoặc chấp nhận "at-least-once" ở biên và thiết kế để trùng là vô hại.
- Thứ tự: nếu cần xử lý theo thứ tự, dedupe theo `event_id` là chưa đủ; phải thêm sequence number và kiểm tra monotonic.

## Practical Implementation

```sql
CREATE TABLE processed_events (
  event_id    UUID NOT NULL,
  handler     TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, handler)
);
```

```ts
async function handle(job: Job) {
  const { eventId } = job.data;

  await db.transaction(async (tx) => {
    // Chen dedupe key truoc, trong cung transaction voi side effect
    const inserted = await tx.insert(processedEvents)
      .values({ eventId, handler: "send-confirmation" })
      .onConflictDoNothing()
      .returning();

    if (inserted.length === 0) return; // da xu ly, no-op

    await tx.update(orders).set({ notified: true }).where(eq(orders.id, ...));
  });

  // Side effect ngoai DB: phai co idempotency key cua provider
  await mailer.send({ idempotencyKey: eventId, ... });
}
```

## Điều kiện sai

- **"Đã đặt `jobId` là chống trùng"** - sai, và là lỗi phổ biến nhất. `jobId` chặn hai job cùng id tồn tại trong queue, nhưng khi job fail và retry, handler vẫn chạy lại.
- **"Kiểm tra `if (alreadyProcessed) return` là đủ"** - sai. Check-then-act: hai worker cùng đọc `false` rồi cùng xử lý. Cần unique constraint.
- **"Ghi dedupe key sau khi xử lý xong"** - sai. Crash giữa chừng thì message đã xử lý mà không có dấu vết, lần sau xử lý lại.
- **"Một bảng dedupe dùng chung cho mọi handler"** - sai. Thiếu `handler` trong khoá làm consumer thứ hai bị bỏ qua nhầm.
- **"Consumer idempotent thì không cần retry"** - sai. Đây là hai thứ khác nhau: idempotent làm retry an toàn, retry làm hệ thống chịu lỗi tạm thời.
- **"Message nào cũng cần dedupe"** - sai. Message thuần đọc hoặc đã tự nhiên idempotent thì dedupe chỉ thêm chi phí.

## Related Notes

- [[Outbox_Pattern]] - nguồn sinh ra phần lớn message trùng
- [[Idempotency_Key_and_Replay_Safety]] - cùng nguyên lý ở tầng HTTP
- [[Database_Transaction_Isolation_and_MVCC]] - vì sao check-then-act vẫn race
- [[Redis_Redlock]] - khi nào cần lock thay vì dedupe
