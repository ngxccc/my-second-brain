---
tags: [type/concept, topic/architecture, topic/backend]
status: evergreen
created_at: Thursday, January 29th 2026, 3:56:14 pm +07:00
updated_at: Thursday, January 29th 2026, 7:09:12 pm +07:00
---

# Modular Monolith Architecture

## 💡 TL;DR
Một kiến trúc phần mềm "lai" kết hợp sự tổ chức code rạch ròi theo nghiệp vụ của **Microservices** nhưng vẫn giữ nguyên mô hình deploy một khối đơn giản của **Monolith**. Đây là lựa chọn tối ưu cho Startups và Đồ án tốt nghiệp.

---

## 🔍 Deep Dive (Phân tích sâu)

### 1. The Core Problem (Vấn đề cốt lõi)
* **Traditional Monolith (Layered):** Code chia theo lớp kỹ thuật (`Controllers`, `Services`, `Models`). Khi dự án phình to, logic nghiệp vụ bị phân tán, dẫn đến "Spaghetti Code" (mì ăn liền rối nùi), sửa chỗ này hỏng chỗ kia.
* **Microservices:** Chia nhỏ thành nhiều service chạy độc lập. Quá phức tạp về hạ tầng (DevOps), giao tiếp mạng (Latency) và chi phí vận hành với các team nhỏ.

### 2. The Solution (Giải pháp)
**Modular Monolith** giữ tất cả code trong **một Repository và một Process (Runtime)** duy nhất, nhưng bên trong được chia tách nghiêm ngặt thành các **Modules** dựa trên **Domain** (Nghiệp vụ).

* **High Cohesion:** Mọi thứ liên quan đến `User` (API, DB, Logic) nằm gọn trong folder `User`.
* **Low Coupling:** Các module không được biết nội tình của nhau, chỉ giao tiếp qua "Cổng chính" (Public Interface).

### 3. Architecture Rules (Quy tắc vàng)
1.  **Domain Split:** Folder structure phải chia theo Features (`Auth`, `Order`, `Payment`), không chia theo Tech layer.
2.  **Encapsulation:** Mỗi module có phần `Internal` (Riêng tư) và `Public API` (Công khai). Module A không được `import` trực tiếp class nội bộ của Module B.
3.  **Shared Kernel:** Code dùng chung (Utils, Helpers) để ở folder `Shared`, nhưng `Shared` không được chứa Business Logic.

---

## 💻 Code / Example (Ví dụ thực tế)

### Folder Structure Comparison

```text
❌ Layered Architecture (Cũ - Dễ rối)
src/
  controllers/  (Trộn lẫn Auth, Order, User...)
  services/     (Trộn lẫn logic)
  models/       (Trộn lẫn DB schema)

✅ Modular Monolith (Mới - Dễ bảo trì)
src/
  modules/
    auth/       (Trọn gói Auth: Controller + Service + Model)
    order/      (Trọn gói Order)
  shared/       (Logger, DateHelper...)
```

### Implementation of Boundary (Ranh giới)
Cách tạo "Cổng hải quan" (Public Interface) để Module khác gọi tới mà không vi phạm nguyên tắc đóng gói.

```typescript
// 📁 src/modules/product/index.ts (Barrier File)

// 1. Chỉ export những gì an toàn cho bên ngoài dùng
export * from './product.public.service';
export * from './dtos/product-response.dto';

// 2. GIẤU KỸ những thứ nội bộ (Repository, Internal Logic)
// ❌ export * from './internal/product.repository'; -> CẤM
```


---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

* **Circular Dependency (Vòng lặp chết chóc):** Module A gọi B, B gọi ngược lại A.
    * *Hậu quả:* App crash khi khởi động hoặc logic bị loop vô tận.
    * *Fix:* Refactor code chung ra `Shared`, hoặc dùng Event-Driven (Bắn sự kiện).
* **Leaky Abstraction (Rò rỉ trừu tượng):** Dev lười biếng `import` trực tiếp Database Model của Module khác để query cho nhanh.
    * *Hậu quả:* Mất tính độc lập. Sửa DB bên này, bên kia chết theo.
* **Distributed Transaction:** Khi 1 flow chạy qua 2 Modules (VD: Order -> Inventory). Nếu Order thành công mà Inventory lỗi, phải có cơ chế Rollback thủ công (vì không còn chung 1 transaction DB đơn giản nữa).

---

## 🔗 Related Keywords
* [[Public_Interface_Pattern]] (Cách giao tiếp giữa các module)
* [[Shared_Module_Dependency_Rule]] (Quy tắc dùng folder Shared)
* [[Domain_Driven_Design]] (Tư duy chia module theo nghiệp vụ)
* [[Microservices]] (Bước tiến hóa tiếp theo nếu cần scale)