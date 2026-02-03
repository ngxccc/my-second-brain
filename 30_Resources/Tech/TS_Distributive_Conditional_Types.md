---
tags: [type/concept, lang/typescript, topic/advanced-types, topic/generics]
status: seeding
created_at: <% tp.file.creation_date("dddd, MMMM Do YYYY, h:mm:ss a Z") %>
updated_at: <% tp.file.last_modified_date("dddd, MMMM Do YYYY, h:mm:ss a Z") %>
aliases: [Distributive Conditional Types, TypeScript Union Distribution, Disable Distribution]
---

# TypeScript Distributive Conditional Types

## 💡 TL;DR

Là cơ chế mặc định của TypeScript khi xử lý Generic Type là một **Union**: Nó sẽ tự động "xé lẻ" Union ra để so sánh từng phần tử (giống vòng lặp `forEach`). Cần đặc biệt chú ý khi check type `never` để tránh bug logic nghiêm trọng.

---

## 🧠 Why use it?

*(Tại sao nó tồn tại và giải quyết vấn đề gì?)*

- **Problem:** Khi ta truyền một Union (`string | number`) vào một Generic Conditional Type (`T extends U ? X : Y`), ta thường muốn kết quả trả về là sự kết hợp của từng trường hợp con, thay vì so sánh nguyên cục Union đó với điều kiện.

- **Solution:** TypeScript tự động phân phối (distribute) điều kiện cho từng thành phần của Union.
    - $$(A | B) \text{ extends } U \rightarrow (A \text{ extends } U) | (B \text{ extends } U)$$

- **The Catch (Cái bẫy):** Đôi khi ta **không muốn** hành vi này (ví dụ: muốn kiểm tra chính xác một type có phải là `never` hay không, hoặc muốn so sánh nguyên cả cụm Union).

---

## 🔍 Deep Dive

*(Cơ chế Under-the-hood)*

1.  **Naked Type Parameter:** Cơ chế phân phối chỉ kích hoạt khi `T` là một "Naked Type" (Generic đứng trần trụi, không bị bọc bởi Array, Tuple, hay Promise).
2.  **Set Theory (Lý thuyết tập hợp):**
    - `never` được coi là một **Tập rỗng** ($\emptyset$).
    - Khi `T` là `never`, quá trình phân phối giống như chạy vòng lặp trên một mảng rỗng -> Code bên trong điều kiện không bao giờ chạy -> Trả về `never`.

---

## 💻 Code Snippet / Implementation

*(Best Practices để xử lý hành vi này)*

```typescript
// ---------------------------------------------------------
// CASE 1: Hành vi mặc định (Distributive - Giống forEach)
// ---------------------------------------------------------
type ToArray<T> = T extends any ? T[] : never;

// Kết quả: string[] | number[] (Nó tách ra từng cái rồi mới bọc Array)
type DistributiveResult = ToArray<string | number>;


// ---------------------------------------------------------
// CASE 2: Tắt phân phối (Disable Distribution - Giống so sánh nguyên cục)
// Kỹ thuật: "Nhốt vào lồng" (Tuple Wrapping)
// ---------------------------------------------------------
type ToArrayFixed<T> = [T] extends [any] ? T[] : never;

// Kết quả: (string | number)[] (Nó coi nguyên cục là 1 item)
type NonDistributiveResult = ToArrayFixed<string | number>;


// ---------------------------------------------------------
// CASE 3: The "IsNever" Utility (Quan trọng nhất)
// ---------------------------------------------------------

// ❌ SAI: Vì never là tập rỗng, vòng lặp không chạy -> trả về never
type IsNeverWrong<T> = T extends never ? true : false;
type TestWrong = IsNeverWrong<never>; // Kết quả: never

// ✅ ĐÚNG: Bọc vào tuple để so sánh [never] vs [never]
type IsNever<T> = [T] extends [never] ? true : false;
type TestRight = IsNever<never>; // Kết quả: true
```

---

## ⚠️ Edge Cases / Pitfalls

*(Kinh nghiệm xương máu khi làm việc với Generics)*

### The "Never" Paradox

- ❌ **Don't:** Kiểm tra `never` trực tiếp bằng `T extends never`.
    ```typescript
    type Check<T> = T extends never ? 'YES' : 'NO';
    // Check<never> sẽ trả về never, làm hỏng logic code phía sau.
    ```

- ✅ **Do:** Luôn bọc `[T]` và `[never]` khi muốn kiểm tra sự tồn tại của `never`.
    ```typescript
    type Check<T> = [T] extends [never] ? 'YES' : 'NO';
    ```

### Naked Type Condition

- ❌ **Don't:** Nghĩ rằng lúc nào nó cũng phân phối.
    ```typescript
    // T không còn là "naked" vì bị bọc trong Box<T>
    type Box<T> = { value: T };
    type CheckBox<T> = Box<T> extends Box<string> ? true : false;
    
    // string | number -> Không phân phối -> Box<string | number> so với Box<string> -> False
    type Result = CheckBox<string | number>; 
    ```

---

## 🚨 Troubleshooting

*(Các lỗi thường gặp)*

### 🔧 Lỗi kết quả trả về là `never` thay vì `boolean`

- **Hiện tượng:** Bạn viết một Utility Type để check điều kiện, nhưng khi truyền `never` vào thì nó không ra `true/false` mà ra `never`.
- **Nguyên nhân:** Do tính chất phân phối trên tập rỗng.
- **Cách fix:** Bọc Generic `T` và điều kiện `Extends` vào trong ngoặc vuông `[]`.

```typescript
// Fix
type MyCondition<T> = [T] extends [SomeType] ? true : false;
```

---

## 📄 Advanced Mechanics

*(Kiến thức mở rộng)*

### Biến thể `Exclude` và `Extract`

TypeScript tận dụng tính chất phân phối này để xây dựng các Utility Types có sẵn:

```typescript
// Exclude hoạt động bằng cách phân phối T, nếu T trùng U thì loại bỏ (never), không thì giữ lại.
type MyExclude<T, U> = T extends U ? never : T;
```

### Distributive Conditional Types với Union lớn

Nếu Union quá lớn (ví dụ union của 10.000 string literals), việc phân phối này có thể gây áp lực lớn lên trình biên dịch (Compiler Performance), gây chậm IDE. Trong trường hợp đó, nên cân nhắc tắt phân phối nếu logic cho phép.

---

## 🔗 Connections

### Internal

- [[Union Types]] - Nguồn gốc của hành vi phân phối.
- [[Never Type]] - Edge case quan trọng nhất của concept này.
- [[Tuple Types]] - Công cụ để tắt tính năng phân phối.

### External

- [TS Handbook: Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
- [Total TypeScript: The Distributive Conditionals Guide](https://www.totaltypescript.com)