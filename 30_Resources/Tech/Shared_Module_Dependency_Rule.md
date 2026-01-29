---
tags: [type/rule, topic/architecture, topic/clean-code]
status: evergreen
created_at: Thursday, January 29th 2026, 3:56:14 pm +07:00
updated_at: Thursday, January 29th 2026, 7:09:22 pm +07:00
---

# Shared Module Dependency Rule

## 💡 TL;DR
Quy tắc "Dòng chảy một chiều" (One-way Flow): Các Modules nghiệp vụ (`Auth`, `Order`) được phép phụ thuộc vào `Shared`, nhưng `Shared` **TUYỆT ĐỐI KHÔNG** được phụ thuộc ngược lại vào bất kỳ Module nào.

---

## 🔍 Deep Dive (Phân tích sâu)

### 1. The Hierarchy (Phân cấp)
Trong kiến trúc [[Modular_Monolith]], `Shared` (hay `Common` / `Core`) đóng vai trò là tầng **Hạ tầng cơ sở** (Infrastructure/Foundation).
* **Modules:** Là các tầng cao (High-level), chứa nghiệp vụ thay đổi liên tục.
* **Shared:** Là tầng thấp (Low-level), chứa các tiện ích ổn định, ít thay đổi.

### 2. The Dependency Rule (Luật bất biến)
* ✅ **Allow:** `Module A` --> `Shared` (Module A import tiện ích từ Shared).
* ❌ **Forbid:** `Shared` --> `Module A` (Shared import logic của Module A).
* ❌ **Forbid:** `Shared` chứa Business Logic (Ví dụ: Hàm tính giá tiền, Hàm check quyền User).

### 3. What belongs in Shared? (Phân loại rác)
Chỉ bỏ vào `Shared` những thứ **Generic** (Chung chung) mà dự án nào cũng dùng được:
* **Utils:** `date.util.ts`, `string.util.ts`, `currency.util.ts`.
* **Infrastructure:** `logger.service.ts`, `mailer.service.ts`, `upload.service.ts` (Wrapper cho AWS S3/Cloudinary).
* **Constants/Types:** `http-status.enum.ts`, `api-response.interface.ts`.
* **Middlewares:** `auth.middleware.ts`, `error-handler.middleware.ts`.

---

## 💻 Code / Example (Ví dụ thực tế)

### ✅ Correct Usage (Hợp lệ)
Module `Order` sử dụng hàm format ngày tháng từ `Shared`.

```typescript
// 📁 src/modules/order/order.service.ts
import { formatDate } from '../../shared/utils/date.util'; // ✅ OK

export class OrderService {
  create() {
    console.log(formatDate(new Date()));
  }
}
```

### ❌ Violation Example (Vi phạm nghiêm trọng)
Trong `Shared` lại đi gọi `UserService` để check quyền. Đây là lỗi **Circular Dependency** điển hình.

```typescript
// 📁 src/shared/middlewares/auth.middleware.ts
import { UserService } from '../../modules/user/user.service'; // ⛔ CẤM! Shared phụ thuộc ngược Module

export class AuthMiddleware {
  constructor(private userService: UserService) {} // 💣 BOOM
}
```

👉 **Cách sửa:** Middleware nên nhận data thông qua Interface hoặc Dependency Injection trừu tượng, không import trực tiếp class cụ thể của Module.

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

* **The Junk Drawer (Bãi rác):** Vì lười suy nghĩ nên cái gì cũng vứt vào `Shared`.
    * *Hậu quả:* Folder `Shared` phình to, trở thành "God Object". Khi sửa 1 file trong `Shared`, toàn bộ App phải build lại.
* **Hidden Coupling:** Đặt logic "Validate Discount" vào `Shared` vì nghĩ `Order` và `Cart` đều cần dùng.
    * *Tại sao sai?* Discount là nghiệp vụ bán hàng. Nếu sau này logic Discount thay đổi phức tạp, việc sửa file trong `Shared` có thể làm bug cả 2 module kia.
    * *Giải pháp:* Tạo hẳn một Module `Promotion` riêng và expose qua [[Public_Interface_Pattern]].

---

## 🔗 Related Keywords
* [[Modular_Monolith]]
* [[Circular_Dependency]]
* [[High_Cohesion_Low_Coupling]]
* [[Dependency_Inversion_Principle]]