---
tags: [type/concept, topic/architecture, lang/typescript, pattern/clean-code]
status: seeding        # seeding, sapling, evergreen, active
created_at: Thursday, January 29th 2026, 3:56:14 pm +07:00
updated_at: Sunday, February 8th 2026, 12:01:29 pm +07:00
aliases: [SDP, Stable Dependencies Principle, Circular Dependency Avoidance]
---

# Shared Module Dependency Rule

## 💡 TL;DR

Quy tắc "Một chiều" bất di bất dịch trong kiến trúc phần mềm: Feature Modules được phép import Shared Modules, nhưng Shared Modules **tuyệt đối không** được biết hay import bất cứ thứ gì từ Feature Modules.

---

## 🧠 Why use it?

*(Tại sao phải khắt khe như vậy? Import lung tung tí có sao đâu?)*

- **Problem:**
    - **Circular Dependency (Vòng lặp phụ thuộc):** Module A cần B để chạy, B cần A để chạy. Kết quả: App crash ngay lúc khởi động (`ReferenceError` hoặc `Maximum call stack`).
    - **Spaghetti Code:** Logic của Business (Feature) bị rò rỉ vào UI Library (Shared), khiến Shared không thể tái sử dụng (Reusable) ở dự án khác.
    - **Fragility:** Sửa một Feature nhỏ nhưng lại làm hỏng một Component dùng chung, kéo theo 10 Feature khác hỏng theo.

- **Solution:**
    - **Strict Unidirectional Flow:** $Feature \rightarrow Shared$.
    - **Stable Dependencies Principle (SDP):** Chỉ phụ thuộc vào những thứ ổn định hơn mình. Shared (ít thay đổi) ổn định hơn Feature (thay đổi liên tục).

- **vs Alternative:**
    - **vs Monolithic Utils:** Gom tất cả vào một file `utils.js` khổng lồ. Cách này nhanh lúc đầu nhưng "ác mộng" khi bảo trì vì không biết hàm nào thuộc về feature nào.

## 🔍 Deep Dive

*(Mổ xẻ vấn đề theo phong cách Giáo sư Tom 🎓)*

1.  **Principle 1: The Stability Gradient (Độ dốc của sự ổn định)**
    - Trong đồ thị Dependency, các mũi tên luôn trỏ về phía component "khó thay đổi" nhất.
    - `Shared` là nơi chứa: UI Kit (Button, Input), Helper (Date format), Types cơ bản. Những thứ này thay đổi rất ít.
    - `Feature` là nơi chứa: Business Logic, Page Layout. Những thứ này thay đổi theo yêu cầu khách hàng hàng ngày.
    - $\therefore$ Feature phải phụ thuộc vào Shared.

2.  **Principle 2: The "Sink" Node (Nút thoát)**
    - Trong lý thuyết đồ thị (Graph Theory), `Shared Module` phải là một "Sink Node" – tức là chỉ có mũi tên đi vào, không có mũi tên đi ra (tới các module nội bộ khác). Nó là điểm tận cùng của chuỗi phụ thuộc.

---

## 💻 Code Snippet / Implementation

*(Implementation theo phong cách Kỹ sư Raizo 🔧 - TypeScript/React)*

```tsx
// ❌ BAD: Shared Component biết quá nhiều về Business Logic
// File: src/shared/components/UserCard.tsx
import { User } from '../../features/auth/types'; // ⛔ VI PHẠM: Import ngược từ Feature
import { goToProfile } from '../../features/profile/routes'; // ⛔ VI PHẠM: Hard dependency vào routing

export const UserCard = ({ user }: { user: User }) => {
  return (
    <div onClick={() => goToProfile(user.id)}> {/* Chết dí ở đây, không tái sử dụng được */}
      {user.fullName}
    </div>
  );
};

// ✅ GOOD: Shared Component "Dumb" & "Generic"
// File: src/shared/components/Card.tsx
// Component này không biết User là ai, chỉ biết hiển thị title và handle click
interface CardProps {
  title: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Card = ({ title, onClick, variant = 'primary' }: CardProps) => {
  return (
    <div className={`card-${variant}`} onClick={onClick}>
      {title}
    </div>
  );
};
```

**🔧 Usage tại Feature Layer**

```tsx
// File: src/features/dashboard/DashboardPage.tsx
import { Card } from '../../shared/components/Card'; // ✅ Feature import Shared

export const DashboardPage = () => {
  const user = { id: 1, name: "Raizo" };
  
  return (
    <Card 
      title={user.name} 
      onClick={() => navigate(`/profile/${user.id}`)} // Logic điều hướng nằm ở Feature
    />
  );
};
```

---

## ⚠️ Edge Cases / Pitfalls

_(Những cái hố mà dev hay lọt xuống)_

### 1. Navigation & Routing

- ❌ **Don't:** Import `useRouter` hoặc hardcode đường dẫn URL (`/users/123`) bên trong Shared Component. Điều này biến Shared thành Feature.
    
- ✅ **Do:** Truyền function `onNavigate` hoặc `onClick` từ Feature xuống Shared. Hoặc dùng **Dependency Injection** nếu logic quá phức tạp.
    

### 2. Global Types

- ❌ **Don't:** Định nghĩa type `User` (Business Entity) trong `Shared`. Vì nếu `User` thay đổi logic, `Shared` phải sửa theo.
    
- ✅ **Do:** `Shared` chỉ nên chứa các type nguyên thủy (Primitive) hoặc Generic (`<T>`). Type `User` nên nằm ở `features/auth` hoặc một module `domain/entities` riêng biệt (nếu theo Domain Driven Design).
    

### 3. "God" Shared Folder

- ❌ **Don't:** Nhét tất cả mọi thứ vào `src/shared`.
    
- ✅ **Do:** Phân tách rõ ràng:
    
    - `src/shared/ui` (Components)
        
    - `src/shared/utils` (Functions)
        
    - `src/shared/hooks` (React Hooks)
        

---

## 🚨 Troubleshooting

_(Dấu hiệu nhận biết bạn đang "phá luật")_

### 🔧 Circular Dependency Detected

- **Lỗi:** Webpack/Vite báo warning `Circular dependency detected: src/shared/A.ts -> src/features/B.ts -> src/shared/A.ts`.
    
- **Triệu chứng:** Biến `undefined` một cách bí ẩn, hoặc app crash trắng trang.
    
- **Fix:**
    
    1. Check file `import` trong folder `shared`.
        
    2. Tìm xem có dòng nào `import ... from '../../features/...'` không.
        
    3. Nếu có, **Refactor** ngay:
        
        - Cách 1: Chuyển logic đó từ Shared lên Feature.
            
        - Cách 2: Tách logic chung đó ra một file thứ 3 (Shared Core) mà cả 2 đều import được.
            

---

## 📄 Advanced Mechanics

_(Dành cho các pháp sư Architect)_

### Dependency Inversion Principle (DIP) in Shared Modules

Đôi khi Shared Module _cần_ thực hiện một hành động phức tạp (như gọi API logging, check permission) mà không muốn phụ thuộc vào Feature.

- **Giải pháp:** Define một **Interface** trong Shared, và bắt Feature (lúc khởi tạo App) phải **Inject** implementation vào.
    
- **Ví dụ:** `SharedLogger` định nghĩa interface `log(msg: string)`. `AppModule` sẽ inject `SentryLogger` hoặc `ConsoleLogger` vào `SharedLogger`. Shared chỉ gọi `log()`, không quan tâm ai thực hiện nó.
    

---

## 🔗 Connections

### Internal

- [[Modular_Monolith_Architecture]] (Kiến trúc tổng thể)
    
- [[Layered_Architecture]] (Phân tầng logic)
    
- [[Solid_Principles]] (Nền tảng của Dependency Inversion)

### External

- [Uncle Bob's Stable Dependencies Principle](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)
    
- [Madge - Tool check Circular Dependency](https://github.com/pahen/madge)