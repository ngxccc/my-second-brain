---
tags: [type/concept, status/permanent]
date: 2026-05-01
description: "Vòng lặp phụ thuộc tai hại giữa các module và cách giải quyết."
---

# Circular Dependency

## TL;DR

- **Bản chất**: Circular dependency là chu trình trong dependency graph, khi hai hay nhiều module phụ thuộc lẫn nhau trực tiếp hoặc gián tiếp.
- **Mục đích**: Giải thích vì sao nó làm module loader trả `undefined`, crash lúc khởi động, và phá khả năng test độc lập.
- **Điểm mấu chốt**: Kiến trúc đúng là DAG một chiều; mọi vòng lặp vi phạm Acyclic Dependencies Principle, và chỗ hay sinh vòng nhất là Shared layer import ngược lại Feature.

## Core Concept

- **Vấn đề cốt lõi:** Kiến trúc phần mềm tốt phải là Directed Acyclic Graph (DAG) – luồng phụ thuộc chỉ được phép một chiều. Circular Dependency phá vỡ nguyên tắc này, khiến module loader (Node.js, bundler, DI container) không thể xác định thứ tự khởi tạo.
- **Tight Coupling & Hậu quả:** Hai module dính chặt vào nhau, mất khả năng tái sử dụng độc lập, Unit Test khó viết và dễ sinh runtime error (undefined module hoặc initialization failure).
- **Nguyên tắc bị vi phạm:** Vi phạm nặng **Acyclic Dependencies Principle (ADP)** và **Stable Dependencies Principle (SDP)** – Shared/Common layer tuyệt đối không được phụ thuộc ngược lại Feature modules.

## Practical Implementation

- **Trade-offs & Rủi ro:** Trong Modular Monolith, circular dependency là ác mộng phổ biến nhất: `UserService` import `PostService` để đếm bài viết, còn `PostService` import ngược lại `UserService` để lấy info tác giả → app crash ngay lúc start. Ngoài ra còn làm chậm static analysis tools và khó refactor khi codebase scale.
- **Cách khắc phục chính:**
  1. **Extract common logic** ra module Shared/Common (ưu tiên, phải tuân thủ Shared Module Dependency Rule).
  2. **Dependency Injection** + Interface để đảo ngược chiều phụ thuộc.
  3. Sử dụng **Event Bus / Mediator** thay vì gọi trực tiếp.
  4. Áp dụng **Public Interface Pattern** để che giấu implementation nội bộ.

**Code Snippet:**

```typescript
//  BAD - Circular Dependency
// user.service.ts
import { PostService } from "../posts/post.service";

export class UserService {
  constructor(private postService: PostService) {}
}

// post.service.ts
import { UserService } from "../users/user.service";

export class PostService {
  constructor(private userService: UserService) {}
}
```

```typescript
//  GOOD - Break the cycle bằng Extraction + DI
// common/password-hasher.ts (Shared/Common)
export class PasswordHasher {
  static hash(password: string): string { ... }
}

// user.service.ts & post.service.ts đều depend vào Shared thay vì depend lẫn nhau
```

---

**Related Notes:**

- [[Shared_Module_Dependency_Rule]]
- [[Dependency_Injection]]
- [[Modular_Monolith_Architecture]]
- [[Public_Interface_Pattern]]
- [[Layered_Architecture]]
