---
noteId: 1792942753736
---

What is the syntactic rule for **Copula Be as a Predicate Bridge (Chống lỗi Zero-Copula)** in technical descriptions?

---

- **Predicate Binary Parser**: Mọi vị ngữ bắt buộc là `DO` hoặc `BE`; tính từ không thể tự thân làm vị ngữ độc lập.
- **No Zero-Copula**: Bắt buộc có copula bridge (`is/are`) trước tính từ (❌ `The database fast` $\rightarrow$ ✅ `The database is fast`).

---

Extra:

- Usage Cues:
  - ❌ `This architecture very scalable and reliable.`
  - ✅ `This architecture is very scalable and reliable.`
  - ❌ `The Redis cache fast, but the payload large.`
  - ✅ `The Redis cache is fast, but the payload is large.`
- Technical Examples:
  - _`The database is fast, but network latency degrades overall throughput.`_
  - _`Microservices are decoupled, making deployment predictable.`_
