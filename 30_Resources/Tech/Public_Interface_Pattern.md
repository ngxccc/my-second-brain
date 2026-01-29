---
tags:
  - type/pattern
  - topic/architecture
  - topic/clean-code
status: evergreen
created_at: 2026-01-29
---

# Public Interface Pattern (Module Facade)

## 💡 TL;DR
Một mẫu thiết kế đóng vai trò là "Cổng giao tiếp" duy nhất của một Module, cho phép các Module khác gọi tính năng của nó mà không cần truy cập trực tiếp vào code nội bộ, giúp giảm sự phụ thuộc (Decoupling).

---

## 🔍 Deep Dive (Phân tích sâu)

### 1. Context (Bối cảnh)
Trong kiến trúc [[Modular_Monolith]], nếu Module A (Order) `import` trực tiếp Service hoặc Repository của Module B (Product) để kiểm tra tồn kho, chúng sẽ bị dính chặt vào nhau (High Coupling). Nếu Module B thay đổi logic nội bộ, Module A sẽ chết theo.

### 2. The Solution (Giải pháp)
Áp dụng tư duy **Encapsulation** (Đóng gói). Mỗi Module được coi như một "Hộp đen" hoặc một mini-service:
* **Private Area (Internal):** Chứa logic nghiệp vụ phức tạp, truy vấn Database, Domain Models. Không ai bên ngoài được thấy.
* **Public Area (Interface):** Một lớp vỏ bọc (Facade) chỉ chìa ra những hàm cần thiết cho bên ngoài dùng (ví dụ: `checkStock`, `getProductPrice`).

### 3. Benefits (Lợi ích)
* **Safety:** Ngăn chặn việc sửa đổi dữ liệu trái phép (VD: Module Order không thể tự ý update tên sản phẩm).
* **Refactoring:** Bạn có thể đập đi xây lại toàn bộ logic bên trong Module Product (thậm chí đổi từ SQL sang NoSQL) mà không làm hỏng Module Order, miễn là cái Public Interface giữ nguyên.

---

## 💻 Code / Example (Ví dụ thực tế)

Giả sử Module **Order** cần kiểm tra tồn kho từ Module **Product**.

### 1. Cấu trúc thư mục (File Structure)

```text
src/modules/product/
├── internal/               <-- ⛔ VÙNG CẤM (Private)
│   ├── product.repository.ts
│   ├── product.entity.ts   <-- Database Schema
│   └── product.service.ts  <-- Logic nội bộ phức tạp
├── dtos/
│   └── product-response.dto.ts
├── product.public.ts       <-- ✅ CỔNG GIAO TIẾP (Facade)
└── index.ts                <-- ✅ BARREL FILE
```

### 2. Code Implementation

**Bước 1: Tạo Public Service (Facade)**
Chỉ expose hàm `checkStock` đơn giản, giấu đi logic DB phức tạp.

```typescript
// src/modules/product/product.public.ts
import { Injectable } from '@nestjs/common';
import { ProductInternalService } from './internal/product.service';

@Injectable()
export class ProductPublicService {
  constructor(private readonly internalService: ProductInternalService) {}

  // Hàm này an toàn cho người ngoài dùng
  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.internalService.findOne(productId);
    if (!product) return false;
    return product.stock >= quantity;
  }
}
```

**Bước 2: Export tại Barrels (index.ts)**
Đây là chốt chặn cuối cùng. Chỉ export Public Service.

```typescript
// src/modules/product/index.ts
export * from './product.public';
export * from './dtos/product-response.dto';
// KHÔNG export internal service hay repository!
```

**Bước 3: Module khác sử dụng**

```typescript
// src/modules/order/order.service.ts
import { ProductPublicService } from '../product'; // Import từ cổng index

class OrderService {
  constructor(private readonly productService: ProductPublicService) {}

  async createOrder(item: any) {
    // Gọi qua Interface, không quan tâm Product lưu DB kiểu gì
    const isOk = await this.productService.checkStock(item.id, item.qty);
  }
}
```

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

* **Leaking Domain Entities:** Tuyệt đối không trả về `Entity` (Database Model) trong hàm Public. Hãy convert sang **DTO** (Data Transfer Object) trước khi trả về.
    * *Tại sao?* Nếu trả về Entity, Module bên ngoài có thể lỡ tay sửa field của Entity đó -> Phá vỡ tính toàn vẹn dữ liệu.
* **God Interface:** Đừng nhét tất cả mọi thứ vào Public Service. Chỉ expose những gì thực sự cần thiết (Need-to-know basis).

---

## 🔗 Related Keywords
* [[Modular_Monolith]]
* [[Shared_Module_Dependency_Rule]]
* [[Data_Transfer_Object_DTO]]
* [[Facade_Pattern]]