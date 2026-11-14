---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "Nguyên lý Left-Prefix của Composite Index trong PostgreSQL."
---

# Left-Prefix Index Principle in PostgreSQL

## TL;DR

- **Bản chất**: Composite index `(col1, col2, col3)` dùng được cho query chỉ lọc theo tiền tố bên trái `col1`, vì B-Tree sắp xếp theo đúng thứ tự khai báo.
- **Mục đích**: Một composite index thay được nhiều single index, giảm dung lượng đĩa và chi phí cập nhật index khi ghi.
- **Điểm mấu chốt**: Query chỉ lọc `col2` hoặc `col3` mà không có `col1` thì không dùng được index này; thứ tự cột khi tạo index quan trọng hơn số lượng cột.

## Core Concept

- **Quy tắc hoạt động**:
  - Nếu bạn tạo một composite index trên `(userId, status, createdAt)`.
  - PostgreSQL hoàn toàn có thể sử dụng cột đầu tiên (`userId`) để tối ưu hóa các câu lệnh truy vấn chỉ lọc theo `userId`.
- **Ưu điểm**:
  - Tiết kiệm dung lượng lưu trữ trên đĩa và giảm tải CPU khi thực hiện WRITE (vì giảm số lượng index cần cập nhật).
- **Hạn chế**:
  - Chỉ mục hỗn hợp này **không thể** hỗ trợ tốt cho các truy vấn chỉ lọc theo cột giữa hoặc cuối (như `status` hoặc `createdAt`) mà không có cột đầu tiên (`userId`) trong điều kiện lọc.

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
- Hướng dẫn thiết lập Index: [[Database_Indexing_Guidelines]]
