---
tags: [type/checklist, status/active]
date: 2026-10-30
description: "Bản đồ codebase open-genset/backend: 177 mục kiến thức, mỗi mục gắn mức năng lực tối thiểu L1-L5 và neo vào file trong mã nguồn, dùng để đối chiếu khi học theo lộ trình."
---

# Backend Knowledge Checklist

## TL;DR

- **Bản chất**: Bản đồ mô tả _cái gì đang có_ trong `open-genset/backend`, mỗi mục là một quyết định kỹ thuật thật kèm mức năng lực tối thiểu để không dùng sai.
- **Mục đích**: Trả lời "chỗ này trong code hoạt động thế nào và tôi đã hiểu tới đâu", làm nguồn đối chiếu cho [[Backend_Learning_Path]] khi cần ví dụ cụ thể.
- **Điểm mấu chốt**: 177 mục, phân bố L1 17 / L2 89 / L3 56 / L4 9 / L5 6; mục có tag thấp là chỗ nhận diện được nhưng chưa tái tạo được, không phải chỗ đã hiểu.

---

A structured atomic knowledge checklist of technical concepts, design patterns, and engineering decisions extracted directly from the backend codebase.

> **Vai trò file này**: bản đồ codebase (descriptive), không phải lộ trình học.
> Mỗi item được gắn mức năng lực tối thiểu để hiểu đúng và không dùng sai:
>
> - `[L1]` Nhận diện - giải thích đúng trong 30 giây, không tra cứu
> - `[L2]` Tái tạo - viết lại được khi có mẫu hoặc docs mở
> - `[L3]` Tự lực - viết từ đầu, không AI, 20-50 dòng
> - `[L4]` Chẩn đoán - nêu được 2 failure mode và cách phát hiện khi nó xảy ra
> - `[L5]` Đánh đổi - nêu được khi nào KHÔNG dùng, phương án thay thế, và cái giá
>
> Luật gán tag: mức tối thiểu để hiểu đúng. Lưỡng lự thì chọn mức thấp hơn.
>
> **Đọc được ngay ở L1-L2**: phần Runtime, TypeScript, cấu hình container của Database, ORM, DevOps.
> **Chỉ đọc khi đã có nền**: Concurrency, Events, Caching nâng cao, benchmarking.
>
> Nguồn: codebase `open-genset/backend`. Lộ trình có thứ tự phụ thuộc: [[Backend_Learning_Path]].

---

## Runtime

- [ ] [L1] Bun Engine: Production server launched via `bun --smol dist/main.js` using Bun's low-memory garbage collection mode to minimize RSS memory footprint in containers (`backend/package.json:28`)
- [ ] [L1] Bun Module Loader Workaround: Dynamic ESM import `await import("nestjs-pino")` inside `bootstrap()` to prevent CJS/ESM evaluation race conditions with `@nestjs/core` under Bun runtime (`backend/src/main.ts:14`)
- [ ] [L1] ESM-First Module Resolution: Native ECMAScript Modules (`"type": "module"`) paired with `"module": "ESNext"` and `"moduleResolution": "bundler"` for zero-transpilation execution (`backend/package.json:6`, `backend/tsconfig.json`)
- [ ] [L1] Process Lifecycle & Signals: `app.enableShutdownHooks()` registers `SIGTERM` and `SIGINT` signal listeners to flush telemetry buffers and gracefully close connections (`backend/src/main.ts:27`)
- [ ] [L3] Promise.withResolvers: Native ECMAScript 2024 `Promise.withResolvers()` used to establish timeout-bound promises without deferred wrapper boilerplates (`backend/src/common/services/redlock.service.ts:50`, `backend/src/common/guards/throttler.guard.ts:28`, `backend/src/modules/outbox/outbox.service.ts:177`)
- [ ] [L1] Reverse Proxy Trust: `app.set("trust proxy", 1)` configures Express behind Caddy/Cloudflare to parse `X-Forwarded-For` correctly for rate-limiting and logging (`backend/src/main.ts:23`)
- [ ] [L1] Startup Telemetry Order: Pre-bootstrap SDK initialization via `initSentry()` at the module root level to capture unhandled startup faults before NestJS initializes (`backend/src/main.ts:11`)
- [ ] [L2] Graceful Telemetry Flush: `SentryService` implements `OnApplicationShutdown` to flush buffered events via `flushSentry(2000)` before process exit (`backend/src/common/services/sentry.service.ts:230-233`)
- [ ] [L2] (Gap) Process Unhandled Rejections: Absence of top-level `process.on("unhandledRejection")` and `process.on("uncaughtException")` hooks, relying exclusively on default Bun process termination behavior

---

## TypeScript

- [ ] [L2] Strict Type Discipline: Strict mode compiler configuration enabling `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, and `noUncheckedIndexedAccess` (`backend/tsconfig.json`)
- [ ] [L1] Verbatim Module Syntax: `verbatimModuleSyntax: true` enforces explicit `import type` annotations, guaranteeing zero unexpected runtime imports in generated ESM (`backend/tsconfig.json`)
- [ ] [L2] Decorator Metadata Reflection: `emitDecoratorMetadata` and `experimentalDecorators` enabled to support NestJS dependency injection reflection via `reflect-metadata` (`backend/tsconfig.json`)
- [ ] [L2] Single Source of Truth Validation: Zod schemas act as single source of truth for runtime validation, DTO types via `z.infer<typeof schema>`, and Swagger specs via `createZodDto` (`backend/src/modules/auth/dto/login.dto.ts:33-35`)
- [ ] [L2] Type-Safe Environment Variables: `@t3-oss/env-core` creates runtime-validated, compile-time typed `env` object eliminating `string | undefined` environment access (`backend/src/env.ts`)
- [ ] [L2] Environment Normalization: `z.preprocess()` normalizes unstructured environment strings into canonical forms prior to schema parsing (`backend/src/env.ts:8-14, 29-40`)
- [ ] [L2] Primitive Type Coercion: `z.coerce.number()` and `z.coerce.boolean()` safely parse string-encoded environment variables into scalar types (`backend/src/env.ts`)
- [ ] [L2] Literal Enum Emulation: Plain objects marked with `as const` provide literal union types for safe utilization in both Zod enums and compile-time checks (`backend/src/env.ts:5-8`)
- [ ] [L2] Typed Metadata Extraction: Generic invocation `reflector.get<T>()` extracts route and class metadata without runtime casting (`backend/src/common/guards/jwt-auth.guard.ts:32`)
- [ ] [L2] Parameter Decorator Factory: `createParamDecorator` parameterized with `keyof JwtPayload` to provide conditional scalar or composite payload extraction (`backend/src/common/decorators/current-user.decorator.ts:12-18`)
- [ ] [L2] Global Express Augmentation: `declare global` namespace augmentation extends `Express.Request` with strongly-typed `user?: JwtPayload` (`backend/src/common/guards/jwt-auth.guard.ts:14-20`)
- [ ] [L2] Index Signature Protection: `noUncheckedIndexedAccess` enforces mandatory optional-chaining checks on dynamic index lookups (`backend/src/common/filters/global-exception.filter.ts:89`)

---

## Architecture

- [ ] [L2] Modular Composition: Single root `AppModule` orchestrating flat feature modules with zero circular module dependencies (`backend/src/app.module.ts`)
- [ ] [L2] Global Pipeline Tokens: Multi-provider tokens (`APP_GUARD`, `APP_FILTER`, `APP_INTERCEPTOR`, `APP_PIPE`) register cross-cutting HTTP pipeline concerns through the DI container (`backend/src/app.module.ts:70-102`)
- [ ] [L2] Guard Pipeline Ordering: Sequential guard execution (Throttler -> JWT Authentication -> Role-Based Access Control) to drop unauthorized traffic before domain logic (`backend/src/app.module.ts:71-80`)
- [ ] [L2] Metadata Short-Circuiting: Custom `@Public()` decorator evaluated via `reflector.getAllAndOverride()` bypasses authentication and authorization pipelines on designated endpoints (`backend/src/common/decorators/public.decorator.ts`, `backend/src/common/guards/jwt-auth.guard.ts:32`)
- [ ] [L2] Ambient Global Modules: `@Global()` decorator on `SentryModule` exposes shared telemetry services across all domain modules without redundant imports (`backend/src/common/modules/sentry.module.ts`)
- [ ] [L2] Dynamic Logger Configuration: Dynamic `LoggerModule.forRoot()` configuring colorized `pino-pretty` transport in development and JSON in production with initial log buffering (`backend/src/app.module.ts:44-59`, `backend/src/main.ts:18-19`)
- [ ] [L2] Distributed Throttler Multi-Tiering: Multi-bucket rate limiter (`default`, `public`, `auth`) backed by Redis storage to prevent abuse across distributed app instances (`backend/src/app.module.ts:73-90`)
- [ ] [L2] Internationalization Resolvers: `I18nModule.forRoot()` resolves request locale via `HeaderResolver(['x-lang'])` falling back to `AcceptLanguageResolver` with default locale `"vi"` (`backend/src/app.module.ts:66-72`)
- [ ] [L2] Environment-Gated Response Validation: `ZodResponseValidationInterceptor` validates outbound HTTP responses against declared schemas in development and test environments while acting as a no-op in production (`backend/src/common/interceptors/zod-response-validation.interceptor.ts:68-74`)
- [ ] [L2] Problem Details RFC 9457 Envelope: Catch-all `@Catch()` exception filter normalizes all HTTP, database, and unexpected errors into RFC 9457 `application/problem+json` format (`backend/src/common/filters/global-exception.filter.ts:40-45`)
- [ ] [L3] Database Error Translation: Explicit mapping layer converting PostgreSQL error codes (e.g., `23505` unique violation to 409, `40P01` deadlock to 409, `57014` query timeout to 504) to HTTP statuses (`backend/src/common/filters/global-exception.filter.ts:109-155`)
- [ ] [L2] Automatic Schema Resolution Pipe: Global `ZodValidationPipe` dynamically retrieves validation schemas directly from DTO class metatypes without manual parameter decorators (`backend/src/common/pipes/zod-validation.pipe.ts:77-92`)
- [ ] [L3] Swagger Multi-Type Schema Patch: Custom `createZodDto` utility post-processes OpenAPI metadata factory output to fix `@nestjs/swagger` nullable field representation (`backend/src/common/dto/create-zod-dto.util.ts`)
- [ ] [L3] (Gap) Feature-Level Dynamic Modules: Absence of `forFeature()` or `registerAsync()` patterns in business modules; all dynamic configuration is locked at root `AppModule`

---

## Database

- [ ] [L1] Connection Pool Tuning: Production container configured with `max_connections=500` to support concurrent high-load API workloads (`backend/docker-compose.yml:14-16`)
- [ ] [L1] Memory Allocation Tuning: PostgreSQL container tuned with `shared_buffers=256MB` and `work_mem=16MB` to optimize caching and in-memory sort operations (`backend/docker-compose.yml:17-20`)
- [ ] [L1] Container Resource Constraints: Docker container resource enforcement with CPU limit `0.50` and memory reservation `512M/256M` (`backend/docker-compose.yml:30-36`)
- [ ] [L1] Healthcheck Readiness Probe: PostgreSQL readiness polling via `pg_isready` command with 5-second interval and 15-second startup grace period (`backend/docker-compose.yml:22-28`)
- [ ] [L3] Transactional Boundaries: `db.transaction(async (tx) => ...)` wraps all composite domain operations ensuring ACID compliance and consistent state rollbacks (`backend/src/modules/orders/orders.service.ts:73`, `backend/src/modules/payments/payments.service.ts:109`)
- [ ] [L3] Pessimistic Row Locking: `.for("update")` locks selected inventory and warehouse rows within transactions to prevent overselling under high concurrency (`backend/src/modules/orders/orders.service.ts:105,136`, `backend/src/modules/warehouse/warehouse.service.ts:270`)
- [ ] [L5] Canonical Deadlock Avoidance: Deterministic sorting of product identifiers via `toSorted()` prior to acquiring row locks, eliminating cyclic lock waits (`backend/src/modules/orders/orders.service.ts:96-99`)
- [ ] [L4] Non-Blocking Work Polling: `.for("update", { skipLocked: true })` enables concurrent workers to poll and process unclaimed jobs without row-lock contention (`backend/src/modules/outbox/outbox.service.ts:94`)
- [ ] [L3] Filtered Partial Indexing: Filtered index `order_active_metrics_idx` with `.where(sql`status != 'CANCELLED'`)` indexing only active records to reduce storage and index maintenance overhead (`backend/src/database/schemas/order.schema.ts:45-48`)
- [ ] [L3] Partial Unique Singleton Constraint: Unique index `one_selected_bid_order_idx` filtered by `isSelected = true` enforcing at most one winning shipping bid per order at database engine level (`backend/src/database/schemas/order.schema.ts:67-70`)
- [ ] [L3] Composite Access Path Indexing: Multi-column composite index on `(userId, status, createdAt)` matching primary search, filtering, and sorting patterns (`backend/src/database/schemas/order.schema.ts:38-42`)
- [ ] [L2] Declarative Check Constraints: Database-level domain integrity constraints enforcing non-negative stocks and positive order item quantities (`backend/src/database/schemas/product.schema.ts:56`, `backend/src/database/schemas/warehouse.schema.ts:44`, `backend/src/database/schemas/order.schema.ts:60-62`)
- [ ] [L3] Foreign Key Referential Actions: Explicit referential integrity rules mixing `ON DELETE CASCADE` for owned entities, `ON DELETE RESTRICT` for financial ledgers, and `ON DELETE SET NULL` for user associations (`backend/src/database/schemas/order.schema.ts:48-55`, `backend/src/database/schemas/payments.schema.ts:22-24`)
- [ ] [L2] Natural Composite Primary Keys: Junction tables utilizing composite primary keys `primaryKey({ columns: [warehouseId, productId] })` avoiding surrogate key overhead (`backend/src/database/schemas/warehouse.schema.ts:38-40`)
- [ ] [L3] Atomic Upsert Operations: `INSERT ... ON CONFLICT DO UPDATE` (`onConflictDoUpdate`) performing single round-trip inventory reconciliations (`backend/src/modules/warehouse/warehouse.service.ts:281-285`)
- [ ] [L2] Dependency-Ordered Seed Pipeline: Three-tier seed orchestrator (Reference -> Catalog -> Operational) propagating primary identity maps to satisfy relational foreign keys (`backend/src/database/seeds/seed.orchestrator.ts:20-80`)
- [ ] [L2] Idempotent Seeding: Bulk seeder operations utilize `.onConflictDoNothing()` allowing repeated execution without data corruption (`backend/src/database/seeds/tiers/tier1-reference.seeder.ts:34,55,75`)
- [ ] [L2] Dynamic Truncate Reset: Dynamic discovery and truncation of all public schema tables with `TRUNCATE TABLE ... RESTART IDENTITY CASCADE` protected by production safety assertions (`backend/src/database/utils/truncate.util.ts:15-39`)
- [ ] [L3] Self-Referential Tree Adjacency: Hierarchical adjacency list tree using deferred column references `AnyPgColumn` for recursive categories and dealer hierarchies (`backend/src/database/schemas/category.schema.ts:16-18`, `backend/src/database/schemas/auth.schema.ts:29`)
- [ ] [L4] (Gap) Explicit Transaction Isolation: Absence of explicit `SERIALIZABLE` or `REPEATABLE READ` transaction settings; transactions run on default `READ COMMITTED` relying on row locks rather than MVCC serialization

---

## ORM

- [ ] [L2] Casing Convention Normalization: `snakeCase.table(...)` factory automatically maps TypeScript camelCase definitions to PostgreSQL snake_case table columns (`backend/src/database/schemas/product.schema.ts:22`)
- [ ] [L2] Reusable Schema Fragments: Compositional schema fragments (`baseEntity`, `fullEntity`, `baseTimestamps`) providing standardized UUID primary keys and automated `$onUpdate` timestamps (`backend/src/database/schemas/helpers.schema.ts`)
- [ ] [L2] Soft Deletion Modeling: Standardized `deletedAt` timestamp within `fullEntity` for soft-deletion state handling without physical data loss (`backend/src/database/schemas/helpers.schema.ts:22-24`)
- [ ] [L3] Chronological UUIDv7 Identifiers: Automatic generation of time-ordered UUIDv7 identifiers via `$defaultFn(uuidv7)` ensuring sequential B-Tree index inserts (`backend/src/database/schemas/helpers.schema.ts:4-6`)
- [ ] [L2] Native PostgreSQL Enums: Domain state machines backed by native `pgEnum(...)` types guaranteeing database-level state validation (`backend/src/database/schemas/enums.schema.ts`)
- [ ] [L3] Fixed-Point Monetary Precision: Financial attributes typed with `numeric({ precision: 15, scale: 2 })` avoiding IEEE 754 floating-point arithmetic errors (`backend/src/database/schemas/product.schema.ts:25`, `backend/src/database/schemas/auth.schema.ts:35`)
- [ ] [L2] Typed Semi-Structured Columns: JSONB columns annotated with `$type<T>()` providing compile-time type validation for unstructured document payloads (`backend/src/database/schemas/product.schema.ts:51`, `backend/src/database/schemas/quotes.schema.ts:31`)
- [ ] [L3] Centralized Relation Graph: System-wide entity associations declared in a single `defineRelations(...)` registry resolving relation paths and disambiguating foreign keys (`backend/src/database/schemas/relations.ts`)
- [ ] [L2] Explicit Column Projection: Queries explicitly define selected fields via `.select({ id: table.id, ... })` avoiding wildcard `SELECT *` payload bloat (`backend/src/database/seeds/tiers/tier1-reference.seeder.ts:37-44`)
- [ ] [L2] Safe Parameterized SQL Templates: Parameterized `sql` tagged template literals safely embedding dynamic expressions and arithmetic without SQL injection risk (`backend/src/modules/warehouse/warehouse.service.ts:298`, `backend/src/modules/orders/orders.service.ts:121`)
- [ ] [L3] Snapshot-Based Migration Generation: Drizzle Kit snapshots (`snapshot.json`) track schema evolution, generating deterministic incremental migration scripts (`backend/drizzle/`, `backend/drizzle.config.ts`)
- [ ] [L4] JIT Query Plan Compilation: `jit: true` enabled in database factory invoking Drizzle query plan compilation for repetitive queries (`backend/src/database/database.connection.ts:68`)
- [ ] [L2] Client Connection Pool Factory: `pg.Pool` tuned with `max: 10`, `connectionTimeoutMillis: 5000`, and TCP `keepAlive: true` with 10-second initial delay (`backend/src/database/database.connection.ts:26-55`)
- [ ] [L3] Migration Baseline Re-Anchor: `scripts/baseline.ts` consolidates migration history into a single baseline migration and re-anchors the `drizzle.__drizzle_migrations` registry (`backend/scripts/baseline.ts`)
- [ ] [L2] Bi-Directional Schema Type Inference: Schema exports `$inferSelect` and `$inferInsert` types ensuring complete synchronization between DDL and application model types (`backend/src/database/schemas/product.schema.ts:73-74`)
- [ ] [L3] (Gap) Production Query Logging: Factory accepts optional `logger` but does not attach application-level slow query logging in production, relying solely on PostgreSQL logs

---

## Caching

- [ ] [L1] Redis 8 Server Tuning: Container deployed with `maxclients=10000`, `--appendonly yes`, and `--appendfsync everysec` for durable in-memory storage (`backend/docker-compose.yml:35-55`)
- [ ] [L1] LRU Eviction Policy: Global `--maxmemory-policy allkeys-lru` configuration automatically discarding least recently used keys when memory limit is reached (`backend/docker-compose.yml:49`)
- [ ] [L1] Hardware Memory Cap: Hard ceiling of `128mb` enforced by Redis config and Docker memory resource constraints preventing container OOM kills (`backend/docker-compose.yml:43,60`)
- [ ] [L2] Micro-TTL Dashboard Cache: High-traffic analytics cached with a 60-second TTL (`EX: 60`) namespaced by locale and year with database fallback (`backend/src/modules/analytics/analytics.service.ts:366-371`)
- [ ] [L2] Prolonged Static Cache: Company settings cached with a 24-hour TTL (`EX: 86400`) and explicit cache invalidation (`redis.del`) upon configuration updates (`backend/src/modules/company-settings/company-settings.service.ts:25,195-199`)
- [ ] [L3] Cache-Aside Pattern: Manual implementation of read-through cache-aside pattern (get -> miss -> compute -> set) within domain services (`backend/src/modules/analytics/analytics.service.ts:114-120`)
- [ ] [L2] Upstash Cloud Resilience: Redis connection factory detects `*.upstash.io` endpoints, configures TLS SNI, and sets `enableOfflineQueue: false` to reject stalled commands during disconnections (`backend/src/config/redis.config.ts:22-60`)
- [ ] [L2] Distributed Rate Limiting State: Distributed hit-count counters stored in Redis via `ThrottlerStorageRedisService` shared across load-balanced application instances (`backend/src/app.module.ts:88-97`)
- [ ] [L3] (Gap) Unified Cache Abstraction: Absence of an injectable NestJS `CacheModule` or uniform cache interceptor; individual services instantiate distinct `ioredis` instances

---

## Concurrency

- [ ] [L5] Redlock Algorithm Implementation: Distributed locking configured with `driftFactor: 0.01`, `retryCount: 3`, `retryDelay: 200ms`, and `retryJitter: 50ms` (`backend/src/common/services/redlock.service.ts:14-21`)
- [ ] [L4] Webhook Re-Entrancy Guard: Distributed mutex lock `lock:payment:orderCode:<orderCode>` prevents concurrent double-processing of PayOS payment webhooks (`backend/src/modules/payments/payments.service.ts:206-210`)
- [ ] [L4] Safe Lock Release: Cryptographic token verification via Lua scripts guarantees locks are released strictly by their acquiring owner (`backend/src/common/services/redlock.service.ts`)
- [ ] [L3] Thundering Herd Avoidance: Jittered retry backoffs (`retryJitter: 50ms`) desynchronize lock contention attempts across competing workers (`backend/src/common/services/redlock.service.ts:20`)
- [ ] [L3] Distributed Lock Tracing: Breadcrumb tracking in Sentry on lock acquisition, extension, and release to pinpoint distributed contention bottlenecks (`backend/src/common/services/redlock.service.ts:55-100`)
- [ ] [L3] Pessimistic Order State Lock: Row-level `SELECT ... FOR UPDATE` on `orders` prevents concurrent status transition races (e.g., simultaneous cancellation and fulfillment) (`backend/src/modules/orders/orders.service.ts:731-733`)
- [ ] [L3] Pessimistic Quote Serialization: `SELECT ... FOR UPDATE` locks quotes during price recalculations and admin approval actions (`backend/src/modules/quotes/quotes.service.ts:698-699`)
- [ ] [L3] Pessimistic Stock Mutation Lock: Row-level locking on products and warehouse stocks during inventory allocations to eliminate phantom availability (`backend/src/modules/warehouse/warehouse.service.ts:269-271`)
- [ ] [L4] Non-Blocking Batch Claim: Outbox message workers poll using `FOR UPDATE SKIP LOCKED` preventing lock contention between parallel processing pods (`backend/src/modules/outbox/outbox.service.ts:94`)
- [ ] [L5] (Gap) Single-Node Redlock: Redlock is initialized with a single Redis connection, forfeiting the Byzantine fault tolerance and quorum consensus of true multi-node Redlock deployments

---

## Queues

- [ ] [L2] BullMQ Global Engine: App-wide queue connection orchestration via `BullModule.forRoot()` sharing centralized Redis configuration (`backend/src/app.module.ts:64-66`)
- [ ] [L2] Queue Registry Constants: Centralized string constant registry defining application queues (`"booking"`, `"mail"`, `"outbox"`) (`backend/src/common/constants/queue.constants.ts:1-4`)
- [ ] [L2] Co-Registered Outbox Queues: `BullModule.registerQueue` binds `"mail"` and `"outbox"` queues to worker execution contexts (`backend/src/modules/outbox/outbox.module.ts:9-12`)
- [ ] [L3] Exponential Backoff Retries: Asynchronous mail jobs configured with 5 attempts, exponential backoff starting at 2000ms, and failed job retention cap of 500 (`backend/src/modules/outbox/outbox.service.ts:181-192`)
- [ ] [L3] Queue Enqueue Timeout Protection: 5-second `Promise.race` safety timeout enclosing `mailQueue.add()` preventing queue outages from hanging main transaction threads (`backend/src/modules/outbox/outbox.service.ts:172-193`)
- [ ] [L2] Outbox Retention Worker: `@Processor(QUEUE_NAMES.OUTBOX)` processor implementing `WorkerHost` to purge processed events older than 7 days (`backend/src/modules/outbox/processors/outbox-cleanup.processor.ts`)
- [ ] [L2] Event-to-Job Translation Map: Static routing map converting domain event types to BullMQ job names with graceful unhandled event logging (`backend/src/modules/outbox/outbox.service.ts:21-26`)
- [ ] [L3] (Gap) Unscheduled Cleanup Job: Outbox cleanup processor exists but lacks a scheduled recurring cron producer or `@Cron()` annotation to trigger routine execution
- [ ] [L2] (Gap) Idle Queue Definition: `"booking"` queue is registered in constants but has no corresponding worker or consumer implementation

---

## Events

- [ ] [L5] Transactional Outbox Pattern: Domain state updates and event records (`outbox_events`) committed within the same database transaction ensuring guaranteed at-least-once emission (`backend/src/modules/orders/orders.service.ts:226`, `backend/src/modules/payments/payments.service.ts:286-341`)
- [ ] [L4] Outbox Lifecycle State Machine: Finite state transitions (`PENDING` -> `PROCESSING` -> `PROCESSED` | `FAILED`) with exponential retry attempts capped at `MAX_OUTBOX_ATTEMPTS = 3` (`backend/src/modules/outbox/outbox.service.ts:77-100, 126-142`)
- [ ] [L3] Polling Relay Daemon: Recurring 5000ms polling daemon started during `onApplicationBootstrap` with re-entrancy flags and graceful shutdown cancellation (`backend/src/modules/outbox/outbox.service.ts:57-70`)
- [ ] [L5] Dual-Write Decoupling: Business logic writes solely to the database outbox table, isolating domain transactions from downstream message broker availability (`backend/src/modules/payments/payments.service.ts:258-315`)
- [ ] [L3] Relay Level Idempotency: Webhook relay and handlers check `status === "COMPLETED"` prior to mutation to absorb duplicate webhook delivery attempts (`backend/src/modules/payments/payments.service.ts:224-228`)
- [ ] [L3] Event Polling Index: Composite index `outbox_events_status_created_at_idx` on `(status, created_at)` optimizing poll queries filtering on pending status ordered by timestamp (`backend/src/database/schemas/outbox.schema.ts:28-31`)
- [ ] [L1] Domain Event Vocabulary: Explicit string constant registry declaring all business events across authentication, orders, payments, and debts (`backend/src/common/constants/event.constant.ts:1-11`)
- [ ] [L3] (Gap) In-Process Event Bus: Absence of an in-memory event bus (`EventEmitter2` or CQRS `EventBus`); cross-module notifications rely exclusively on outbox database writes

---

## Security

- [ ] [L3] Asymmetric-Ready JWT Authentication: Stateless JWT authentication signed via `@nestjs/jwt` verified on protected routes by `JwtAuthGuard` (`backend/src/common/guards/jwt-auth.guard.ts`)
- [ ] [L2] Ephemeral Access Tokens: Short-lived access tokens bounded by configurable `JWT_ACCESS_EXPIRES_IN` paired with long-lived refresh credentials (`backend/src/modules/auth/auth.module.ts`)
- [ ] [L3] Cryptographic Refresh Token Rotation: Cryptographically secure 32-byte opaque tokens hashed via SHA-256 and consumed atomically via `DELETE ... RETURNING` to prevent replay attacks (`backend/src/modules/auth/auth.service.ts:55-72`)
- [ ] [L3] Memory-Hard Password Hashing: Node `scrypt` hashing with 16-byte random salt, high iteration cost, and constant-time `crypto.timingSafeEqual` comparison eliminating timing side-channels (`backend/src/common/utils/crypto.util.ts`)
- [ ] [L2] Role-Based Access Control: Declarative `@Roles(...)` metadata evaluated against authenticated JWT claims by `RolesGuard` (`backend/src/common/guards/roles.guard.ts`)
- [ ] [L2] Cron Header Authentication: Constant-time comparison of `x-cron-secret` headers via `crypto.timingSafeEqual` protecting scheduled administrative endpoints (`backend/src/common/guards/cron-auth.guard.ts`)
- [ ] [L2] Multi-Tier Distributed Rate Limiting: Dedicated throttle limits applied per endpoint type (e.g., tight 5 req/min on `/auth` vs 300 req/min on public routes) (`backend/src/app.module.ts:75-97`, `backend/src/modules/auth/auth.controller.ts:80`)
- [ ] [L5] Fail-Open Rate Limiter Resilience: Custom throttler guard executes Redis checks inside a 2-second `Promise.race`, failing open during Redis outages to maintain system availability (`backend/src/common/guards/throttler.guard.ts`)
- [ ] [L2] Input HTML Sanitization: Complete markup stripping via `sanitize-html` embedded in Zod string primitive transformations to eliminate XSS vectors at the ingress boundary (`backend/src/common/utils/sanitize.util.ts`, `backend/src/common/schemas/zod-primitives.ts:2-35`)
- [ ] [L2] Account Enumeration Mitigation: Silent success responses returned on non-existent account verification requests preventing email harvesting (`backend/src/modules/auth/auth.service.ts:130-160`)
- [ ] [L3] Single-Use Verification Tokens: SHA-256 hashed email verification tokens governed by 24-hour TTL and 60-second cooldown protected by row-level pessimistic locks (`backend/src/modules/auth/auth.service.ts:83-175`)
- [ ] [L2] Token Retention Pruning: Scheduled daily worker purging expired refresh tokens via `DELETE FROM refresh_tokens WHERE expires_at < NOW()` (`backend/src/modules/auth/token-cleanup.service.ts`)
- [ ] [L2] (Gap) Missing CORS Activation: `CORS_ORIGINS` variable is configured in environment schemas but `app.enableCors()` is never invoked in `main.ts`
- [ ] [L2] (Gap) Security Headers Middleware: Absence of `helmet` middleware leaving responses without `Content-Security-Policy`, `X-Frame-Options`, and `Strict-Transport-Security` headers

---

## Logging

- [ ] [L2] Structured JSON Output: Pino logger integrated via `nestjs-pino` outputting structured JSON logs for log ingestion systems (`backend/src/app.module.ts:45-57`)
- [ ] [L2] Latency-Graduated HTTP Logging: Global `LoggingInterceptor` categorizing HTTP response logs (`debug` for fast success, `warn` for >500ms or 4xx, `error` for 5xx) (`backend/src/common/interceptors/logging.interceptor.ts`)
- [ ] [L2] Duplicate Log Suppression: Automatic request logging disabled (`autoLogging: false`) in Pino to prevent redundant lines alongside `LoggingInterceptor` (`backend/src/app.module.ts:47`)
- [ ] [L3] Recursive Sensitive Field Redaction: Recursive deep object sanitization stripping passwords, secrets, tokens, and payment card details before log transmission (`backend/src/common/services/sentry.service.ts:19-103`)
- [ ] [L2] Header Redaction: SDK-level stripping of `Authorization` and `Cookie` headers preventing credential leakage in logs and telemetry (`backend/src/common/services/sentry.service.ts:184-191`)
- [ ] [L2] Distributed Request ID Propagation: Correlation ID extraction from `x-request-id` headers tagged into telemetry context for cross-service request tracing (`backend/src/common/interceptors/logging.interceptor.ts:33-37`)
- [ ] [L2] User Context Enrichment: Authenticated user ID and role attached to logger and Sentry scope for targeted audit logging (`backend/src/common/interceptors/logging.interceptor.ts:40-48`)
- [ ] [L2] Database Fault Sanitization: Database error logging extracting SQL error codes and constraints while withholding raw SQL statements from external API responses (`backend/src/common/filters/global-exception.filter.ts:84-100`)
- [ ] [L3] (Gap) Pino Native Redact Paths: Absence of native `redact` arrays in `pinoHttp` configuration, leaving direct `logger.*` output dependent on manual sanitization helpers

---

## Observability

- [ ] [L2] Early Telemetry Initialization: Sentry SDK initialized prior to NestJS application bootstrap ensuring capture of bootstrap and dependency injection exceptions (`backend/src/main.ts:10`)
- [ ] [L3] Dynamic Transaction Sampling: Dynamic `tracesSampler` filtering out high-frequency health check and documentation endpoints while sampling business transactions (`backend/src/common/services/sentry.service.ts:119-137`)
- [ ] [L2] Deterministic Release Signatures: Automated release versioning mapping Git commit hashes to Sentry releases for precise deployment tracking (`backend/src/common/services/sentry.service.ts:107-116`)
- [ ] [L3] Pre-Transmission PII Scrubbing: Sentry `beforeSend` hook executing deep sanitization on request headers, body parameters, and extras prior to network egress (`backend/src/common/services/sentry.service.ts:196-208`)
- [ ] [L3] High-Frequency Breadcrumb Filtering: Sentry `beforeBreadcrumb` hook filtering repetitive polling SQL queries and transaction markers to suppress noise (`backend/src/common/services/sentry.service.ts:150-175`)
- [ ] [L1] Standardized Breadcrumb Categories: Const enum defining uniform telemetry categories (`db.query`, `redlock`, `http`, `outbox`, `auth`) (`backend/src/common/constants/sentry.constant.ts`)
- [ ] [L2] RFC 9457 Error Response Envelope: Unified API error structure providing machine-readable error reasons and field-level validation breakdowns (`backend/src/common/filters/global-exception.filter.ts`)
- [ ] [L3] Alert Quota Conservation: Exception filter routes 4xx client errors to lightweight breadcrumbs, reserving Sentry error event quotas exclusively for 5xx failures (`backend/src/common/filters/global-exception.filter.ts:147-180`)
- [ ] [L2] Sentry Event Correlation ID: Generated Sentry error IDs returned directly in RFC 9457 JSON payloads to streamline user support ticket resolution (`backend/src/common/filters/global-exception.filter.ts:183-185`)
- [ ] [L2] Buffer Draining on Termination: `OnApplicationShutdown` hook flushes lingering telemetry events with a 2-second timeout preventing data loss during container restarts (`backend/src/common/services/sentry.service.ts:230-240`)
- [ ] [L3] (Gap) Prometheus & Metrics Exposition: Absence of Prometheus metrics exporter, OpenTelemetry metric pipeline, or functional `/metrics` scraping endpoints
- [ ] [L4] (Gap) Distributed Trace Header Propagation: Absence of W3C `traceparent` propagation on outbound HTTP calls, preventing distributed tracing across external services

---

## Testing

- [ ] [L2] Native Bun Test Suite: Fast test execution via `bun test src/` and `bun test test/` with `--bail` enabled for fast-failing CI verification (`backend/package.json:29-36`)
- [ ] [L2] Preload Setup Pipeline: `bunfig.toml` preloads environment mocks and global setup before initializing test runner threads (`backend/bunfig.toml:1-2`)
- [ ] [L2] Non-Destructive Environment Injection: `test-env.ts` injects mock transport configurations using nullish coalescing operators (`??=`) preserving active configuration overrides (`backend/test/helpers/test-env.ts`)
- [ ] [L2] Production Guard Assertions: Hard failure assertions thrown if test suites are executed against `NODE_ENV === "production"` environments (`backend/test/helpers/global-setup.ts:38-41`)
- [ ] [L3] Template Schema Cloning: Single template PostgreSQL schema migrated once and cloned per worker using `LIKE ... INCLUDING ALL` DDL, accelerating parallel test runs (`backend/test/helpers/database.helper.ts:44-78`)
- [ ] [L3] Isolated Worker Schemas: Each worker thread allocates a dedicated UUID-scoped database schema, dropped via `DROP SCHEMA CASCADE` upon suite completion (`backend/test/helpers/database.helper.ts:84-120`)
- [ ] [L3] Stale Test Schema Garbage Collection: Global test setup sweeps and purges abandoned schemas older than 1 hour created by interrupted test runs (`backend/test/helpers/global-setup.ts:25-49`)
- [ ] [L2] Non-Blocking Redis Teardown: Test instances isolate keys via prefix namespaces and purge them during teardown using non-blocking `SCAN` and `UNLINK` commands (`backend/test/helpers/app.helper.ts:45-70`)
- [ ] [L3] DI Provider Substitution: `Test.createTestingModule` chains `.overrideProvider()` swapping database connections, mailers, and payment gateways with mock stubs (`backend/test/helpers/app.helper.ts:90-140`)
- [ ] [L3] Chained Query Builder Mocking: Full-featured Drizzle ORM mock implementation supporting chained operations, transactions, and result queue configuration (`backend/test/mocks/database.mock.ts`)
- [ ] [L2] Object Mother & Factory Patterns: Domain test entities provisioned through factory functions and semantic Object Mother presets (`UserMother.admin()`, `UserMother.sales()`) (`backend/test/mothers/user.mother.ts`, `backend/test/factories/`)
- [ ] [L3] End-to-End Contract Verification: Supertest integration suites verifying HTTP status codes, RFC 9457 error contracts, and OpenAPI document drift (`backend/test/global-exception.e2e-spec.ts`, `backend/test/openapi.spec.ts`)
- [ ] [L2] JUnit Coverage Reporting: Test coverage collected and formatted into JUnit XML artifacts for CI analysis (`backend/package.json:33-34`)
- [ ] [L3] (Gap) Enforced Coverage Threshold: Absence of numeric code coverage gates (`lines`, `branches`, `statements`) allowing unverified pull requests to pass CI

---

## Benchmarks

- [ ] [L2] Micro-Benchmark Discovery Runner: Custom runner `test/benchmarks/runner.ts` dynamically discovering and executing `*.bench.ts` benchmark suites (`backend/test/benchmarks/runner.ts`)
- [ ] [L2] Statistical Metric Compilation: Per-task computation of iterations per second, min, average, p50, p95, and p99 latencies using high-precision `performance.now()` (`backend/test/benchmarks/benchmark.util.ts`)
- [ ] [L3] JIT Compilation Warmup: Benchmark harness executes 1000 warmup iterations prior to metric collection to bypass JIT compilation noise (`backend/test/benchmarks/benchmark.util.ts:52-56`)
- [ ] [L2] Schema Validation Benchmarking: Dedicated benchmark testing throughput of small, nested, and enum Zod DTO validation operations under 10,000 iterations (`backend/test/benchmarks/dto-validation.bench.ts`)
- [ ] [L2] Secret-Injected Benchmark Script: Dedicated `bun run test:bench` script executing benchmarks inside test Doppler secret environments (`backend/package.json:32`)
- [ ] [L3] (Gap) k6 Load Scenarios: `@types/k6` is installed in dependencies but no k6 scenario scripts exist for multi-user throughput or stress testing
- [ ] [L4] (Gap) Benchmark CI Quality Gates: Benchmark metrics are printed to terminal output only without automated performance degradation assertions or CI regression gates

---

## DevOps

- [ ] [L2] Multi-Stage Development Dockerfile: 5-stage Dockerfile (`base`, `install`, `prod-install`, `builder`, `runner`) stripping build tooling and source files from deployment images (`backend/docker/Dockerfile`)
- [ ] [L2] Lean Production Container: Standalone single-stage Dockerfile deploying pre-built artifacts with frozen lockfile production dependencies (`backend/docker/Dockerfile.prod`)
- [ ] [L2] Unprivileged Container Execution: Container execution assigned to unprivileged `bun` user (UID 1001, GID 1001) mitigating container breakout vulnerabilities (`backend/docker/Dockerfile:21-22`)
- [ ] [L2] Alpine-Compatible Healthchecks: Container healthcheck utilizing lightweight `wget --spider` probing local HTTP readiness endpoints (`backend/docker/Dockerfile:28-30`)
- [ ] [L2] Container Stack Orchestration: Docker Compose file defining PostgreSQL 18, Redis 8, and Caddy services on dedicated bridge networks with resource boundaries (`backend/docker-compose.yml`)
- [ ] [L3] Blue-Green Zero-Downtime Deployment: Automated deployment script (`deploy-app.sh`) conducting health validation on idle slots, generating Caddy configurations, and performing zero-downtime hot reloads (`backend/scripts/deploy-app.sh`)
- [ ] [L3] Hot-Reloadable Reverse Proxy: Caddy reverse proxy dynamically reloaded via `caddy reload` for atomic ingress traffic cutovers (`backend/scripts/deploy-app.sh:64-79`)
- [ ] [L2] Secret Injection Automation: Doppler CLI integration injecting scoped credentials (`dev`, `test`, `prd`) into runtime processes and build environments (`backend/doppler.yaml`, `backend/scripts/generate-env.sh`)
- [ ] [L2] Monorepo Path Filtering: GitHub Actions workflow triggers filtered by changed paths under `backend/**` preventing redundant pipeline executions (`backend.yml:5-14`, `.github/workflows/ci.yml:4-10`)
- [ ] [L1] Pipeline Concurrency Control: GitHub Actions workflows configure `concurrency` groups with `cancel-in-progress: true` canceling outdated builds on subsequent commits (`.github/workflows/backend.yml:22-24`)
- [ ] [L2] Static Security Scanning: Automated CI security workflows executing Aqua Security Trivy for vulnerability and secret detection alongside GitHub CodeQL static analysis (`.github/workflows/security.yml:32-78`)
- [ ] [L2] Automated Release Management: Semantic version bumping and automated changelog generation managed via Google Release Please automation (`.github/workflows/release-please.yml`)
- [ ] [L3] Continuous Deployment Delivery: Automated CD triggering Doppler database migrations and Render deployment hooks upon verified pull request merges (`backend.yml:43-79`)
- [ ] [L3] VPS Deployment Automation: Bash redeployment orchestrator automating full system configuration, performance optimization, and container provisioning on raw Linux instances (`backend/scripts/redeploy.sh`)

---

## Related Notes

- [[Backend_Learning_Path]]: thứ tự học, điều kiện tiên quyết và mức năng lực cần đạt cho từng mục.
- [[Master_Backend_Engineering_SSOT]]: mục tiêu vai trò, tiêu chuẩn kỹ thuật và tiến độ theo tuần.
