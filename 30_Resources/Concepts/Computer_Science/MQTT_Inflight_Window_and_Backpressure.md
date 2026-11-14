---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Inflight Window, vòng đời Packet ID và Backpressure trong MQTT: vì sao 16-bit Packet ID buộc phải có hạn ngạch gói tin chưa xác nhận."
---

# MQTT Inflight Window và Backpressure

## TL;DR

- **Bản chất**: Mọi gói QoS ≥ 1 chiếm một `Packet ID` 16-bit, nên số gói chưa được xác nhận phải bị chặn bằng một hạn ngạch gọi là Inflight Window.
- **Mục đích**: Biết vì sao Broker hoặc thiết bị biên phải tạm ngừng gửi khi mạng nghẽn, thay vì gửi tới khi cạn RAM.
- **Điểm mấu chốt**: Khi cửa sổ đầy, bên gửi chỉ còn ba lựa chọn: chặn luồng Publisher, ghi đệm ra đĩa (Disk Spooling), hoặc ngắt kết nối để bảo toàn RAM.

## Core Concept: Hạn ngạch gói tin đang bay

- **Inflight Window (Hạn ngạch gói tin đang bay)**:
  - Vì `Packet ID` chỉ có 16-bit (tối đa 65.535 ID khả dụng) và bộ nhớ RAM của thiết bị là hữu hạn, hệ thống không thể gửi đi vô hạn các gói tin chưa có xác nhận.
  - Chuẩn MQTT quy định một hạn mức cửa sổ (Inflight Window, thường cấu hình từ 10 đến 100). Khi số lượng gói tin QoS 1 và QoS 2 chưa nhận được `PUBACK` hoặc `PUBCOMP` chạm ngưỡng này, bên gửi phải tạm dừng gửi gói tin mới.
- **Hiện tượng Backpressure (Áp lực ngược)**:
  - Khi mạng bị nghẽn (Latency tăng cao, tỷ lệ rớt gói tin lớn), hàng đợi Inflight Window bị lấp đầy.
  - Tầng gửi (Publisher) bị nghẽn bộ đệm, buộc phải áp dụng chính sách chặn (Block Publisher Thread), đệm vào đĩa cứng (Disk Spooling), hoặc chủ động ngắt kết nối để bảo toàn bộ nhớ RAM.

## Vòng đời một Packet ID

- **Sinh ID**: bên gửi lấy một ID rảnh từ Free ID Pool khi phát `PUBLISH(N)` với QoS ≥ 1.
- **Giữ ID**: ID nằm trong Inflight Table kèm payload cho tới khi nhận `PUBACK(N)` (QoS 1) hoặc `PUBREC(N)` (QoS 2).
- **Thu hồi ID**: với QoS 2, payload bị xóa sau `PUBREC(N)` và ID chỉ được trả về bể rảnh khi nhận `PUBCOMP(N)`.
- **Hệ quả thiết kế**: bể ID cạn nghĩa là cửa sổ đầy; mọi chính sách nghẽn đều phải quyết định trước khi bể cạn chứ không phải lúc đã cạn.

## Related Notes

- Cơ chế ba cấp QoS và bốn bước bắt tay: [[MQTT_QoS_Mechanics]]
- Chọn mức QoS theo loại bản tin: [[MQTT_QoS_Selection_Guide]]
- [[MQTT_Session_State_Lifecycle]]: Hàng đợi tin nhắn offline của Client và trạng thái Broker phải giữ.
- [[Context_Switching_Cost_Mechanics]]: Vì sao nghẽn cửa sổ inflight phải chặn luồng hoặc ghi đệm thay vì mở thêm luồng.
