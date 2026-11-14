---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "Phân biệt dấu nháy đơn (String Literals) và nháy kép (Identifiers) trong SQL."
---

# SQL Quotes: Identifiers vs String Literals

## TL;DR

- **Bản chất**: Nháy đơn `''` đánh dấu string literal, nháy kép `""` đánh dấu identifier (tên cột, tên bảng).
- **Mục đích**: Tránh lỗi khi tên cột chứa dấu cách hoặc trùng từ khóa hệ thống, và tránh nhầm giá trị dữ liệu với tên thực thể.
- **Điểm mấu chốt**: Nháy kép còn dùng để phân biệt hoa thường của identifier; dùng sai loại nháy thường ra lỗi `column does not exist` khó đọc thay vì lỗi cú pháp rõ ràng.

## Core Concept

Trong SQL chuẩn (ANSI SQL):

1. **Dấu nháy đơn (`'value'`)**:
   - Mục đích: Khai báo một chuỗi ký tự (String literal).
   - Ví dụ: `SELECT * FROM users WHERE username = 'ngxc';` ('ngxc' là giá trị chuỗi).
2. **Dấu nháy kép (`"column"`)**:
   - Mục đích: Xác định một định danh (Identifier) như tên cột, tên bảng khi chúng chứa ký tự đặc biệt, trùng với từ khóa hệ thống, hoặc phân biệt hoa thường.
   - Ví dụ: `SELECT "first name" FROM "users";` ("first name" là tên cột có dấu cách).

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
