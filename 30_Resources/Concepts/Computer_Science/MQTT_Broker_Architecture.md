---
tags: [type/concept, status/permanent]
date: 2026-09-24
description: "Nguyên lý MQTT Broker: mô hình Publish/Subscribe, cơ chế Decoupling ba chiều, và cấu trúc cây tiền tố Trie định tuyến Topic trong RAM."
---

# MQTT Broker Architecture

## TL;DR

- **Bản chất**: **MQTT Broker** là Routing Hub Stateful nằm trong RAM, trung chuyển bản tin nhị phân theo mô hình Publish/Subscribe trên TCP, không cần kết nối Point-to-Point giữa các Client.
- **Mục đích**: Triệt tiêu ràng buộc không gian, thời gian và đồng bộ (Space, Time, Synchronization Decoupling) giữa thiết bị biên và Backend.
- **Điểm mấu chốt**: Bảng định tuyến Topic dùng cây tiền tố **Trie**: $O(L)$ theo độ sâu Topic, độc lập số Subscriber.

---

## Core Mechanics

### 1. Phân rã Ràng buộc Ba chiều (Three-Dimensional Decoupling)

Trong các giao thức hướng Client-Server truyền thống (như HTTP REST hoặc gRPC), kết nối bị trói buộc bởi ba rào cản vật lý:

```
Point-to-Point (HTTP/RPC):
[Client A] ─────────────(Cần biết IP, cùng Online, chờ ACK)─────────────► [Server B]

Publish / Subscribe (MQTT Broker):
[Publisher] ──(Gửi vào Topic)──► ┌─────────────┐ ──(Forward tin)──► [Subscriber 1]
                                 │ MQTT BROKER │
[Publisher] ──(Gửi vào Topic)──► │ (Trie RAM)  │ ──(Forward tin)──► [Subscriber 2]
                                 └─────────────┘
```

MQTT Broker loại bỏ toàn bộ ba ràng buộc này:

- **Phân tách không gian (Space Decoupling)**: Publisher và Subscriber không biết địa chỉ IP hay Port của nhau; cả hai chỉ mở một kết nối TCP duy nhất tới Broker và giao tiếp qua chuỗi định danh logic gọi là `Topic`.
- **Phân tách thời gian (Time Decoupling)**: hai bên không cần cùng Online. Khi Subscriber mất kết nối, Broker duy trì `Persistent Session` trong RAM/Disk và đẩy dồn bản tin tồn đọng ngay khi Subscriber tái kết nối.
- **Phân tách đồng bộ (Synchronization Decoupling)**: Publisher không bị khóa luồng thực thi (Thread Blocking) để chờ các Subscriber xử lý xong nghiệp vụ.

### 2. Cấu trúc Dữ liệu Định tuyến trong RAM: Prefix Tree (Trie)

Topic trong MQTT có dạng đường dẫn phân cấp bằng dấu `/` (ví dụ `factories/area-1/generators/gen-01/telemetry`). Để hỗ trợ lọc theo ký tự đại diện:

- Ký tự đại diện đơn tầng (`+`): khớp chính xác một phân đoạn.
- Ký tự đại diện đa tầng (`#`): khớp toàn bộ các phân đoạn con phía sau.

Bảng băm (Hash Table) thất bại trong việc tra cứu Wildcard vì không thể băm các mẫu động, nên Broker tổ chức không gian Topic bằng cây tiền tố **Trie**:

```
                              (Root)
                                │
                            factories
                                │
                             area-1
                                │
                            generators
                            /        \
                       gen-01        gen-02
                         │              │
                     telemetry      telemetry
                     [Sub: S1]      [Sub: S2]
                         \              /
                          \            /
                        [Wildcard Sub: S3 (+)]
```

- **Cơ chế khớp mẫu (Matching Engine)**: mỗi phân đoạn Topic là một Node trên cây; Client đăng ký Subscribe được lưu dưới dạng danh sách con trỏ tại Node lá hoặc Node chứa Wildcard.
- **Độ phức tạp thuật toán**: khi bản tin đến, Broker tách Topic thành $L$ phân đoạn và duyệt cây từ Root xuống. Độ phức tạp tìm kiếm là $O(L)$, phụ thuộc duy nhất vào độ sâu Topic và không suy giảm khi số Subscriber tăng từ hàng chục lên hàng trăm ngàn Client.

## Related Notes

- Wire protocol 2 bytes, `epoll` và Keep-Alive: [[MQTT_Broker_Wire_Protocol_and_Kernel_IO]]
- Vòng đời trạng thái phiên trên Broker: [[MQTT_Session_State_Lifecycle]]
- So sánh MQTT với HTTP REST cho bài toán telemetry: [[MQTT_vs_HTTP_for_Telemetry]]
- [[MQTT_QoS_Mechanics]]: Đặc tả chi tiết cơ chế thỏa thuận độ tin cậy QoS 0, QoS 1, QoS 2.
- [[000_Concepts_MOC]]: Mục lục tri thức nền tảng Khoa học Máy tính và Hệ thống.
