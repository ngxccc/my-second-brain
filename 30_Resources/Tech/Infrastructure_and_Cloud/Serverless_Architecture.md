---
tags: [type/concept, status/permanent]
date: 2026-04-28
description: "Hạ tầng thực thi auto-scale, không lưu state (Stateless)."
---

# Serverless Architecture

## TL;DR

- **Bản chất**: Nhà cung cấp tự cấp phát và co giãn hạ tầng theo request; code chạy trong đơn vị stateless và tính tiền theo mức sử dụng.
- **Mục đích**: Bỏ chi phí vận hành server nhàn rỗi và xử lý traffic biến động mà không phải tự scale.
- **Điểm mấu chốt**: Stateless là ràng buộc cứng, nên state phải đẩy ra ngoài (database, cache, queue); cộng thêm cold start và giới hạn thời gian chạy khiến nó không phù hợp cho workload dài.

## Core Concept

- **Cơ chế:** Thay vì thuê nguyên một chiếc xe (VPS) để không ngoài bãi, Serverless giống như việc gọi Grab. Có khách (request) thì xe tự chạy tới (spin-up container).
- **Auto-scaling:** Tính năng mạnh nhất. Nếu traffic tăng từ 10 lên 10,000 requests/s, hạ tầng tự động nhân bản hàm xử lý lên 10,000 bản sao song song.
- **Stateless:** Các hàm không lưu trữ trạng thái. Xong việc là bị tiêu hủy. Mọi dữ liệu phải lưu vào Database bên ngoài.

## Trade-off và tử huyệt vận hành

- **Trade-off (Cold Start):** Nếu một hàm lâu không được gọi, nó sẽ bị "ngủ đông". Request tiếp theo đánh thức nó dậy sẽ mất thời gian khởi động môi trường (khoảng 500ms - 2s), gây lag nhẹ cho user đầu tiên.
- **Tử huyệt Database:** Dễ làm sập Database truyền thống do mở quá nhiều kết nối TCP cùng lúc. (Xem thêm cách giải quyết ở note Connection Pooling).

---

**Related Notes:**

- Nâng cấp tốc độ khởi động: [[Edge_Computing]]
- Giải quyết lỗi sập DB: [[Serverless_Connection_Pooling]]
