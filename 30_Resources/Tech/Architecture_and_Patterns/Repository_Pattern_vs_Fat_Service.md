---
tags: [type/concept, status/permanent]
date: 2026-06-19
description: "So sánh giữa Repository Pattern và Fat Service (Direct ORM) trong thiết kế tầng dữ liệu."
---

# Repository Pattern vs Fat Service

## TL;DR

- **Bản chất**: Repository bọc ORM sau một interface cho domain dùng; Fat Service nhúng truy vấn ORM trực tiếp vào service.
- **Mục đích**: Chọn giữa khả năng thay thế hạ tầng và lượng boilerplate phải viết.
- **Điểm mấu chốt**: Repository đổi boilerplate lấy khả năng thay thế hạ tầng; lợi ích đó chỉ thật khi domain phức tạp hoặc hạ tầng thực sự có khả năng đổi.

## Core Concept

- **Tại sao nó tồn tại & Giải quyết bài toán gì?**
  Quyết định kiến trúc ở đây là cách Service/Domain tương tác với Database.
  - **Repository Pattern** gỡ phụ thuộc cứng của Business Logic vào SQL/ORM cụ thể, bằng một Interface đóng vai collection trong bộ nhớ của Domain Object.
  - **Fat Service (Direct ORM)** tránh "lạm dụng trừu tượng" và boilerplate khi Repository chỉ để gọi CRUD 1-1 của ORM.

- **Cơ chế hoạt động (How it works under the hood)**
  - **Repository Pattern**: `Client -> Service -> Repository Interface -> Implementation (ORM/SQL) -> Database`; Service chỉ biết Interface (`save(user: User)`), Implementation dịch thành truy vấn thật.
  - **Fat Service**: `Client -> Service (Direct ORM Queries) -> Database`; Service import thẳng instance DB/ORM (như `this.db` của Drizzle) và viết `select()`, `insert()`, `update()`, `delete()` trong hàm nghiệp vụ.

## Practical Implementation

- **Trade-offs (So sánh và Đánh đổi)**:

  | Tiêu chí                      | Repository Pattern                                              | Fat Service (Direct ORM)                                        |
  | :---------------------------- | :-------------------------------------------------------------- | :-------------------------------------------------------------- |
  | **Độ phức tạp (Boilerplate)** | **Cao**: phải viết Interface, class cụ thể, DTO mapping.        | **Thấp**: viết truy vấn trực tiếp trong Service.                |
  | **Sự phụ thuộc (Coupling)**   | **Thấp**: độc lập với DB/ORM công nghệ (Persistence Ignorance). | **Cao**: Service gắn chặt vào ORM cụ thể (như Drizzle).         |
  | **Khả năng Unit Test**        | **Rất dễ**: chỉ cần mock Repository Interface.                  | **Trung bình**: phải mock Database Connection hoặc API của ORM. |
  | **Tối ưu hiệu năng Query**    | **Khó**: khó tận dụng Lazy loading, Dynamic Join của ORM.       | **Rất dễ**: tự do tối ưu truy vấn trực tiếp từ ORM.             |
  | **Phù hợp nhất**              | Hệ thống lớn, Domain Model phức tạp (DDD), nhiều nguồn DB.      | CRUD-heavy, vừa và nhỏ, dùng ORM mạnh (Prisma, Drizzle).        |

- **Code Snippet (TypeScript & Drizzle ORM)**:

  ### Cách 1: Triển khai với Repository Pattern (Clean Architecture)

  ```typescript
  // 1. Domain Entity
  export interface User {
    id: string;
    email: string;
    currentDebt: number;
  }

  // 2. Repository Interface (Domain/Application Layer)
  export interface UserRepository {
    findById(id: string): Promise<User | null>;
    updateDebt(id: string, amount: number): Promise<void>;
  }

  // 3. Repository Implementation (Infrastructure Layer)
  import { db } from "../db";
  import { users } from "../schema";
  import { eq } from "drizzle-orm";

  export class DrizzleUserRepository implements UserRepository {
    async findById(id: string): Promise<User | null> {
      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return row
        ? {
            id: row.id,
            email: row.email,
            currentDebt: parseFloat(row.currentDebt),
          }
        : null;
    }

    async updateDebt(id: string, amount: number): Promise<void> {
      await db
        .update(users)
        .set({ currentDebt: String(amount) })
        .where(eq(users.id, id));
    }
  }

  // 4. Service Layer (Chỉ biết Interface)
  export class UserService {
    constructor(private userRepo: UserRepository) {}

    async incrementDebt(id: string, orderTotal: number) {
      const user = await this.userRepo.findById(id);
      if (!user) throw new Error("User not found");
      await this.userRepo.updateDebt(id, user.currentDebt + orderTotal);
    }
  }
  ```

  ### Cách 2: Triển khai với Fat Service Pattern (Direct ORM)

  ```typescript
  import { eq } from "drizzle-orm";
  import { users } from "../schema";
  import { type PgDatabase } from "drizzle-orm/pg-core";

  export class UserService {
    // Inject trực tiếp Drizzle Database instance qua Constructor
    constructor(private db: PgDatabase<any, any>) {}

    async incrementDebt(id: string, orderTotal: number) {
      // Viết trực tiếp query trong service để giảm boilerplate
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      if (!user) throw new Error("User not found");

      const currentDebt = parseFloat(user.currentDebt || "0");

      await this.db
        .update(users)
        .set({ currentDebt: String(currentDebt + orderTotal) })
        .where(eq(users.id, id));
    }
  }
  ```

---

**Related Notes:**

- Kiến trúc phân tầng kinh điển: [[Layered_Architecture]]
- Tách biệt nghiệp vụ cốt lõi: [[Clean_Architecture]]
- Kỹ thuật giảm coupling: [[Dependency_Injection]]
- Quản lý giao dịch khi dùng Direct ORM: [[Outbox_Pattern]]
