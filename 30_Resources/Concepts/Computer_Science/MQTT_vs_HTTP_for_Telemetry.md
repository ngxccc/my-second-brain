---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "So sánh MQTT Broker với HTTP REST cho bài toán telemetry công nghiệp: băng thông, tải CPU biên, điều khiển ngược và hành vi khi đứt mạng."
---

# MQTT vs HTTP REST cho Telemetry

## TL;DR

- **Bản chất**: Bảng đối chiếu hai mô hình ingestion cho hệ thống giám sát máy phát điện công nghiệp: HTTP REST ngắn hạn so với MQTT giữ kết nối dài hạn.
- **Mục đích**: Chọn giao thức theo bốn tiêu chí: băng thông mỗi lần đẩy, tải CPU thiết bị biên, khả năng điều khiển ngược, và hành vi khi mất mạng.
- **Điểm mấu chốt**: Chênh lệch lớn nhất nằm ở chiều điều khiển ngược và hành vi khi đứt mạng, không chỉ ở băng thông.

## Core Concept: Đối chiếu trong hệ thống thật

| Đặc tính                      | Mô hình HTTP REST API truyền thống                   | Mô hình MQTT Broker Ingestion                                |
| :---------------------------- | :--------------------------------------------------- | :----------------------------------------------------------- |
| **Giao thức kết nối**         | HTTP/1.1 hoặc HTTP/2 qua TCP ngắn hạn                | TCP Persistent Connection dài hạn                            |
| **Băng thông mạng**           | Tốn ~800 bytes HTTP headers cho mỗi lần đẩy          | Chỉ tốn 2 bytes Fixed Header cho mỗi telemetry push          |
| **Tải trên Edge CPU**         | Phải mã hóa văn bản, bắt tay TLS/TCP liên tục        | Giữ nguyên Socket, đẩy binary payload trực tiếp              |
| **Khả năng điều khiển ngược** | Khó khăn (phải dùng HTTP Long-polling / Webhook)     | Tức thì: Backend Publish vào `gen-01/command`, máy nhận ngay |
| **Hành vi khi đứt mạng**      | Gói tin thất lạc hoàn toàn nếu Client không tự retry | Broker lưu trữ tin nhắn trong Persistent Session             |

## Cách đọc bảng này

- **Chiều điều khiển ngược** là lý do chính chọn MQTT: thiết bị giữ kết nối nên lệnh từ Backend tới được máy ngay mà không cần thiết bị mở port hay hỏi liên tục.
- **Nếu chỉ đẩy telemetry một chiều, tần suất thấp**: HTTP REST vẫn đủ và đơn giản hơn về vận hành.
- **Nếu thiết bị sau NAT/firewall hạn chế**: kết nối ra ngoài của MQTT dễ triển khai hơn việc mở endpoint đến từng máy.

## Related Notes

- Kiến trúc Broker và cơ chế Decoupling: [[MQTT_Broker_Architecture]]
- Wire protocol 2 bytes và `epoll`: [[MQTT_Broker_Wire_Protocol_and_Kernel_IO]]
- Chọn mức QoS theo loại bản tin trong hệ thống giám sát: [[MQTT_QoS_Selection_Guide]]
- [[000_Tech_MOC]]
