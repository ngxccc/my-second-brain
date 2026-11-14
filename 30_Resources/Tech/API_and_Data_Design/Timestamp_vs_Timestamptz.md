---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "Phân biệt timestamp và timestamptz, quy tắc Enterprise bắt buộc."
---

# Timestamp vs Timestamptz in Database

## TL;DR

- **Bản chất**: `timestamp` lưu chuỗi thời gian tĩnh không kèm múi giờ; `timestamptz` lưu mốc UTC tuyệt đối và tự chuyển đổi khi ghi/đọc.
- **Mục đích**: Tránh lệch giờ khi server, client và database nằm ở các múi giờ khác nhau.
- **Điểm mấu chốt**: Luôn dùng `timestamptz` cho `created_at` và `updated_at`; `timestamp` chỉ đúng khi giá trị đó thực sự là giờ địa phương không có mốc tuyệt đối.

## Core Concept

1. **`timestamp` (Without Time Zone)**:
   - Bản chất: Lưu trữ chính xác chuỗi ký tự ngày giờ được truyền vào mà không quan tâm múi giờ nào.
   - Ví dụ: Lưu `2026-04-27 19:15:00`, bất kể server query ở đâu (Mỹ hay Việt Nam), DB vẫn trả về đúng con số tĩnh này, dẫn đến sai lệch múi giờ thực tế khi xử lý logic ở ứng dụng.

2. **`timestamptz` (With Time Zone)**:
   - Bản chất: Lưu thời gian theo hệ quy chiếu tuyệt đối (**UTC**).
   - Cơ chế:
     - **Khi ghi (Insert/Update)**: Database tự động chuyển đổi thời gian local của server sang UTC để ghi nhận vào ổ đĩa.
     - **Khi đọc (Select)**: Driver DB tự động chuyển đổi ngược từ UTC sang múi giờ của client hoặc server đang thực hiện query.

## Enterprise Rule of Thumb

- **BẮT BUỘC:** dùng `timestamptz` cho mọi cột dấu thời gian hệ thống như `created_at` và `updated_at`.
- **Lý do:** giữ tính nhất quán trên các server phân tán địa lý.

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
