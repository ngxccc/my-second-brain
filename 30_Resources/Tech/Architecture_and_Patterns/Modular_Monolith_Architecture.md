---
tags: [type/concept, status/permanent]
date: 2026-02-08
description: "Kiến trúc chia theo Domain/Feature (High Cohesion, Low Coupling)."
---

# Modular Monolith Architecture

## TL;DR

- **Bản chất**: Gom file theo domain hoặc feature (Auth, Orders) thay vì theo vai trò kỹ thuật, trong khi vẫn deploy một khối.
- **Mục đích**: Có ranh giới rõ như microservices mà không phải chịu chi phí vận hành hệ phân tán.
- **Điểm mấu chốt**: Giá trị đến từ high cohesion và low coupling thực thi bằng Public Interface; gom thư mục mà module vẫn chọc vào nhau thì chỉ là đổi tên Layered.

## Core Concept

- **Giải quyết Shotgun Surgery:** Trong kiến trúc cũ (Layered), để sửa một tính năng đăng nhập, em phải mở 4 thư mục khác nhau. Với Modular, mọi thứ liên quan đến `Auth` (API, Logic, Mongoose Schema) nằm gọn trong một thư mục `src/modules/auth`. (Co-location - Những gì thay đổi cùng nhau thì ở cùng nhau).
- **High Cohesion & Low Coupling:** - _Kết dính cao:_ Logic của module nào nằm trọn trong module đó.
  - _Phụ thuộc thấp:_ Các module giao tiếp với nhau như những "mini-app" độc lập, không được phép chọc sâu vào logic nội bộ của nhau.
- **Dependency Rule (Quy tắc phụ thuộc):** Tách biệt logic hạ tầng (Database connection, Logger, Error Handler) vào thư mục `src/common`. Quy tắc bất di bất dịch: `Modules` được phép gọi `Common`, nhưng `Common` CẤM được gọi ngược lại `Modules`.

## Practical Implementation

- **Trade-offs (Ác mộng Circular Dependency):** Rủi ro lớn nhất là vòng lặp phụ thuộc. Ví dụ: `UserService` import `PostService` để đếm bài viết, và `PostService` import ngược lại `UserService` để lấy thông tin tác giả $\rightarrow$ Ứng dụng sẽ crash ngay lúc khởi động do đụng độ scope.
- **Cách khắc phục:** Không import chéo trực tiếp. Sử dụng Dependency Injection, hoặc để các module giao tiếp thông qua một hệ thống Event Bus trung gian.
- **Code Snippet (Cấu trúc thư mục chuẩn):**

```text
src/
├── common/                 #  SHARED: Hạ tầng (Vô tri, không chứa nghiệp vụ)
│   ├── middlewares/        # Error Handler, Rate Limit
│   └── utils/              # Logger, JWT Helper
│
└── modules/                #  FEATURES: Nghiệp vụ (Domain)
    ├── auth/
    │   ├── auth.controllers.ts
    │   ├── auth.services.ts
    │   ├── auth.routes.ts
    │   └── models/RefreshToken.ts
    │
    └── users/
        ├── users.services.ts
        └── models/User.ts  # Mongoose Schema nằm ngay đây
```

---

**Related Notes:**

- Đối trọng (Kiến trúc cũ): [[Layered_Architecture]]
- Bước tiến hóa tiếp theo khi scale server: [[Microservices_Architecture]]
- Cách đóng gói API nội bộ của một module: [[Public_Interface_Pattern]]
