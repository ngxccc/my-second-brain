---
tags: [type/concept, status/permanent]
date: 2026-06-24
description: "Phương pháp trang trí trong TypeScript chuẩn ES (Stage 3) vs cũ (experimentalDecorators)."
---

# TS Decorators

## TL;DR

- **Bản chất**: Decorator là hàm bậc cao bọc class, method hoặc property và chạy tại runtime; có hai thế hệ không tương thích: `experimentalDecorators` (Stage 2) và ES Decorators (Stage 3).
- **Mục đích**: Hiểu vì sao NestJS và TypeORM vẫn buộc dùng bản cũ, và bản chuẩn mới thay đổi ngữ nghĩa ở đâu.
- **Điểm mấu chốt**: Bản cũ nhận `(target, key, descriptor)` và có parameter decorator; bản mới nhận `(value, context)`, không có parameter decorator, nên DI của NestJS vẫn cần `emitDecoratorMetadata`.

---

## Core Concept

### 1. Bản Chất Của Decorator

- **Bản chất kỹ thuật:** decorator là hàm bậc cao (higher-order function).
- **Cách thức:** khi viết `@decoratorName` trước một phần tử của Class, TypeScript bọc phần tử đó bằng hàm decorator để theo dõi hoặc thay thế hành vi trước khi nó được khởi tạo.

### 2. Sự Khác Biệt Giữa 2 Thế Hệ Decorator

Sự tiến hóa của ECMAScript dẫn đến sự phân chia sâu sắc giữa 2 phiên bản Decorator trong hệ sinh thái TypeScript:

| Đặc tính                   | `experimentalDecorators` (Legacy - Stage 2)                                       | TS 5.0+ Standard (Modern - Stage 3)                                                                  |
| :------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Compiler Flag**          | Bắt buộc bật `"experimentalDecorators": true` trong `tsconfig.json`.              | Chạy mặc định không cần bật flag.                                                                    |
| **Chữ ký Hàm (Signature)** | Nhận dạng theo vị trí: `(target, propertyKey, descriptor)`                        | Nhận dạng hướng ngữ cảnh: `(value, context)`                                                         |
| **Đối tượng Context**      | Không có (chỉ có property descriptor truyền thống).                               | Có `DecoratorContext` chứa loại phần tử (`kind`), tên (`name`), và hook khởi tạo (`addInitializer`). |
| **Parameter Decorators**   | **Hỗ trợ** (Trang trí tham số của hàm/constructor).                               | **Không hỗ trợ** (Bị loại bỏ trong đặc tả Stage 3).                                                  |
| **Mục đích sử dụng**       | Dành cho các framework cũ hoặc IOC/DI truyền thống (NestJS, Angular cũ, TypeORM). | Cú pháp JavaScript tiêu chuẩn, chạy trực tiếp trên các runtime hiện đại mà không cần compiler.       |

---

## Practical Implementation

### 1. Cấu hình Compiler

Tùy vào việc mày muốn sử dụng phiên bản Decorator nào, mày cần cấu hình `tsconfig.json` tương ứng:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",

    // Bật nếu sử dụng Decorator cũ (như NestJS, TypeORM, Inversify)
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

### 2. Cách Viết Decorator Theo Chuẩn Mới

Hàm Decorator theo chuẩn mới nhận vào 2 tham số: `value` (giá trị cần trang trí) và `context` (ngữ cảnh của phần tử đó).

#### Ví dụ: Tạo `@Logged` cho Phương thức

```typescript
function Logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) {
  const methodName = String(context.name);

  // Trả về một hàm mới thay thế phương thức gốc
  return function (this: This, ...args: Args): Return {
    console.log(
      `[LOG] Bắt đầu gọi phương thức: ${methodName} với tham số:`,
      args,
    );
    const result = target.call(this, ...args);
    console.log(
      `[LOG] Kết thúc phương thức: ${methodName}, Kết quả trả về:`,
      result,
    );
    return result;
  };
}

class UserService {
  @Logged
  getUserById(id: number) {
    return { id, name: "Thành viên A" };
  }
}

const service = new UserService();
service.getUserById(10);
// Output console:
// [LOG] Bắt đầu gọi phương thức: getUserById với tham số: [10]
// [LOG] Kết thúc phương thức: getUserById, Kết quả trả về: { id: 10, name: 'Thành viên A' }
```

---

### 3. Cách Viết Decorator Theo Chuẩn Cũ

Hệ thống cũ can thiệp trực tiếp vào `PropertyDescriptor` của phương thức.

#### Ví dụ: Tạo `@ReadOnly` cho Thuộc tính

```typescript
function ReadOnly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  descriptor.writable = false;
  return descriptor;
}

class Configuration {
  @ReadOnly
  getApiKey() {
    return "API-KEY-SECRET-12345";
  }
}
```

#### Tại sao NestJS/TypeORM bắt buộc phải dùng chuẩn cũ?

1. **Parameter Decorators (Trang trí tham số):** NestJS phụ thuộc hoàn toàn vào trang trí tham số để thực hiện Dependency Injection (ví dụ: `constructor(@InjectRepository(User) private userRepo: Repository<User>)`). Tiêu chuẩn mới (Stage 3) hiện tại **không hỗ trợ** trang trí tham số.
2. **Metadata Emission:** NestJS cần flag `"emitDecoratorMetadata": true` của hệ thống cũ để tự động suy luận ra kiểu dữ liệu của class lúc runtime phục vụ cơ chế tự động inject instance (IoC Container).

---

### 4. Mẫu Câu Hỏi Phỏng Vấn

- Đã tách sang note riêng: [[TS_Decorators_Interview_QA]]

---

## Related Notes

- [[000_Tech_MOC]]
- Decorator là điểm tiêm phụ thuộc: [[Dependency_Injection]]
- Nguyên lý mà decorator giúp tuân thủ: [[SOLID_Principles]]
