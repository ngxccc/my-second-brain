---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "Thiết kế hướng tên miền, giải quyết độ phức tạp của nghiệp vụ cốt lõi."
---

# Domain-Driven Design

## TL;DR

- **Bản chất**: DDD mô hình hóa nghiệp vụ cốt lõi bằng Ubiquitous Language và chia hệ thống thành các Bounded Context.
- **Mục đích**: Quản lý độ phức tạp nghiệp vụ, để code phản ánh domain chứ không phản ánh cấu trúc kỹ thuật.
- **Điểm mấu chốt**: Cùng một từ như `Order` mang nghĩa khác nhau ở hai Bounded Context; gộp chúng lại thành một model dùng chung là nguồn lỗi.

## Core Concepts

1. **Ubiquitous Language (Ngôn ngữ chung)**:
   - Tất cả các bên tham gia (Developers, Business Analysts, Domain Experts) đều phải dùng chung một bộ từ vựng thống nhất cho các khái niệm nghiệp vụ (ví dụ: `Order`, `Checkout`, `CartItem`). Tránh việc Developer dùng thuật ngữ kỹ thuật (`Record`, `DBRow`) thay thế cho thuật ngữ nghiệp vụ.

2. **Bounded Context (Bối cảnh có ranh giới)**:
   - Ranh giới phân chia hệ thống nơi mà mô hình nghiệp vụ được áp dụng thống nhất.
   - Ví dụ: Cùng một khái niệm `User`, nhưng trong bối cảnh Bán hàng (`Sales Context`) nó là `Customer`, còn trong bối cảnh Vận chuyển (`Shipping Context`) nó là `Recipient`. Mỗi context sẽ có mô hình dữ liệu và code độc lập.

3. **Core Building Blocks (Thành phần cấu trúc chính)**:
   - **Entity**: Thực thể có định danh duy nhất (Identity) không đổi theo thời gian (ví dụ: `User` với `userId`).
   - **Value Object**: Đối tượng không có định danh, chỉ mang giá trị, nếu thay đổi giá trị là tạo đối tượng mới (ví dụ: `Address`, `Money`).
   - **Aggregate**: Tập hợp các Entity và Value Object đi liền nhau, được quản lý thông qua một gốc duy nhất (**Aggregate Root**). Mọi thao tác ghi/sửa đều phải đi qua Aggregate Root này.
   - **Repository**: Tầng trừu tượng hóa việc lưu trữ và truy xuất các Aggregates từ Database.

---

## Related Notes

- Tổng quan kiến trúc & mẫu thiết kế: [[000_Tech_MOC]]
