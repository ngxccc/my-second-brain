---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Wire protocol nhị phân của MQTT: Fixed Header 2 bytes, biến độ dài Remaining Length, epoll và cơ chế Keep-Alive PINGREQ/PINGRESP."
---

# MQTT Wire Protocol và Non-blocking I/O

## TL;DR

- **Bản chất**: MQTT là giao thức nhị phân với Fixed Header 2 bytes, giữ kết nối TCP thường trực và dùng `epoll`/`kqueue` thay cho mỗi Client một Thread.
- **Mục đích**: Cắt băng thông trên thiết bị biên (2 bytes thay cho ~800 bytes header HTTP) và giữ hàng trăm ngàn kết nối nhàn rỗi với chi phí RAM rất thấp.
- **Điểm mấu chốt**: Keep-Alive chỉ cần `PINGREQ`/`PINGRESP` 2 bytes để xác nhận Socket còn sống, tránh tốn 3-Way Handshake để mở lại kết nối.

## Core Concept: Nhị phân, Multiplexing và Keep-Alive

Khác với HTTP mang gánh nặng văn bản ASCII lớn (Headers chiếm 500 – 2000 bytes cho Cookies, User-Agent, Keep-Alive), MQTT được thiết kế ở mức nhị phân:

- **Fixed Header tối giản 2 bytes**:
  - Byte 1: `Packet Type` (4 bits: `CONNECT`, `PUBLISH`, `PUBACK`...) + Flags (4 bits: `DUP`, `QoS`, `RETAIN`).
  - Byte 2 (trở lên): `Remaining Length` dùng thuật toán mã hóa số nguyên độ dài biến thiên (Variable Byte Integer), từ 1 đến 4 bytes để biểu diễn kích thước payload tới 256MB.
- **Kernel Multiplexing (`epoll` / `kqueue`)**:
  - Broker duy trì các kết nối TCP thường trực (Persistent Connections) mà không tạo mỗi Thread cho mỗi Client.
  - Nhờ cơ chế hướng sự kiện bất đồng bộ (Event-driven I/O Multiplexing), một Process đơn lẻ có thể quản lý hơn 100.000 Socket đồng thời với mức sử dụng RAM chỉ vài KB cho mỗi Socket Buffer của OS Kernel.
- **Keep-Alive & PINGREQ/PINGRESP**:
  - Broker giám sát trạng thái sống của kết nối qua chu kỳ Keep-Alive. Nếu Client không gửi dữ liệu trong khoảng thời gian đã thỏa thuận, nó bắn gói `PINGREQ` (2 bytes) và Broker đáp `PINGRESP` (2 bytes) để xác nhận Socket còn thông suốt mà không cần thiết lập lại TCP 3-Way Handshake.

## Related Notes

- Kiến trúc Broker, Trie định tuyến và ba chiều Decoupling: [[MQTT_Broker_Architecture]]
- Vòng đời trạng thái phiên trên Broker: [[MQTT_Session_State_Lifecycle]]
- [[Context_Switching_Cost_Mechanics]]: Vì sao mô hình một Thread mỗi kết nối đắt hơn nhiều so với I/O Multiplexing.
- [[Redis_Single_Threaded_Event_Loop_Architecture]]: Cùng nguyên lý Reactor Pattern ở tầng server.
