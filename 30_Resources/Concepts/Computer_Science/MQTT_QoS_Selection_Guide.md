---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Bảng chọn mức QoS cho hệ thống giám sát máy phát điện công nghiệp: telemetry, cảnh báo và lệnh điều khiển nhạy cảm."
---

# Chọn Mức QoS theo Loại Bản tin

## TL;DR

- **Bản chất**: Ba mức QoS tương ứng ba mức nhạy cảm nghiệp vụ: telemetry định kỳ, cảnh báo bất thường, và lệnh điều khiển hoặc thanh toán.
- **Mục đích**: Chọn QoS theo hậu quả khi bản tin mất hoặc bị xử lý hai lần, không chọn theo cảm giác "cho chắc".
- **Điểm mấu chốt**: Đo đạc định kỳ dùng QoS 0, cảnh báo dùng QoS 1 (thà nhận hai lần), lệnh nhạy cảm dùng QoS 2 vì RTT gấp đôi là cái giá rẻ hơn nhiều so với thực thi sai.

## Comparative Decision Matrix

Áp dụng trong Hệ thống Giám sát & Điều khiển Máy phát điện Công nghiệp (Industrial Generator Management):

| Cấp độ QoS | Độ tin cậy                          |     Chi phí RTT mạng      | Tác động bộ nhớ RAM                      | Kịch bản ứng dụng chuẩn xác                                                                                                                             |
| :--------: | :---------------------------------- | :-----------------------: | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **QoS 0**  | Có thể mất tin, không bao giờ trùng |    $0$ (Không chờ ACK)    | Tối thiểu (Không lưu Inflight)           | **Đo đạc Telemetry định kỳ**: Điện áp, nhiệt độ, mức dầu gửi mỗi 1 giây/lần. Bản tin sau tự động bù đắp bản tin trước.                                  |
| **QoS 1**  | Không mất tin, có thể nhận trùng    |    $1$ RTT (`PUBACK`)     | Trung bình (Lưu Inflight Queue)          | **Cảnh báo bất thường (Alerts)**: Máy quá nhiệt $> 95^\circ\text{C}$, mất điện lưới, mức dầu cạn $< 10\%$. Thà nhận 2 lần cảnh báo còn hơn bị thất lạc. |
| **QoS 2**  | Không mất tin, không trùng lặp      | $2$ RTT (4-Way Handshake) | Cao (Lưu Inflight + Deduplication Cache) | **Lệnh điều khiển nhạy cảm (Critical Control)**: Lệnh tắt máy khẩn cấp từ xa, lệnh kích hoạt nổ máy chạy tải bệnh viện, lệnh thanh toán nạp nhiên liệu. |

## Cách đọc bảng này

- **Câu hỏi quyết định là hậu quả, không phải tần suất**: bản tin gửi 1 giây/lần vẫn có thể cần QoS cao nếu mất một bản tin gây sai lệch nghiệp vụ.
- **QoS 1 là mặc định hợp lý** cho phần lớn bản tin nghiệp vụ, với điều kiện đã có [[MQTT_Consumer_Idempotency]] ở tầng tiêu thụ.
- **QoS 2 chỉ đáng trả giá** ở lệnh điều khiển hoặc giao dịch; dùng tràn lan sẽ biến RTT và RAM trạng thái thành nút thắt.

## Related Notes

- Cơ chế và chi phí từng cấp QoS: [[MQTT_QoS_Mechanics]]
- Hạn ngạch gói tin đang bay khi chạy QoS 1 hoặc 2: [[MQTT_Inflight_Window_and_Backpressure]]
- Chống xử lý trùng ở tầng ứng dụng: [[MQTT_Consumer_Idempotency]]
- [[MQTT_Session_State_Lifecycle]]: Kiến trúc Broker giữ hàng đợi và trạng thái phiên.
