---
tags: [type/concept, topic/tech, api-data-design]
date: 2026-06-07
aliases: [Đặt tên Database, DB Naming, Database Naming Conventions]
---

# DB Naming Conventions

## TL;DR

Quy tắc đặt tên nhất quán giữa cơ sở dữ liệu (Database) và mã nguồn (TypeScript): Tên bảng vật lý trong DB dùng **số ít (Singular)**, còn tên biến ORM/TypeScript đại diện cho bảng dùng **số nhiều (Plural)**. Sự kết hợp này tối ưu hóa việc đọc hiểu thực thể dữ liệu ở tầng lưu trữ và thao tác tập hợp ở tầng mã nguồn.

## Rules & Rationales

### 1. Tên bảng vật lý trong DB: SỐ ÍT (Singular)

- **Quy tắc:** Đặt tên bảng là danh từ số ít (ví dụ: `user`, `session`, `product`).
- **Lý do (Rationale):**
  - Một bảng cơ sở dữ liệu đại diện cho một loại thực thể (Entity Type).
  - Mỗi bản ghi (Row) trong bảng đại diện cho một thực thể đơn lẻ (một `user`, một `session`).
  - Tránh rắc rối khi chuyển đổi số nhiều trong tiếng Anh (ví dụ: `category` vs `categories`, `person` vs `people`).
- **Ví dụ (SQL/Drizzle):**
  ```typescript
  // Định nghĩa bảng vật lý là 'user' (số ít)
  export const users = pgTable("user", {
    id: serial("id").primaryKey(),
    // ...
  });
  ```

### 2. Tên biến TypeScript (Variable Name): SỐ NHIỀU (Plural)

- **Quy tắc:** Đặt tên biến ORM/TypeScript đại diện cho bảng là danh từ số nhiều (ví dụ: `users`, `sessions`, `products`).
- **Lý do (Rationale):**
  - Trong mã nguồn, biến này đại diện cho một **tập hợp (Collection)** gồm nhiều thực thể.
  - Giúp câu lệnh truy vấn (Query) đọc lên tự nhiên và chuẩn cú pháp tiếng Anh.
- **Ví dụ (Drizzle query):**
  ```typescript
  // Đọc lên rất tự nhiên: "Select from users"
  const result = await db.select().from(users);
  ```

---

**Related Notes:**

- Hướng dẫn cấu trúc hệ thống: [[000_System_Structure]]
- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
