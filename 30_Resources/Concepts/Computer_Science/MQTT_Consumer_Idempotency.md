---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Idempotent Consumer Pattern cho MQTT QoS 1: vì sao bảo vệ tầng transport không đủ, và cách khóa trùng lặp bằng Redis SET NX hoặc unique constraint."
---

# MQTT Consumer Idempotency

## TL;DR

- **Bản chất**: QoS 1 chỉ bảo vệ gói tin ở tầng truyền thông; bản tin vẫn có thể được giao lại và xử lý hai lần ở tầng ứng dụng.
- **Mục đích**: Chặn hậu quả nghiệp vụ của Retransmission (ghi trùng bản ghi, kích hoạt cảnh báo hai lần, trừ tiền hai lần).
- **Điểm mấu chốt**: Mỗi bản tin phải mang mã định danh sinh từ nguồn, và Backend phải kiểm tra khóa đó bằng `SET NX` hoặc Unique Constraint trước khi ghi.

## Core Concept: Vì sao QoS 1 chưa đủ

Một ngộ nhận tai hại trong kiến trúc phần mềm là cho rằng: _"Chỉ cần chọn QoS 1 ở tầng mạng là dữ liệu của hệ thống sẽ an toàn tuyệt đối"_.

- QoS 1 chỉ bảo vệ gói tin ở tầng truyền thông (Transport Level); nó **cam kết ít nhất một lần**, không cam kết đúng một lần.
- Nguy cơ trùng lặp đến từ chính cơ chế Retransmission khi `PUBACK` bị thất lạc, và từ việc Broker giao lại bản tin chưa được xác nhận cho phiên mới.
- Hệ quả nghiệp vụ: bản ghi bị ghi trùng, cảnh báo bắn hai lần, lệnh điều khiển bị thực thi lặp.

## Idempotent Consumer Pattern

- Mỗi bản tin nghiệp vụ phải chứa một mã định danh duy nhất sinh ra từ nguồn (ví dụ `UUID` hoặc `timestamp + device_id`).
- Backend (Go Service) khi nhận bản tin từ MQTT Broker phải kiểm tra trạng thái khóa này trước khi ghi nhận dữ liệu hoặc kích hoạt cảnh báo:
  - Redis `SET NX` với TTL làm khóa chống trùng nhanh ở đường nóng.
  - PostgreSQL Unique Constraint trên cột mã định danh làm chốt chặn cuối ở tầng lưu trữ.
- Trình tự an toàn là kiểm tra khóa và ghi dữ liệu trong cùng một giao dịch hoặc cùng một thao tác nguyên tử, nếu không sẽ tự tạo lại khe hở race giữa hai lần giao.

## Related Notes

- Cơ chế sinh ra trùng lặp (Duplicate Message Trap): [[MQTT_QoS_Mechanics]]
- Chọn mức QoS theo mức nhạy cảm của nghiệp vụ: [[MQTT_QoS_Selection_Guide]]
- [[Redis_Roadmap]]: Các mẫu khóa phân tán và `SET NX` dùng cho bước chống trùng.
