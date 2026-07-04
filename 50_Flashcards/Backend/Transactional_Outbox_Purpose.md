---
noteId: 1783153909330
---

What problem does the Transactional Outbox Pattern solve in microservices or distributed tasks?

---

It guarantees at-least-once event delivery by writing events to an `outbox_events` table within the same database transaction as the business operation, preventing data loss if the message broker (e.g. BullMQ) is offline.
