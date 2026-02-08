---
tags: [type/concept, topic/backend, lang/typescript, framework/express, architecture]
status: seeding
created_at: Sunday, February 8th 2026, 11:16:07 am +07:00
updated_at: Sunday, February 8th 2026, 11:42:28 am +07:00
aliases: [Feature-Based Architecture, Vertical Slice Architecture, Domain-Driven Design Lite, Screaming Architecture, Modular Architecture]
---

# Modular Architecture (Backend)

## 💡 TL;DR

Là cách tổ chức dự án bằng cách **gom nhóm file theo chức năng nghiệp vụ** (Auth, User, Payment) thay vì gom theo vai trò kỹ thuật (Controller, Service, Model). Mục tiêu: High Cohesion (Kết dính cao) & Low Coupling (Phụ thuộc thấp).

Một kiến trúc phần mềm "lai" kết hợp sự tổ chức code rạch ròi theo nghiệp vụ của **Microservices** nhưng vẫn giữ nguyên mô hình deploy một khối đơn giản của **Monolith**.

---

## 🧠 Why use it?

_Kiến trúc Layered truyền thống (N-Tier) thường gặp vấn đề khi dự án scale lớn. Modular sinh ra để giải quyết điều đó._

- **Problem:**
    
    - **Shotgun Surgery:** Để sửa một tính năng (VD: Login), dev phải nhảy qua nhảy lại giữa 4-5 thư mục (`src/controllers`, `src/services`, `src/routes`, `src/models`).
        
    - **Spaghetti Dependencies:** Các service gọi lẫn nhau chằng chịt, khó tách ra khi muốn scale hoặc làm Microservices.
        
    - **Khó định vị:** Mở folder `controllers` ra thấy 50 file, không biết cái nào liên quan đến cái nào.
        
- **Solution:**
    
    - **Co-location:** Những gì thay đổi cùng nhau thì nên ở cùng nhau. File controller, service, route của `Auth` đều nằm trong `src/modules/auth`.
        
    - **Encapsulation:** Mỗi module giống như một "mini-app", chỉ giao tiếp với bên ngoài qua Interface giới hạn.
		
	- **High Cohesion:** Mọi thứ liên quan đến `User` (API, DB, Logic) nằm gọn trong folder `User`.
         
	- **Low Coupling:** Các module không được biết nội tình của nhau, chỉ giao tiếp qua "Cổng chính" (Public Interface).
        
- **vs Alternative:**
    
    - **vs Layered Architecture:** Layered tốt cho demo/app siêu nhỏ. Modular tốt cho app thực tế, scale vừa và lớn.
        
    - **vs Microservices:** Modular là bước đệm hoàn hảo (Modular Monolith). Bạn code chung 1 repo nhưng tư duy tách biệt, sau này tách service cực dễ.
        

---

## 🔍 Deep Dive

_Nguyên lý hoạt động dựa trên tư duy "First Principles" của Software Engineering._

1. **High Cohesion (Độ kết dính cao):** Code trong cùng một module phải liên quan mật thiết với nhau. Logic validate email đăng ký phải nằm cạnh logic tạo user trong DB.
    
2. **Low Coupling (Độ phụ thuộc thấp):** Các module không nên biết quá nhiều về nội tại của nhau. Module `Order` không được query trực tiếp bảng `User`, mà nên gọi qua `UserService`.
    
3. **Foundation Layer (Common/Shared):** Tách biệt các logic hạ tầng (Logger, Database Connect, Error Handler) vào thư mục `common` để các module cùng sử dụng.
    
4. **Dependency Rule:**
    
    - `Modules` được phép import `Common`.
        
    - `Common` **CẤM** import `Modules`.
        
    - `Module A` hạn chế import trực tiếp `Module B` (nếu cần, hãy dùng Service Interface hoặc Event Bus).

---

## 💻 Code Snippet / Implementation

_Cấu trúc thư mục chuẩn cho Node.js/Express theo hướng Modular._

```txt
src/
├── app.ts                  # App setup
├── server.ts               # Entry point
│
├── common/                 # 🟢 SHARED: Hạ tầng dùng chung (Vô tri, không nghiệp vụ)
│   ├── config/             # Environment variables
│   ├── constants/          # HTTP Status, Messages, Enums
│   ├── middlewares/        # Error Handler, Rate Limit
│   ├── utils/              # Logger, JWT Helper, Validation
│   └── types/              # Global Types
│
└── modules/                # 🔴 FEATURES: Nghiệp vụ (Domain)
    ├── auth/               # Module Xác thực
    │   ├── auth.controllers.ts
    │   ├── auth.services.ts
    │   ├── auth.routes.ts
    │   ├── auth.middlewares.ts # Middleware riêng cho Auth
    │   ├── auth.schemas.ts     # Validation Schema
    │   └── models/             # Model (Schema DB) của Auth
    │       └── RefreshToken.ts
    │
    ├── users/              # Module Người dùng
    │   ├── users.controllers.ts
    │   ├── users.services.ts
    │   └── models/
    │       └── User.ts
    │
    └── medias/             # Module Upload
        ├── medias.controllers.ts
        └── ...
```

---

## ⚠️ Edge Cases / Pitfalls

_Kinh nghiệm xương máu khi chuyển từ Layered sang Modular._

### 1. Circular Dependency (Vòng lặp ác mộng)

- ❌ **Don't:** Import chéo trực tiếp ở top-level.
    
    - `UserService` import `TweetService` (để lấy tweet của user).
        
    - `TweetService` import `UserService` (để lấy info tác giả).
        
    - => **Crash App** hoặc `undefined`.
        
- ✅ **Do:**
    
    - Dùng **Dependency Injection** (như NestJS) hoặc gán service qua setter method.
        
    - Với Mongoose Model: Dùng `ref: 'User'` (string) thay vì biến `User` class trực tiếp.
        
    - Dùng **Dynamic Import** (`await import(...)`) bên trong hàm nếu cần kíp.
        

### 2. Common vs Shared

- ❌ **Don't:** Nhét logic nghiệp vụ (ví dụ: `UserDTO`) vào `src/common`. `Common` chỉ nên chứa những thứ kỹ thuật thuần túy (Logger, DateHelper).
    
- ✅ **Do:** Nếu có logic nghiệp vụ dùng chung giữa các module, hãy tạo một module riêng (VD: `modules/shared`) hoặc cân nhắc lại thiết kế xem có nên duplicate code một chút để giảm coupling không.
    

---

## 🚨 Troubleshooting

### 🔧 Lỗi "Cannot access 'X' before initialization"

- **Nguyên nhân:** Circular Dependency. File A gọi File B, File B gọi lại File A.
    
- **Cách fix:**
    
    1. Check kỹ các file `index.ts` (Barrel files).
        
    2. Sử dụng `import type` nếu chỉ cần Type.
        
    3. Dùng kỹ thuật `forwardRef` (hoặc lazy load import).
        

### 🔧 Lỗi "Module not found" khi build

- **Nguyên nhân:** Cấu hình `tsconfig.json` hoặc `package.json` sai khi build (thường do alias path `@/`).
    
- **Cách fix:** Đảm bảo dùng `tsc-alias` hoặc config đúng `moduleResolution`. Nếu dùng `bun`, nó tự handle, nhưng coi chừng khi deploy node thuần.
    

---

## 📄 Advanced Mechanics

### Public Interface (Encapsulation)

Để module thực sự kín kẽ, hãy tạo file `index.ts` trong mỗi module.

TypeScript

```
// src/modules/auth/index.ts
export * from './auth.services';
export * from './auth.routes';
// KHÔNG export internal helper hay schema nội bộ
```

Các module khác chỉ được import từ `modules/auth/index.ts` chứ không chọc sâu vào `modules/auth/internal/helper.ts`.

### Screaming Architecture

Kiến trúc này tuân theo tư duy "Screaming Architecture" của Robert C. Martin. Khi nhìn vào cấu trúc thư mục `src/modules/`, bạn biết ngay ứng dụng này **LÀM GÌ** (bán hàng, mạng xã hội, tin tức...) thay vì nó được viết bằng framework gì.

---

## 🔗 Connections

### Internal

- [[Layered_Architecture]] (Kiến trúc cũ - đối trọng)
    
- [[Microservices]] (Hướng phát triển tiếp theo)
    
- [[Dependency_Injection]] (Kỹ thuật giải quyết phụ thuộc)

- [[Public_Interface_Pattern]] (Cách giao tiếp giữa các module)

- [[Shared_Module_Dependency_Rule]] (Quy tắc dùng folder Shared)

- [[Domain_Driven_Design]] (Tư duy chia module theo nghiệp vụ)

### External

- [NestJS Modules Documentation](https://docs.nestjs.com/modules) (Chuẩn mực của Modular trong Node.js)
    
- [Software Architecture Patterns by Mark Richards](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/)
    
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)