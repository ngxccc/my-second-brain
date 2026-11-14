---
tags: [type/method, status/active]
date: 2026-10-30
description: "Lộ trình học backend có thứ tự phụ thuộc: 70 mục chia 6 tầng, thang năng lực L1-L5, tách Now và Post-offer, kèm chuỗi điều kiện tiên quyết và sprint 43 ngày."
---

# Backend Learning Path

## TL;DR

- **Bản chất**: Đây là một đồ thị phụ thuộc gồm 70 mục chia 6 tầng, mỗi mục có mức năng lực tối thiểu để hiểu đúng và một điều kiện nghiệm thu viết dưới dạng "hiểu khi".
- **Mục đích**: Trả lời đúng hai câu hỏi: học cái gì trước, và biết mình đã hiểu chưa; thay cho việc cày dàn phẳng theo danh sách chủ đề.
- **Điểm mấu chốt**: Nhóm CORE ít mục nhưng gánh phần lớn năng lực review và debug; sprint hiện tại 32 mục Now khoảng 128-135 giờ, tức 9 tuần ở 15 giờ/tuần chứ không phải 5 tuần.

---

Lộ trình học **có thứ tự phụ thuộc** cho mục tiêu Backend Engineer. Ba file, ba vai trò: [[Backend_Knowledge_Checklist]] là bản đồ codebase (mô tả _cái gì có_, neo vào từng file trong `open-genset/backend`), [[Master_Backend_Engineering_SSOT]] giữ mục tiêu nghề nghiệp và tiến độ theo tuần, còn file này là đường đi.

Vault là bản canonical của lộ trình và checklist; repo `open-genset` chỉ giữ code và ADR.

---

## Core Concept: Thang mức năng lực

| Tag  | Tên       | Bằng chứng                                                                                 |
| ---- | --------- | ------------------------------------------------------------------------------------------ |
| `L0` | Chưa có   | Không hiểu câu mô tả dù đọc chậm. Đây là trạng thái của người học, không phải tag của item |
| `L1` | Nhận diện | Giải thích đúng trong 30 giây, không tra cứu                                               |
| `L2` | Tái tạo   | Viết lại được khi có mẫu hoặc docs mở                                                      |
| `L3` | Tự lực    | Viết từ đầu, không AI, 20-50 dòng                                                          |
| `L4` | Chẩn đoán | Nêu được 2 failure mode và cách phát hiện khi nó đang xảy ra                               |
| `L5` | Đánh đổi  | Nêu được khi nào **không** dùng, phương án thay thế, và cái giá                            |

Luật: tag là **mức tối thiểu để hiểu đúng và không dùng sai**. Lưỡng lự thì chọn mức thấp hơn.

## Luật sử dụng

1. Không học mục nào khi một mục `Cần trước` của nó còn `[ ]`.
2. Không tick một mục chỉ vì đã đọc xong tài liệu. Tick khi pass được dòng `Hiểu khi`.
3. `Sprint` có hai giá trị: `Now` (sprint hiện tại, 9 tuần) và `Post-offer` (sau khi có việc).
4. Mỗi mục ghi `Nguồn`: note có sẵn trong vault, hoặc `(cần viết)` nếu chưa có.

## Phân bổ thời gian và 6 tầng

- 70 mục / 6 tầng.
- 14 khái niệm `CORE` (18 entry) = 26% số mục, tạo phần lớn năng lực review và debug.
- Ước lượng toàn bộ: ~380 giờ. Ở 10 giờ/tuần: 9 tháng. Đây là bản đồ, không phải sprint.
- Sprint hiện tại: 32 entry `Now` (15 CORE + 17 nền tảng), ~128-135 giờ. Ở 15 giờ/tuần là 9 tuần, không phải 5. Ghi rõ để không tự lừa mình.

---

## Tầng 0 - Ngôn ngữ và runtime

Không có điều kiện vào. Nếu tầng này còn mục `[ ]`, mọi tầng phía dưới sẽ học vẹt.

> Mục 47, 65, 68, 69, 70 là nền tảng **framework/type của NestJS** (DI, decorators, RxJS, Zod composition, literal union). Thiếu chúng thì không đọc nổi tầng pipeline/DI của repo. Đã gộp vào gate Tầng 0 dù mục 47 nằm ở bảng Tầng 4.

| #   | Tag | Mục                                           | Cần trước | Hiểu khi                                                                                                                                       | Nguồn                                                                                                       | Sprint     |
| --- | --- | --------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | L2  | Scope, hoisting, block scope, TDZ             | -         | Giải thích hoisting và TDZ; chỉ ra 1 chỗ thứ tự eval module gây bug (vd. circular import); chỉ cần `đọc` được `var` — không viết mới           | (cần viết)                                                                                                  | Now        |
| 2   | L3  | **CORE** Closure                              | 1         | Viết `makeCounter()` 4 dòng không AI; giải thích vì sao biến sống sau khi hàm cha return                                                       | [[JS_Closure_Binding_Lifetime]]                                                                             | Now        |
| 3   | L2  | `this` binding                                | 2         | Phân biệt arrow vs regular function trong callback, không cần tra                                                                              | (cần viết)                                                                                                  | Post-offer |
| 4   | L3  | **CORE** Event loop: macrotask vs microtask   | 2         | Đoán đúng output của loop `var` + `setTimeout`; giải thích vì sao Promise chạy trước timer                                                     | [[JS_Event_Loop_Macrotask_vs_Microtask]]                                                                    | Now        |
| 5   | L3  | Promise semantics và error propagation        | 4         | Phân biệt `all`/`allSettled`/`race`/`any`; chỉ ra chỗ `async` nuốt lỗi                                                                         | (cần viết)                                                                                                  | Now        |
| 6   | L3  | **CORE** async/await pitfalls                 | 5         | Chỉ ra 3 chỗ `await` trong loop làm chậm gấp N và sửa bằng `Promise.all`; nêu 1 chỗ await-trong-loop KHÔNG được song song hoá (thứ tự lock)    | [[Backend_Knowledge_Checklist#Concurrency]] · `orders.service.ts:99`, `outbox.service.ts:119`               | Now        |
| 7   | L1  | ESM vs CJS                                    | -         | Giải thích vì sao `nestjs-pino` phải dynamic import dưới Bun                                                                                   | [[Backend_Knowledge_Checklist#Runtime]] · Bun Module Loader Workaround                                      | Now        |
| 8   | L2  | Immutability và reference equality            | 1         | Giải thích vì sao `{...a} !== a`, và khi nào điều đó gây bug                                                                                   | [[JS_Immer_Immutable_State]]                                                                                | Post-offer |
| 9   | L2  | TS erasure: type chỉ tồn tại lúc compile      | -         | Giải thích vì sao Zod là bắt buộc dù đã có TypeScript                                                                                          | (cần viết)                                                                                                  | Now        |
| 10  | L3  | **CORE** Numeric precision và money           | 1         | Nêu 3 cách biểu diễn tiền và cái sai của từng cách; vì sao `numeric(15,2)`                                                                     | (cần viết)                                                                                                  | Now        |
| 11  | L3  | Serialization round-trip                      | 9         | Chỉ ra `Date`, `BigInt`, `Decimal`, `undefined` bị JSON giết thế nào; giải thích vì sao cột thời gian phải là `timestamptz`                    | (cần viết)                                                                                                  | Post-offer |
| 12  | L2  | Module resolution và build output             | 7         | Giải thích `moduleResolution: bundler` khác `node` ở đâu                                                                                       | (cần viết)                                                                                                  | Post-offer |
| 62  | L3  | Error propagation ở tầng runtime              | 5, 6      | Chỉ ra 3 loại lỗi `try/catch` không bắt được; viết hook `process.on("unhandledRejection")` và nêu vì sao repo đang thiếu                       | [[Backend_Knowledge_Checklist#Runtime]] · (Gap) Process Unhandled Rejections                                | Now        |
| 63  | L2  | Bun runtime surface                           | 7         | Giải thích `--smol` đổi gì, preload của `bun test` chạy lúc nào, `bun test --bail` khác gì CI thường                                           | [[Backend_Knowledge_Checklist#Runtime]] · Bun Engine, Preload Setup Pipeline; [[JS_Runtimes_Bun_vs_NodeJS]] | Now        |
| 64  | L2  | Memory model: stack, heap, GC, leak           | 2         | Chỉ ra 2 chỗ closure hoặc listener còn giữ reference trong repo, và cách tìm bằng heap snapshot                                                | [[JS_Stack_vs_Heap_Memory]], [[JS_Generational_Garbage_Collection]], [[JS_Memory_Leaks_and_Mitigation]]     | Now        |
| 65  | L3  | Decorators và metadata reflection             | 9         | Giải thích `@Injectable()` và `reflector.get<T>()` đọc metadata từ đâu                                                                         | [[TS_Decorators]]                                                                                           | Now        |
| 66  | L3  | Type narrowing và discriminated union         | 9         | Viết 1 discriminated union kèm exhaustive check, và nêu vì sao `any` làm mất narrowing                                                         | (cần viết)                                                                                                  | Post-offer |
| 68  | L2  | RxJS Observable và toán tử pipeline           | 5         | Giải thích `next.handle().pipe(tap(), catchError())` chạy khi nào; vì sao interceptor phải trả `Observable`; `throwError` khác `throw` thế nào | (cần viết)                                                                                                  | Now        |
| 69  | L2  | Zod composition: transform, refine, pipe      | 9         | Phân biệt thứ tự chạy `transform` vs `refine` và vì sao cần `.pipe()`; đọc được `zSanitizedString`                                             | (cần viết)                                                                                                  | Now        |
| 70  | L2  | Literal union từ `as const` và `keyof typeof` | 9         | Viết 1 enum-as-const kèm derived union type; giải thích `(typeof X)[keyof typeof X]` khác `enum` ở đâu                                         | (cần viết)                                                                                                  | Now        |

---

## Tầng 1 - Giao thức và API

Điều kiện vào: tầng 0 mục 1, 2, 4 đã tick.

| #   | Tag | Mục                                       | Cần trước | Hiểu khi                                                                                | Nguồn                                                                                                        | Sprint     |
| --- | --- | ----------------------------------------- | --------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- |
| 13  | L2  | **CORE** HTTP method semantics            | -         | Phân biệt PUT/PATCH/POST và safe/idempotent không cần tra                               | (cần viết)                                                                                                   | Now        |
| 14  | L2  | **CORE** Status code semantics            | 13        | Phân biệt 400/401/403/404/409/422/429 và khi nào trả cái nào                            | [[Backend_Knowledge_Checklist#Architecture]] · Problem Details RFC 9457 Envelope, Database Error Translation | Now        |
| 15  | L2  | Headers, caching, conditional requests    | 14        | Giải thích `ETag`/`If-None-Match` và khi nào tiết kiệm băng thông                       | (cần viết)                                                                                                   | Post-offer |
| 16  | L1  | REST vs RPC vs GraphQL                    | 13        | Nêu được khi nào chọn cái nào, không theo trend                                         | (cần viết)                                                                                                   | Post-offer |
| 17  | L3  | **CORE** Idempotency-Key và replay safety | 13, 29    | Thiết kế chỗ nhận retry sao cho 2 request cùng key chỉ tạo 1 side effect                | [[Idempotency_Key_and_Replay_Safety]]                                                                        | Now        |
| 18  | L3  | **CORE** Pagination: offset vs cursor     | 26        | Giải thích vì sao offset phân trang sai khi dữ liệu chèn giữa chừng                     | [[Cursor_Pagination]]                                                                                        | Post-offer |
| 19  | L2  | Error envelope RFC 9457                   | 14        | Đọc một lỗi production và map được về field-level cause                                 | (cần viết)                                                                                                   | Post-offer |
| 20  | L3  | Auth: session vs JWT, token lifecycle     | 14        | Giải thích vì sao JWT không revoke được, và refresh rotation chống replay thế nào       | [[Backend_Knowledge_Checklist#Security]] · Cryptographic Refresh Token Rotation                              | Now        |
| 21  | L2  | CORS và preflight                         | 13        | Giải thích vì sao request đơn giản không preflight, và vì sao credentials + `*` bị chặn | (cần viết)                                                                                                   | Post-offer |
| 22  | L3  | CSRF, cookie, SameSite                    | 20, 21    | Nêu 2 điều kiện để CSRF xảy ra và cách chặn bằng SameSite                               | (cần viết)                                                                                                   | Post-offer |
| 23  | L3  | Timeout và cancellation                   | 5         | Phân biệt timeout bằng `Promise.race` và cancel thật bằng `AbortController`             | (cần viết)                                                                                                   | Post-offer |

---

## Tầng 2 - Dữ liệu

Điều kiện vào: tầng 0 mục 1, 2, 10 đã tick.

| #   | Tag | Mục                                                  | Cần trước  | Hiểu khi                                                                                                                                                                                           | Nguồn                                                                                                                                   | Sprint     |
| --- | --- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 24  | L3  | Relational modeling và normalization                 | 1          | Chuẩn hóa một bảng lộn xộn thành 3NF và nêu cái giá phải trả                                                                                                                                       | [[DB_Naming]]                                                                                                                           | Now        |
| 25  | L3  | SQL joins và aggregates                              | 24         | Viết query 3 bảng có `LEFT JOIN` + `GROUP BY` + `HAVING`, giải thích kết quả                                                                                                                       | [[SQL_Quotes]]                                                                                                                          | Now        |
| 26  | L4  | **CORE** Index: B-Tree, composite order, left-prefix | 25         | Cho `WHERE a=? AND b=? ORDER BY c` thiết kế đúng index và giải thích vì sao không đảo thứ tự                                                                                                       | [[Database_Indexing_Guidelines]], [[Index_BPlusTree]], [[Left_Prefix_Index_Postgres]], [[Partial_Index]]                                | Now        |
| 27  | L4  | **CORE** EXPLAIN và query plan                       | 26         | Đọc được seq scan vs index scan vs bitmap heap scan trên query của chính mình                                                                                                                      | [[Database_Indexing_Guidelines]]                                                                                                        | Now        |
| 28  | L3  | **CORE** N+1 và eager loading                        | 26         | Phát hiện N+1 trong ORM và sửa bằng 1 query hoặc batch load                                                                                                                                        | [[N_Plus_1_Query_Problem]], [[N_Plus_One_Query_Optimization_via_In_Memory_Hash_Map]]                                                    | Post-offer |
| 29  | L3  | **CORE** Transaction boundary và ACID                | 25         | Chỉ ra 2 thao tác phải nằm chung transaction và 1 thao tác không được nằm trong                                                                                                                    | [[Backend_Knowledge_Checklist#Database]] · Transactional Boundaries                                                                     | Now        |
| 30  | L4  | **CORE** Isolation level và anomaly                  | 29, 37, 38 | Map 5 anomaly (dirty read, non-repeatable read, phantom read, lost update, write skew) sang 4 mức isolation; giải thích vì sao transaction không cứu TOCTOU và REPEATABLE READ vẫn dính write skew | [[Database_Transaction_Isolation_and_MVCC]], [[Postgres_MVCC_Tuple_Visibility]]                                                         | Now        |
| 31  | L4  | **CORE** Pessimistic vs optimistic locking           | 30         | Nêu 2 tình huống dùng `FOR UPDATE` và 2 tình huống dùng version column, kèm cái giá                                                                                                                | [[Postgres_Select_For_Update_Pessimistic_Locking]], [[Atomic_Conditional_Update]]                                                       | Now        |
| 32  | L2  | Migrations và schema evolution                       | 24         | Đọc một migration sinh ra từ schema thay đổi và biết nó có lock bảng không                                                                                                                         | [[Backend_Knowledge_Checklist#ORM]] · Snapshot-Based Migration Generation, Migration Baseline Re-Anchor                                 | Post-offer |
| 33  | L3  | Connection pool và sizing                            | 23         | Giải thích vì sao app pool `max: 10` còn DB `max_connections=500` là hai tầng khác nhau                                                                                                            | [[Backend_Knowledge_Checklist#Database]] · Connection Pool Tuning; [[Backend_Knowledge_Checklist#ORM]] · Client Connection Pool Factory | Post-offer |
| 34  | L3  | Soft delete traps                                    | 26         | Giải thích vì sao unique constraint + `deletedAt` làm không tạo lại được bản ghi đã xóa                                                                                                            | [[Partial_Index]]                                                                                                                       | Post-offer |
| 35  | L3  | UUIDv7 và index locality                             | 26         | Giải thích vì sao UUIDv4 gây write amplification trên B-Tree, v7 thì không                                                                                                                         | (cần viết)                                                                                                                              | Post-offer |
| 36  | L3  | Zero-downtime DDL: expand-contract                   | 32         | Nêu 3 bước đổi tên cột khi app cũ vẫn đang chạy                                                                                                                                                    | (cần viết)                                                                                                                              | Post-offer |

---

## Tầng 3 - Concurrency và reliability

Điều kiện vào: tầng 2 mục 29 đã tick. Mục 30 và 31 nằm trong tầng 2 nhưng học sau 37 và 38, vì isolation level chỉ map được anomaly sau khi đã thấy lost update ngay trong code.

| #   | Tag | Mục                                                 | Cần trước          | Hiểu khi                                                                                                               | Nguồn                                                                                                             | Sprint     |
| --- | --- | --------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------- |
| 37  | L4  | **CORE** Race condition và TOCTOU                   | 29                 | Chỉ ra khe thời gian giữa read và write trong code đọc-kiểm tra-ghi                                                    | [[Backend_Knowledge_Checklist#Database]] · Pessimistic Row Locking                                                | Now        |
| 38  | L4  | **CORE** Lost update và atomic conditional update   | 37                 | Viết `UPDATE ... WHERE version = ?` đúng, và giải thích khi nào phải retry                                             | [[Atomic_Conditional_Update]]                                                                                     | Now        |
| 39  | L4  | **CORE** Double-submit và retry safety              | 17, 38             | Thiết kế endpoint chịu được client retry 3 lần mà không tạo 3 bản ghi                                                  | [[Idempotency_Key_and_Replay_Safety]]                                                                             | Post-offer |
| 40  | L4  | At-least-once và idempotent consumer                | 39                 | Giải thích vì sao exactly-once là ảo, và consumer phải tự chống trùng                                                  | [[Idempotent_Consumer_Mechanism]]                                                                                 | Post-offer |
| 41  | L5  | Outbox pattern và dual-write                        | 29, 39, 40         | Nêu 2 thứ tự ghi sai và hậu quả từng cái; khi nào outbox là quá mức                                                    | [[Outbox_Pattern]]                                                                                                | Post-offer |
| 42  | L4  | Retry, backoff, jitter, DLQ                         | 40                 | Nêu 3 điều kiện để retry không tạo bão tải                                                                             | [[Backend_Knowledge_Checklist#Queues]] · Exponential Backoff Retries; (cần viết) note về DLQ                      | Post-offer |
| 43  | L3  | Rate limiting algorithms                            | 40                 | Phân biệt token bucket và sliding window, và vì sao cần jitter                                                         | [[Multi_Layer_Rate_Limiting_DDoS_Prevention]]                                                                     | Post-offer |
| 44  | L5  | Distributed lock và fencing token                   | 29, 30, 31, 37, 46 | Giải thích vì sao lock có TTL vẫn có thể cấp 2 owner cùng lúc                                                          | [[Redis_Redlock_Quorum_Mechanics]], [[Fencing_Token_Correctness_Requirement]], [[Distributed_Lock_Failure_Modes]] | Post-offer |
| 45  | L3  | Queue semantics: visibility timeout, poison message | 42                 | Giải thích vì sao job lặp vô hạn khi consumer luôn throw                                                               | (cần viết) — checklist chưa có mục visibility timeout hay poison message                                          | Post-offer |
| 46  | L4  | Clock skew và ordering                              | -                  | Phân biệt wall clock và monotonic clock; nêu 2 chỗ dùng sai clock gây bug                                              | (cần viết)                                                                                                        | Post-offer |
| 61  | L3  | Integration và concurrency test harness             | 29, 31, 38         | Viết test chạy 10 request đồng thời lên cùng một row DB thật và assert kết quả nhất quán, có dọn dữ liệu giữa các test | [[Backend_Knowledge_Checklist#Testing]], [[Backend_Knowledge_Checklist#Benchmarks]]                               | Now        |

---

## Tầng 4 - Kiến trúc và framework

Điều kiện vào: tầng 1 và 2 mục 29 đã tick.

| #   | Tag | Mục                                            | Cần trước | Hiểu khi                                                               | Nguồn                                                                                                                                                           | Sprint     |
| --- | --- | ---------------------------------------------- | --------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 47  | L2  | DI và IoC                                      | -         | Giải thích vì sao `@Injectable()` cho phép thay mock trong test        | [[Dependency_Injection]]                                                                                                                                        | Now        |
| 48  | L2  | Request lifecycle và pipeline ordering         | 14        | Giải thích vì sao guard chạy trước pipe, và filter bắt lỗi ở đâu       | [[Backend_Knowledge_Checklist#Architecture]] · Global Pipeline Tokens, Guard Pipeline Ordering                                                                  | Now        |
| 49  | L3  | Module boundary và circular dependency         | 47        | Chỉ ra 1 cặp module đang phụ thuộc vòng và cách cắt                    | [[Circular_Dependency]], [[Shared_Module_Dependency_Rule]]                                                                                                      | Post-offer |
| 50  | L2  | Layered vs Clean Architecture                  | 49        | Nêu được 1 tầng bị vi phạm trong repo và hậu quả cụ thể                | [[Clean_Architecture]], [[Layered_Architecture]]                                                                                                                | Post-offer |
| 51  | L3  | **CORE** AuthZ: RBAC, IDOR, object-level check | 20, 48    | Viết được check quyền theo object, không chỉ theo role                 | `Role_Based_Access_Control_and_IDOR_Prevention` (cần viết)                                                                                                      | Now        |
| 52  | L2  | Validation tại boundary                        | 9         | Giải thích vì sao validate ở pipe thay vì trong service                | [[Backend_Knowledge_Checklist#TypeScript]] · Single Source of Truth Validation; [[Backend_Knowledge_Checklist#Architecture]] · Automatic Schema Resolution Pipe | Post-offer |
| 53  | L3  | Config và secrets: fail-fast                   | 12        | Giải thích vì sao env thiếu phải chết lúc boot, không phải lúc request | [[Backend_Knowledge_Checklist#TypeScript]] · Type-Safe Environment Variables, Environment Normalization, Primitive Type Coercion                                | Post-offer |

---

## Tầng 5 - Vận hành

Điều kiện vào: tầng 1 mục 14 và tầng 4 mục 48 đã tick.

| #   | Tag | Mục                                         | Cần trước | Hiểu khi                                                                                                  | Nguồn                                                                                                      | Sprint     |
| --- | --- | ------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------- |
| 54  | L2  | Structured logging và correlation ID        | -         | Truy 1 request qua 3 log line bằng một ID                                                                 | [[Backend_Knowledge_Checklist#Logging]] · Distributed Request ID Propagation                               | Post-offer |
| 67  | L3  | AsyncLocalStorage và request context        | 4, 54     | Giải thích vì sao context phải đi qua async boundary bằng ALS, và vì sao biến module-level không làm được | (cần viết)                                                                                                 | Post-offer |
| 55  | L2  | Error taxonomy: 4xx vs 5xx và alert routing | 14, 54    | Giải thích vì sao 4xx không được tạo alert                                                                | [[Backend_Knowledge_Checklist#Observability]] · Alert Quota Conservation                                   | Post-offer |
| 56  | L2  | Graceful shutdown                           | 45        | Nêu thứ tự đúng khi nhận SIGTERM: ngừng nhận request, xong job, flush, exit                               | [[Backend_Knowledge_Checklist#Runtime]] · Process Lifecycle and Signals, Graceful Telemetry Flush          | Post-offer |
| 57  | L4  | Cache-aside, invalidation, stampede         | 30        | Nêu 3 kiểu hỏng cache và cách chặn từng cái                                                               | [[Backend_Knowledge_Checklist#Caching]] · Cache-Aside Pattern                                              | Post-offer |
| 58  | L2  | Health vs readiness vs liveness             | 56        | Giải thích vì sao probe sai làm container restart loop                                                    | [[Backend_Knowledge_Checklist#Database]] · Healthcheck Readiness Probe                                     | Post-offer |
| 59  | L4  | Percentile và SLO                           | -         | Giải thích vì sao trung bình latency đánh lừa, và p99 nói gì                                              | [[Latency_Percentiles_and_Throughput_Fundamentals]]                                                        | Post-offer |
| 60  | L3  | Deploy: blue-green và rollback              | 56, 58    | Nêu 3 điều kiện để zero-downtime deploy thật sự zero                                                      | [[Backend_Knowledge_Checklist#DevOps]] · Blue-Green Zero-Downtime Deployment, Hot-Reloadable Reverse Proxy | Post-offer |

---

## Chuỗi phụ thuộc cho các mục khó

Đây là phần trả lời trực tiếp câu hỏi "muốn hiểu cái này thì cần nền gì trước".

```
[44] Redis Redlock (L5)
  <- [31] Pessimistic vs optimistic locking (L4)
  <- [30] Isolation level và anomaly (L4)
  <- [29] Transaction boundary (L3)
  <- [37] Race condition và TOCTOU (L4)
  <- [46] Clock skew và ordering (L4)
  Thiếu mắt nào thì đọc xong vẫn chỉ nói được "Redlock có driftFactor" mà không biết khi nào nó sai.

[41] Outbox pattern (L5)
  <- [40] At-least-once và idempotent consumer (L4)
  <- [39] Double-submit (L4)
  <- [29] Transaction boundary (L3)
  Cái giá của outbox là độ trễ và một bảng phải dọn. Không biết cái giá thì sẽ dùng ở nơi không cần.

[30] Isolation level (L4)
  <- [29] Transaction boundary (L3)
  <- [37] Race condition và TOCTOU (L4)
  <- [38] Lost update (L4)
  Thiếu [37] và [38] thì READ COMMITTED và REPEATABLE READ trông giống hệt nhau, và write skew vẫn vô hình ở REPEATABLE READ.
```

---

## 14 khái niệm CORE (18 entry)

| #   | Khái niệm                    | Entry  |
| --- | ---------------------------- | ------ |
| C1  | Closure                      | 2      |
| C2  | Event loop                   | 4      |
| C3  | async/await pitfalls         | 6      |
| C4  | Numeric precision và money   | 10     |
| C5  | HTTP semantics               | 13, 14 |
| C6  | Idempotency                  | 17     |
| C7  | Index và query plan          | 26, 27 |
| C8  | Transaction và isolation     | 29, 30 |
| C9  | Locking                      | 31     |
| C10 | Race và lost update          | 37, 38 |
| C11 | AuthZ và IDOR                | 51     |
| C12 | Pagination: offset vs cursor | 18     |
| C13 | N+1 và eager loading         | 28     |
| C14 | Double-submit                | 39     |

## Sprint hiện tại: 32 entry `Now`

Thứ tự thực thi, không đổi. Ước lượng theo ngày làm việc thật (khoảng 3 giờ tập trung/ngày).

1. Entry 1 - Scope, hoisting/TDZ (0.25 ngày) - nền tảng
2. Entry 2 - Closure (2 ngày) - C1
3. Entry 7 - ESM vs CJS (0.5 ngày) - nền tảng cho 63
4. Entry 4 - Event loop (1 ngày) - C2
5. Entry 5 - Promise semantics (1 ngày) - nền tảng
6. Entry 6 - async/await pitfalls (1 ngày) - C3
7. Entry 62 - Error propagation ở tầng runtime (1 ngày) - nền tảng, học sau 5 và 6
8. Entry 9 - TS erasure (0.5 ngày) - nền tảng cho 11, 65, 66, 69, 70
9. Entry 47 - DI và IoC (0.5 ngày) - nền tảng framework
10. Entry 70 - Literal union `as const` + `keyof typeof` (0.5 ngày) - học sau 9
11. Entry 69 - Zod composition (0.5 ngày) - học sau 9
12. Entry 68 - RxJS Observable (1 ngày) - học sau 5
13. Entry 65 - Decorators và metadata reflection (1 ngày) - học sau 9
14. Entry 10 - Numeric precision và money (1 ngày) - C4
15. Entry 63 - Bun runtime surface (1 ngày) - học sau 7
16. Entry 64 - Memory model: stack, heap, GC, leak (1 ngày) - học sau 2
17. Entry 13, 14 - HTTP semantics (1 ngày) - C5
18. Entry 24 - Relational modeling (1.5 ngày) - nền tảng cho 25
19. Entry 25 - SQL joins và aggregates (1.5 ngày) - nền tảng cho 26 và 29
20. Entry 26, 27 - Index và EXPLAIN (4 ngày) - C7
21. Entry 29 - Transaction boundary (2 ngày) - C8a
22. Entry 37 - Race và TOCTOU (2 ngày) - C10a
23. Entry 38 - Lost update (2 ngày) - C10b
24. Entry 30 - Isolation và anomaly (3 ngày) - C8b, học sau 37 và 38
25. Entry 31 - Locking (3 ngày) - C9
26. Entry 48 - Request lifecycle (1 ngày) - nền tảng cho 51
27. Entry 20 - Auth và token lifecycle (1.5 ngày) - nền tảng cho 51
28. Entry 17 - Idempotency (3 ngày) - C6, học sau 29
29. Entry 51 - AuthZ và IDOR (2 ngày) - C11
30. Entry 61 - Integration và concurrency test harness (2 ngày) - nghiệm thu cuối sprint

Tổng: khoảng 43 ngày làm việc, tức 128-135 giờ. Ở 15 giờ/tuần là **9 tuần**.

Đối chiếu deadline 06/12/2026 (5 tuần): thiếu khoảng 4 tuần. Sprint đã giữ đủ năng lực CORE và bù thêm phần nền tảng runtime (7, 9, 62, 63, 64) lẫn nền tảng framework/type (47, 65, 68, 69, 70), nên lựa chọn trung thực là dời deadline sang cuối tháng 12.

Nếu buộc giữ deadline, cắt theo thứ tự ít nguy hiểm nhất: 61, 64, 63, 24, 25, 48. Không cắt 17, 29, 30, 31, 37, 38, 51 — đó là sáu chỗ bug production hay nằm nhất và cũng là phần CORE. Riêng 68, 69, 70, 47, 65 rẻ và là điều kiện để đọc code NestJS — không cắt.

- **Điều kiện pass cuối sprint:** trả lời được 6 câu hỏi chẩn đoán (double-submit, webhook replay, concurrent booking, index, DB chết giữa transaction, dữ liệu client tin được).
- **Nghiệm thu nền tảng framework (47, 65, 68, 69, 70):** đọc 4 file `common/interceptors/logging.interceptor.ts`, `common/schemas/zod-primitives.ts`, `src/env.ts`, `common/guards/jwt-auth.guard.ts` mà không thấy dòng nào là ma thuật.
- **Bằng chứng:** viết 3 test bằng harness ở mục 61, chứng minh double-submit (mục 17), concurrent booking (mục 31) và lost update (mục 38).

---

## Related Notes

- [[Backend_Knowledge_Checklist]] - bản đồ codebase, item nào cũng có tag L1-L5
- [[Master_Backend_Engineering_SSOT]] - mục tiêu, Pillar, và tiến độ theo tuần
- [[Master_Roadmaps_Index]] - các roadmap chuyên sâu (Redis, System Design, DSA)
- [[Project_Anchored_Technical_Mastery]] - cách học gắn với project thật
