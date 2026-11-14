---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Vòng đời trạng thái phiên trên MQTT Broker: CleanSession true/false, hàng đợi tin nhắn offline và việc khôi phục phiên theo Client ID."
---

# MQTT Session State Lifecycle

## TL;DR

- **Bản chất**: Cờ `CleanSession` (hay `CleanStart` trong MQTT v5) quyết định Broker có giữ trạng thái phiên hay xóa sạch khi Client ngắt kết nối.
- **Mục đích**: Biết cái giá RAM phải trả cho Time Decoupling: giữ phiên nghĩa là Broker phải lưu subscription, hàng đợi offline và các gói đang đàm phán ACK.
- **Điểm mấu chốt**: Chỉ khi `CleanSession = false` thì bản tin QoS ≥ 1 gửi lúc Client offline mới được xả lại khi Client tái kết nối cùng `Client ID`.

## Core Concept: Hai chế độ phiên

Khi Client gửi gói `CONNECT`, cờ `CleanSession` (hoặc `CleanStart` trong MQTT v5) định đoạt vòng đời trạng thái trên Broker:

- **CleanSession = true (Transient Session)**:
  - Broker hủy bỏ toàn bộ Session cũ của Client ID đó.
  - Khi ngắt kết nối, mọi dữ liệu đệm, danh sách Subscription và các gói tin đang bay (Inflight Messages) bị xóa sạch khỏi RAM.
- **CleanSession = false (Persistent Session)**:
  - Broker lưu giữ trạng thái của Client: toàn bộ danh sách Topic Subscriptions, hàng đợi tin nhắn chưa gửi (Offline Message Queue) với [[MQTT_QoS_Mechanics|QoS]] $\ge 1$, và các bản tin đang trong tiến trình đàm phán ACK chưa hoàn tất.
  - Khi Client tái kết nối với cùng `Client ID`, Broker khôi phục Session ngay và tiếp tục xả hàng đợi tin nhắn.

## Hệ quả thiết kế

- **Đặt `Client ID` ổn định** là điều kiện để Persistent Session có tác dụng; đổi ID mỗi lần kết nối thì Broker coi như Client mới.
- **Chi phí RAM tỷ lệ với số phiên giữ lại**, nên hệ thống nhiều thiết bị biên phải có chính sách hết hạn phiên (session expiry) thay vì giữ vô hạn.
- **Hàng đợi offline chỉ giữ bản tin QoS ≥ 1**; bản tin QoS 0 gửi lúc offline bị mất, đúng theo hợp đồng best-effort của cấp QoS đó.

## Related Notes

- Kiến trúc Broker và cơ chế định tuyến Trie: [[MQTT_Broker_Architecture]]
- Wire protocol, `epoll` và Keep-Alive: [[MQTT_Broker_Wire_Protocol_and_Kernel_IO]]
- Hạn ngạch gói tin đang bay khi phiên được khôi phục: [[MQTT_Inflight_Window_and_Backpressure]]
- Cơ chế ba cấp QoS: [[MQTT_QoS_Mechanics]]
