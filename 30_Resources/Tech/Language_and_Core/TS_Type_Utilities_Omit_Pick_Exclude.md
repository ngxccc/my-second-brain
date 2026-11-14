---
tags: [type/concept, status/permanent]
date: 2026-06-18
description: "So sánh chi tiết bản chất và phân biệt các tiện ích kiểu Omit, Pick, Exclude."
---

# TypeScript Type Utilities: Omit, Pick, Exclude

## TL;DR

- **Bản chất**: `Pick` và `Omit` tác động lên object type theo key; `Exclude` và `Extract` tác động lên union theo phần tử.
- **Mục đích**: Chọn đúng utility theo loại đầu vào thay vì viết lại mapped type thủ công.
- **Điểm mấu chốt**: Dùng `Omit` lên một union là lỗi phổ biến: nó không loại bỏ key khỏi từng nhánh mà áp lên toàn bộ union, cho ra kết quả không như mong đợi.

## Core Concept

### 1. Phân nhóm Utility Types

| Utility Type        | Đầu vào (Input) | Tác vụ (Operation)             | Bản chất bên dưới              |
| :------------------ | :-------------- | :----------------------------- | :----------------------------- |
| **`Pick<T, K>`**    | Object Type `T` | **Lấy ra** các key `K`         | `{ [P in K]: T[P] }`           |
| **`Omit<T, K>`**    | Object Type `T` | **Loại bỏ** các key `K`        | `Pick<T, Exclude<keyof T, K>>` |
| **`Exclude<T, U>`** | Union Type `T`  | **Loại bỏ** các thành viên `U` | `T extends U ? never : T`      |
| **`Extract<T, U>`** | Union Type `T`  | **Lấy ra** các thành viên `U`  | `T extends U ? T : never`      |

### 2. Sự khác biệt cốt lõi giữa Omit và Exclude

- **`Omit`** nhận đầu vào là một cấu trúc Object (có các cặp key-value). Nó sử dụng `keyof T` để lấy danh sách key và loại bỏ key được chỉ định.
- **`Exclude`** hoạt động trên danh sách các kiểu dữ liệu độc lập (Union). Nó sử dụng cơ chế **Distributive Conditional Type** để duyệt qua từng phần tử của Union và loại bỏ phần tử khớp điều kiện.

## Practical Implementation

### Ví dụ 1: Sử dụng `Pick` và `Omit` trên Object Type

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "dealer";
  createdAt: Date;
}

// Lấy ra chỉ id và name để hiển thị danh sách rút gọn
type UserSummary = Pick<User, "id" | "name">;
// { id: string; name: string; }

// Loại bỏ thông tin hệ thống khi trả về profile cho client
type UserProfileDTO = Omit<User, "createdAt">;
// { id: string; name: string; email: string; role: "admin" | "user" | "dealer"; }
```

### Ví dụ 2: Sử dụng `Exclude` trên Union Type

```typescript
type PaymentMethod = "PAYOS" | "CASH" | "TRADE_CREDIT";

// Loại bỏ hình thức thanh toán "TRADE_CREDIT" cho người dùng thông thường
type PublicPaymentMethod = Exclude<PaymentMethod, "TRADE_CREDIT">;
// Kết quả: "PAYOS" | "CASH"
```

### Ví dụ 3: Tại sao `Omit` thất bại trên Union Type?

Nếu cố tình dùng `Omit` để loại bỏ hình thức thanh toán `"TRADE_CREDIT"` khỏi Union `PaymentMethod`:

```typescript
// SAI LẦM:
type WrongPaymentMethod = Omit<PaymentMethod, "TRADE_CREDIT">;
```

**Bản chất lỗi:**

- `Omit` định nghĩa là `Pick<T, Exclude<keyof T, K>>`. Với `T = "PAYOS" | "CASH" | "TRADE_CREDIT"`, đây là union của string literal, nên `keyof T` trả về danh sách thuộc tính của object toàn cục `String` (`toString`, `length`, `valueOf`, ...).
- TypeScript loại bỏ thuộc tính `"TRADE_CREDIT"` khỏi object `String` chứ không loại phần tử `"TRADE_CREDIT"` khỏi Union; kết quả là `WrongPaymentMethod` không nhận được `"PAYOS"` hay `"CASH"`.

---

**Related Notes:**

- Cơ chế duyệt Union tự động: [[TS_Distributive_Conditional_Types]]
- [[000_Tech_MOC]]
