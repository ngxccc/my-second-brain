---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Hệ thống kiểu cấu trúc (Structural Typing), cơ chế xóa bỏ kiểu (Type Erasure) và cách thu hẹp kiểu an toàn với Type Predicates."
---

# TS Type System: Structural Typing & Type Erasure

## TL;DR

- **Bản chất**: TypeScript dùng structural typing (so khớp theo hình dạng) và xóa toàn bộ type khi compile, nên type không tồn tại ở runtime.
- **Mục đích**: Giải thích vì sao dữ liệu từ API vẫn phải validate, và vì sao hai type trùng hình dạng lại gán được cho nhau.
- **Điểm mấu chốt**: Muốn kiểm tra kiểu lúc chạy phải tự viết type guard hoặc type predicate `parameter is Type`; không có cơ chế runtime nào làm hộ.

---

## Core Concept

### 1. Structural Typing vs. Nominal Typing

- **Structural Typing (TypeScript):**
  - Định nghĩa: Khả năng tương thích kiểu được quyết định hoàn toàn bởi cấu trúc (thuộc tính và kiểu của thuộc tính) của đối tượng. Nếu đối tượng $A$ có đầy đủ các thuộc tính mà đối tượng $B$ yêu cầu, thì đối tượng $A$ được phép gán cho đối tượng $B$, bất kể chúng có tên khai báo khác nhau.
  - Phép so sánh trực quan: _"Nếu nó đi như một con vịt và kêu như một con vịt, thì nó là một con vịt"_.
- **Nominal Typing (Java, C#, C++):**
  - Định nghĩa: Khả năng tương thích kiểu được quyết định bởi tên khai báo (Class/Interface name) và quan hệ thừa kế tường minh. Dù hai Class có các thuộc tính giống hệt nhau 100%, chúng vẫn không thể gán cho nhau nếu không có quan hệ kế thừa trực tiếp.

### 2. Sự biến mất của Kiểu ở Runtime: Type Erasure

TypeScript chỉ hoạt động như một lớp xác thực tĩnh (Static Analysis) trong quá trình viết code và build:

- Khi biên dịch (transpile) sang JavaScript, trình biên dịch `tsc` thực hiện **Type Erasure**: xóa sạch toàn bộ từ khóa `interface`, `type`, `as`, `generic` `<T>`, và các khai báo kiểu `: string`, `: number`.
- **Hậu quả:** Ở runtime, trình duyệt hoặc môi trường Bun/Node.js chỉ chạy mã JavaScript thuần. Do đó, các câu lệnh dạng `if (user instanceof UserInterface)` sẽ ném ra lỗi Runtime Error vì `UserInterface` không hề tồn tại trong bộ nhớ.

### 3. Giải pháp Runtime: Type Guards & Type Predicates

Vì kiểu dữ liệu biến mất ở runtime, để kiểm tra dữ liệu thực tế (nhất là khi nhận dữ liệu thô từ HTTP API hoặc database), ta phải dùng các kỹ thuật kiểm tra kiểu chạy (Runtime Type Checking):

- **Type Guards:** Sử dụng các toán tử của JavaScript như `typeof` (cho kiểu nguyên thủy) và `instanceof` (cho Class thực sự khởi tạo bằng `new`).
- **Type Predicates (User-Defined Type Guards):**
  - Là các hàm kiểm tra tự viết có kiểu trả về dạng đặc biệt: `parameterName is Type`.
  - Nó báo cho TypeScript Compiler biết: _"Nếu hàm này trả về true, thì biến truyền vào chắc chắn thuộc kiểu dữ liệu này ở các dòng code tiếp theo"_, giúp trình biên dịch tự động thu hẹp kiểu (Type Narrowing) một cách an toàn.

---

## Practical Implementation

### 1. Minh họa Type Erasure

#### Mã nguồn TypeScript

```typescript
interface Dealer {
  id: string;
  tier: "GOLD" | "SILVER";
}

function processDealer(dealer: Dealer) {
  console.log(dealer.tier);
}
```

#### Mã JavaScript thực thi sau khi Compile

Toàn bộ `interface` và đặc tả kiểu dữ liệu bị **xóa sạch**:

```javascript
function processDealer(dealer) {
  console.log(dealer.tier);
}
```

### 2. Viết Custom Type Guard để Validate dữ liệu từ API

Dự án Hyundai B2B cần phân biệt giữa tài khoản `Contractor` và `Dealer` từ API trả về để áp dụng chiết khấu:

```typescript
interface Contractor {
  id: string;
  companyName: string;
  taxCode: string;
}

interface Dealer {
  id: string;
  tier: "GOLD" | "SILVER";
  discountRate: number;
}

// Hàm kiểm tra kiểu tự định nghĩa (Type Predicate)
function isDealer(user: Contractor | Dealer): user is Dealer {
  // Kiểm tra sự tồn tại của thuộc tính đặc trưng ở runtime
  return "tier" in user && "discountRate" in user;
}

function calculateOrderTotal(user: Contractor | Dealer, basePrice: number) {
  if (isDealer(user)) {
    // Trong block này, TypeScript tự động hiểu 'user' là 'Dealer'
    return basePrice * (1 - user.discountRate);
  }

  // Ngoài block này, TypeScript hiểu 'user' là 'Contractor'
  console.log(`Calculating price for company: ${user.companyName}`);
  return basePrice;
}
```

---

## Interview Prep

- Đã tách sang note riêng: [[TS_Type_System_Interview_QA]]

---

## Related Notes

- [[000_Tech_MOC]]
- Cơ chế Runtime: [[JS_Runtimes_Bun_vs_NodeJS]]
- Tối ưu hóa bộ nhớ: [[JS_Stack_vs_Heap_Memory]]
