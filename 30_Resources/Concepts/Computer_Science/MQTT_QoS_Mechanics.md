---
tags: [type/concept, status/permanent]
date: 2026-09-24
description: "Nguyên lý tầng sâu của MQTT QoS: giải pháp The Two Generals' Problem và phân rã State Machine của QoS 0, QoS 1, QoS 2 (Two-Phase Commit Handshake)."
---

# MQTT QoS Mechanics

## TL;DR

- **Bản chất**: **MQTT QoS** là hợp đồng mức độ tin cậy khi chuyển phát gói tin giữa Client và Broker trên một kênh truyền không ổn định.
- **Mục đích**: Cân bằng có chủ đích giữa throughput, latency và toàn vẹn dữ liệu, nhằm hóa giải giới hạn phân tán của The Two Generals' Problem.
- **Điểm mấu chốt**: **QoS 0** best-effort, không ACK; **QoS 1** ACK-Retransmission có thể trùng tin, buộc Backend Idempotent; **QoS 2** bắt tay 4 bước, hết mất mát/trùng lặp, đổi lại latency cao hơn.

---

## Core Mechanics

### 1. The Two Generals' Problem & Đường biên Đánh đổi Tin cậy

**The Two Generals' Problem** chứng minh: trên mạng có độ trễ biến thiên và nguy cơ rớt gói, hai nút tính toán không bao giờ đạt được đồng thuận tuyệt đối về trạng thái chỉ bằng một số lượng hữu hạn thông điệp xác nhận.

Mọi giao thức chuyển phát đều phải chấp nhận đánh đổi:

1. **Liveness**: Đảm bảo gói tin luôn đến được đích.
2. **Safety**: Đảm bảo gói tin không bao giờ bị thực thi thừa hoặc trùng lặp.
3. **Overhead**: Giảm thiểu số vòng lặp mạng (Round-Trip Time - RTT) và mức tiêu thụ RAM lưu trữ trạng thái đệm.

MQTT QoS giải quyết bài toán này bằng cách phân tầng thành 3 cấp độ cam kết rõ rệt.

---

### 2. Giải phẫu Ba Cấp độ QoS State Machine

Mọi gói tin có QoS $\ge 1$ bắt buộc phải mang một trường nhị phân 16-bit gọi là **`Packet Identifier` (Packet ID)** có giá trị từ 1 đến 65.535 để định danh phiên trao đổi.

```
QoS 0: [PUBLISH] ───────────────────────────────────────────────► (Stateless)

QoS 1: [PUBLISH (PacketID=N)] ──────────────────────────────────►
       ◄─────────────────────────── [PUBACK (PacketID=N)] ─────── (Retransmit nếu Timeout)

QoS 2: [PUBLISH (PacketID=N)] ──────────────────────────────────► (Phase 1: Lock Message)
       ◄─────────────────────────── [PUBREC (PacketID=N)] ───────
       [PUBREL (PacketID=N)] ───────────────────────────────────► (Phase 2: Commit & Release)
       ◄─────────────────────────── [PUBCOMP (PacketID=N)] ──────
```

#### A. QoS 0: At Most Once (Best-Effort / Fire-and-Forget)

- **Cơ chế**: Bên gửi đẩy gói tin `PUBLISH` trực tiếp vào Socket Buffer của OS Kernel và giải phóng ngay lập tức khỏi bộ nhớ ứng dụng.
- **Trạng thái bộ nhớ**: Hoàn toàn không lưu trạng thái (Stateless). Không sử dụng `Packet ID`. Không có đồng hồ đếm ngược (Retry Timer).
- **Rủi ro**: Nếu kết nối mạng bị ngắt đúng thời điểm gói tin đang truyền, gói tin bị hủy hoàn toàn mà cả bên gửi lẫn bên nhận đều không hề hay biết.

#### B. QoS 1: At Least Once (ACK-Retransmission & Nguy cơ Duplicate)

- **Cơ chế**:
  1. Bên gửi gán `Packet ID = N`, ghi gói tin vào **Retransmission Queue (Inflight Table)** trong RAM, sau đó truyền gói `PUBLISH`.
  2. Bên nhận đón nhận gói tin, đẩy lên tầng ứng dụng xử lý, đồng thời gửi trả gói `PUBACK(N)`.
  3. Bên gửi chỉ xóa gói tin khỏi Retransmission Queue khi nhận được đúng gói `PUBACK(N)` tương ứng.
  4. Nếu Retry Timer hết hạn mà chưa thấy `PUBACK`, bên gửi bật cờ `DUP = 1` và gửi lại nguyên vẹn gói tin với `Packet ID = N`.
- **Cơ chế phát sinh trùng lặp (Duplicate Message Trap)**:
  - Nếu bên nhận đã nhận thành công `PUBLISH(N)` và đẩy vào database, nhưng gói phản hồi `PUBACK(N)` trên đường về bị đứt mạng hoặc quá hạn Timeout $\to$ Bên gửi kết luận sai rằng bên nhận chưa có dữ liệu $\to$ Bên gửi thực hiện Retransmit $\to$ **Bên nhận bị nhận gói tin đó lần thứ hai**.

#### C. QoS 2: Exactly Once (Two-Phase Commit 4-Way Handshake)

QoS 2 triệt tiêu hoàn toàn khả năng mất tin và trùng lặp thông qua quy trình hai pha (Two-Phase Commit) với 4 bước bắt tay:

- **Pha 1: Vận chuyển và Khóa dữ liệu (Transfer & Deduplication Lock)**:
  - Bên gửi truyền `PUBLISH(N)`. Trạng thái chuyển thành `AWAIT_PUBREC`.
  - Bên nhận nhận dữ liệu, ghi nhận `Packet ID = N` vào **Deduplication State Cache** để khóa lại. Bên nhận chưa giải phóng bản tin cho tầng ứng dụng tiêu thụ cuối cùng. Bên nhận gửi phản hồi `PUBREC(N)` (Publish Received).
  - Khi bên gửi nhận được `PUBREC(N)`, nó chắc chắn bên nhận đã cất giữ an toàn bản tin. Lúc này bên gửi **xóa payload thực tế khỏi RAM** để giải phóng bộ nhớ, chỉ giữ lại mã số định danh `N`.
- **Pha 2: Giải phóng và Hoàn tất (Commit & Complete)**:
  - Bên gửi truyền tiếp gói tin điều khiển `PUBREL(N)` (Publish Release). Trạng thái chuyển thành `AWAIT_PUBCOMP`.
  - Bên nhận nhận được `PUBREL(N)` $\to$ Đây là lệnh kích hoạt cho phép bên nhận chuyển tiếp payload lên tầng ứng dụng, đồng thời xóa `Packet ID = N` khỏi Deduplication State Cache $\to$ Bên nhận phản hồi `PUBCOMP(N)` (Publish Complete).
  - Bên gửi nhận `PUBCOMP(N)` $\to$ Thu hồi hoàn toàn `Packet ID = N` về bể ID rảnh rỗi (Free ID Pool).

---

## Related Notes

- Hạn ngạch gói tin đang bay và hiện tượng nghẽn ngược: [[MQTT_Inflight_Window_and_Backpressure]]
- Yêu cầu bắt buộc ở tầng ứng dụng khi dùng QoS 1: [[MQTT_Consumer_Idempotency]]
- Chọn mức QoS nào cho từng loại bản tin: [[MQTT_QoS_Selection_Guide]]
- [[MQTT_Broker_Architecture]]: Tổng quan kiến trúc định tuyến Trie và cơ chế Decoupling của MQTT Broker.
- [[000_Concepts_MOC]]: Danh mục lý thuyết nền tảng Khoa học Máy tính.
