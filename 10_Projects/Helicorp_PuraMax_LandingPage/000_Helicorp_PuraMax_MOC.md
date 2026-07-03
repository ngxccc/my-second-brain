---
tags: [type/project, status/active]
priority: High
deadline: 2026-07-04
stack: [Next.js, Tailwind CSS, GSAP, Neon, Doppler]
created_at: 2026-06-29
---

# Helicorp Pura Max Landing Page

## Objective (SMART Goal)

- **Goal:** Xây dựng và triển khai trang Landing Page cao cấp giới thiệu máy dọn phân mèo thông minh **PETKIT Pura Max** do HeLiCorp phân phối. Tích hợp đầy đủ các tính năng nâng cao (Dark Mode, Scrollytelling, Mini E-commerce, Chatbot AI, Webhook & Behavior Tracking) nhằm tối đa hóa điểm cộng trong bài test vòng 2.
- **Outcome:**
  1. Đạt điểm số Google PageSpeed Insights Mobile từ 85/100 trở lên.
  2. Dữ liệu form tư vấn/mua hàng được lưu trữ bảo mật trên **Neon (Postgres)** thông qua Prisma/Drizzle ORM.
  3. Quản lý cấu hình, API keys an toàn bằng **Doppler**.
  4. Triển khai thành công trên Vercel và nộp bài trước 18:00 ngày 04/07/2026.

## Tech Stack & Tools

- **Frontend:** Next.js (App Router, TypeScript), Tailwind CSS, GSAP (ScrollTrigger)
- **Database:** Neon (Serverless Postgres)
- **Environment Management:** Doppler
- **Deployment:** Vercel

## Roadmap / Milestones

- [ ] **Phase 1: Setup & Doppler Config** (Deadline: 30/06/2026)
  - [ ] Khởi tạo project Next.js với TypeScript và Tailwind CSS.
  - [ ] Cấu hình dự án trên Doppler, kết nối Doppler CLI để chạy môi trường dev và đồng bộ hóa biến môi trường lên Vercel.
- [ ] **Phase 2: UI, Parallax & Scrollytelling** (Deadline: 01/07/2026)
  - [ ] Thiết kế Hero Section và các section tính năng với cấu hình Dark/Light Mode.
  - [ ] Triển khai các hiệu ứng Scroll Animation (tách lớp vỏ máy, xoay lồng máy Pura Max) bằng GSAP.
- [ ] **Phase 3: Mini E-commerce & AI Chatbot** (Deadline: 02/07/2026)
  - [ ] Phát triển tính năng chọn màu nhẫn/phụ kiện, giỏ hàng Drawer, danh sách Wishlist và sản phẩm đã xem lưu trong LocalStorage.
  - [ ] Tích hợp Chatbot HeLiBot (Gemini API) thông qua Next.js API Routes.
- [ ] **Phase 4: Neon DB Integration & Webhook Tracking** (Deadline: 03/07/2026)
  - [ ] Thiết lập kết nối cơ sở dữ liệu Neon, thiết kế database schema để lưu form đăng ký nhận tư vấn.
  - [ ] Tích hợp API Route xử lý submit form, gửi dữ liệu đi Webhook (Make.com/Zapier).
  - [ ] Xây dựng hệ thống live-toast thông báo hành vi người dùng (click, scroll).
- [ ] **Phase 5: Performance Optimization & Deploy** (Deadline: 04/07/2026)
  - [ ] Tối ưu hóa ảnh (WebP/AVIF), lazy load các thành phần chatbot và scripts để đạt điểm PageSpeed Mobile >= 85.
  - [ ] Triển khai lên Vercel, kiểm tra liên kết Doppler.
  - [ ] Viết tài liệu hướng dẫn và nộp bài.

## Work Log / Decisions

- **[29/06/2026]:** Khởi tạo cấu trúc tài liệu dự án. Quyết định lựa chọn PETKIT Pura Max làm sản phẩm cốt lõi. Cấu hình cơ sở dữ liệu sang Neon và quản lý cấu hình bằng Doppler theo yêu cầu mới của hệ thống.

## Related Resources

- Thông số kỹ thuật thiết bị: [[Docs/petkit-pura-max-specs.md|PETKIT Pura Max Specs]]
- Đặc tả thiết kế và kiến trúc chi tiết: [[Docs/Architecture_and_Spec.md|Architecture and Spec]]
- Đặc tả tính năng Landing Page: [[Docs/Landing_Page_Spec.md|Landing Page Spec]]
