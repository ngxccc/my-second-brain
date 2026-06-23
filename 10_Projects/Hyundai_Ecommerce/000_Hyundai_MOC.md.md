---
tags: [type/moc, topic/hyundai-ecommerce]
date: 2026-06-20
aliases: [Hyundai Index, Hyundai Map]
---

# Hyundai Ecommerce Map of Content (MOC)

## TL;DR

Bản đồ định hướng và quản lý kiến thức dành riêng cho dự án Hyundai Ecommerce. Nơi lưu trữ tất cả các quyết định kiến trúc, quy chuẩn mã nguồn, kế hoạch phát triển và bài học nghiệp vụ rút ra từ quá trình triển khai dự án.

## Core Concepts & Design Decisions (Quyết định thiết kế & Khái niệm)

- [[Database_Payment_Design]]: Bản thiết kế hệ thống thanh toán, phân tách `payment` và `payment_transaction` và cơ chế liên kết Star Schema.
- [[Docs/PostgreSQL_vs_Other_Databases]]: Phân tích suy ngược (reverse-engineered) lý do lựa chọn PostgreSQL làm RDBMS trung tâm của dự án thay vì MySQL, MongoDB hay SQLite.
- [[Docs/Better_Auth_Session_Flow]]: Chiến lược quản lý phiên đăng nhập JWT (sessionStrategy: "jwt"), HttpOnly cookies và phân biệt với Social OAuth tokens.
- [[Docs/Order_Pagination_Mechanism]]: Cơ chế, thuật toán và triển khai phân trang con trỏ hai chiều (Bidirectional Cursor Pagination) tối ưu cho danh sách đơn hàng B2B/B2C.
- [[Docs/B2B_Corporate_Hierarchy_Design]]: Thiết kế phân cấp doanh nghiệp B2B (Corporate Account Hierarchy), ủy quyền hạn mức tín dụng và phân quyền đơn hàng giữa Dealer Approver và Dealer Purchaser.

## Technical Specifications & Plans (Tài liệu kỹ thuật & Kế hoạch)

- [[Docs/Pipeline]]: Kế hoạch các phase phát triển và User Stories cốt lõi của dự án.
