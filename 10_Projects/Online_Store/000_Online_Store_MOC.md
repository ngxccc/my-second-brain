---
tags: [type/project, status/active]
priority: Medium
deadline: 2026-07-27
stack: [Laravel 13, SQLite, Tailwind CSS, Blade, PHP ^8.3]
created_at: 2026-07-13
---

# Online Store

## Objective (SMART Goal)

- **Goal:** Xây dựng hệ thống cửa hàng trực tuyến (Online Store) sử dụng Laravel 13, SQLite và Tailwind CSS để phục vụ việc hiển thị danh mục sản phẩm, đặt hàng và quản lý cửa hàng tin cậy.
- **Outcome:**
  1. Thay đổi đồng bộ nhận diện thương hiệu từ "Laravel" thành "Online Store" ở tất cả các cấp độ cấu hình (`.env`, `config/`, views, tests).
  2. Xây dựng giao diện Responsive với Header & Footer hiện đại, trang chào mừng trực quan với danh mục sản phẩm, FAQ và CTA.
  3. Sử dụng Eloquent Attribute-First mới của Laravel 13 và PHP 8.3+ để quản lý các Models tinh giản.
  4. Đảm bảo 100% các ca kiểm thử tự động (Feature/Unit tests) chạy thành công.

## Tech Stack & Tools

- **Backend:** Laravel 13 (PHP ^8.3), Laravel Tinker, PHPUnit
- **Database:** SQLite
- **Frontend:** Blade, Tailwind CSS, Vite

## Roadmap / Milestones

- [ ] **Phase 1: Brand Alignment & Initial Layout** (Completed: 13/07/2026)
  - [x] Đồng bộ tên thương hiệu trên toàn bộ dự án (`config/app.php`, `config/logging.php`, `config/mail.php`, `.env.example`, `.env`).
  - [x] Thay đổi logo và thông tin Laravel thành Online Store tại Header, Footer và trang Welcome.
  - [x] Sửa lỗi database kiểm thử SQLite in-memory bằng `RefreshDatabase` trait.
- [ ] **Phase 2: Product Catalog & Database Setup** (Pending)
  - [ ] Thiết kế Database Schema cho bảng `products` (sử dụng Laravel 13 Eloquent Attributes).
  - [ ] Tạo controller, routes và views hiển thị danh sách sản phẩm.

## Work Log / Decisions

- **[13/07]:** Cập nhật toàn bộ các cấu hình liên quan đến tên thương hiệu từ Laravel sang Online Store. Giải quyết bài toán ghi đè của biến môi trường hệ thống trong terminal. Restructure tài liệu dự án trong Second Brain theo cấu trúc Project MOC và Docs/ phân khu.

## Related Resources

### Architecture & Specs

- Đặc tính mới của Laravel 13 & Eloquent Attributes: [[Laravel_13_Core_Features]]
- Hướng dẫn & So sánh Blade Component Layouts (x-layout) vs Legacy Inheritance (@extends): [[Laravel_Blade_Layouts]]
- Best Practices cho Laravel Routing & Named Routes: [[Laravel_Routing_Best_Practices]]
- So sánh Kiến trúc MVC Lab 03 vs Chuẩn Modern Laravel: [[Laravel_MVC_Lab03_vs_Modern]]
