---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "RFC đề xuất caching realtime leaderboard bằng Redis Sorted Sets (ZSET)."
---

# RFC: Realtime Leaderboard Caching System

## TL;DR

- **Bản chất**: Bảng xếp hạng realtime được đẩy khỏi PostgreSQL sang Redis Sorted Set, cập nhật bằng `ZINCRBY` và đọc bằng `ZREVRANGE`.
- **Mục đích**: Loại bỏ `COUNT` + `SORT` lặp lại trên bảng lớn, thứ làm CPU database spike 100% ở 5.000 request/giây.
- **Điểm mấu chốt**: Đổi lấy eventual consistency khoảng 5 giây giữa Redis và PostgreSQL; chấp nhận được vì bảng xếp hạng không phải dữ liệu giao dịch.

## Context & Problem

- Endpoint `/v1/creators/trending` tính toán xếp hạng Creator theo lượt view/interact bằng câu lệnh `COUNT` và `SORT` liên tục trong PostgreSQL.
- Hệ quả: CPU của Database chính bị quá tải (spike 100%) khi lượng tải truy cập đồng thời đạt mức 5,000 requests/giây.

## Proposed Solution

- **Tầng Cache đệm (Redis ZSET)**:
  - Sử dụng cấu trúc dữ liệu **Sorted Sets (ZSET)** của Redis để lưu danh sách Creator kèm theo điểm số.
  - Mỗi khi có tương tác mới, hệ thống gọi lệnh `ZINCRBY` để tăng điểm số realtime trực tiếp trên Redis.
  - Truy vấn top trending sử dụng `ZREVRANGE` hoặc `ZREVRANGEBYSCORE` với độ phức tạp cực thấp.

## Trade-offs

- **Ưu điểm (Pros)**: Tốc độ đọc đạt $O(1)$ đến $O(log(N) + M)$, giảm tải 90% truy vấn tính toán nặng cho Database PostgreSQL chính.
- **Nhược điểm (Cons)**: Chấp nhận bất đồng bộ dữ liệu (Eventual Consistency) trong vòng 5 giây giữa dữ liệu đệm Redis và PostgreSQL chính trong quá trình ghi ngược (write-behind).

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
- Thiết kế phân trang hiệu suất cao: [[Cursor_Pagination]]
