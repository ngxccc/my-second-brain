---
tags: [type/concept, status/permanent]
date: 2026-04-28
description: "Đưa code ra các node CDN gần user nhất để giảm latency."
---

# Edge Computing

## TL;DR

- **Bản chất**: Edge đưa code chạy trên V8 Isolates tại node CDN gần người dùng, không dựng container đầy đủ cho từng lần thực thi.
- **Mục đích**: Cắt latency từ hàng trăm mili-giây xuống khoảng vài chục mili-giây nhờ rút ngắn khoảng cách địa lý và tránh cold start.
- **Điểm mấu chốt**: V8 Isolate bị giới hạn CPU time và bộ nhớ, không có filesystem hay TCP tùy ý; đây là lý do chỉ nên đặt logic mỏng ở edge, không đặt toàn bộ backend.

## Core Concept

- **Không dùng Container Node.js:** Thay vì khởi động nguyên một hệ điều hành ảo (Docker/Container) như Serverless truyền thống, Edge sử dụng **V8 Isolates** (cơ chế chạy tab của Google Chrome).
- **Phân phối toàn cầu:** Trình biên dịch băm nhỏ code (tree-shaking) thành file siêu nhẹ. File này được copy ra hàng trăm node CDN trên thế giới. User ở Việt Nam thì code chạy ở máy chủ Việt Nam/Singapore thay vì vòng sang Mỹ.

## Ưu điểm và giới hạn môi trường

- **Ưu điểm:** Khắc phục triệt để vấn đề "Cold Start" của Serverless. Thời gian khởi động gần như bằng 0 (chỉ mất vài mili-giây).
- **Trade-off (Giới hạn môi trường):** Đánh đổi lại tốc độ, Edge runtime bị lược bỏ các API nặng. Em KHÔNG THỂ dùng các hàm Node.js thuần tuý (như `fs` để đọc/ghi file ổ cứng) hoặc các thư viện yêu cầu native binaries.

---

**Related Notes:**

- Nguồn gốc kiến trúc: [[Serverless_Architecture]]
