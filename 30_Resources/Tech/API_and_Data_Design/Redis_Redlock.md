---
tags: [type/concept, status/permanent]
date: 2026-07-27
description: "Điểm vào cho ba khía cạnh của khoá phân tán Redis: đường hỏng, cơ chế quorum, và điều kiện correctness bằng fencing token."
---

# Redis Redlock

## TL;DR

- **Bản chất**: Note này là điểm vào (hub), không chứa toàn bộ thuật toán. Nội dung đã được tách thành ba note độc lập để mỗi note chỉ giữ một khẳng định.
- **Mục đích**: Đọc đúng phần mình cần thay vì đọc một tài liệu dài trộn ba khái niệm.
- **Điểm mấu chốt**: Redlock giảm xác suất hai owner, nhưng **không** đảm bảo correctness. Muốn correctness phải có fencing token ở tầng lưu trữ.

## Core Concept

Ba tầng của vấn đề, đọc theo thứ tự:

1. [[Distributed_Lock_Failure_Modes]] - vì sao mọi lock TTL-based đều có thể cấp hai owner: single node, async replication failover, process pause, clock skew. Đọc trước tiên, vì nó giải thích bài toán.
2. [[Redis_Redlock_Quorum_Mechanics]] - thuật toán cụ thể: N node độc lập, quorum, validity window, release trên toàn bộ node.
3. [[Fencing_Token_Correctness_Requirement]] - điều kiện để dùng lock cho giao dịch: token tăng đơn điệu được kiểm tra tại nơi ghi.

Cảnh báo cho repo này: Redlock trong codebase hiện được khởi tạo với **một** Redis connection. API vẫn chạy, nhưng tính chất quorum biến mất, nên nó chỉ còn là lock đơn node có thêm overhead.

## Định tuyến sang note chuyên sâu

Chọn note theo câu hỏi đang có:

- "Vì sao lock hết hạn mà vẫn có hai writer?" - sang `Distributed_Lock_Failure_Modes`
- "Cấu hình `driftFactor`, `retryJitter`, N bằng mấy?" - sang `Redis_Redlock_Quorum_Mechanics`
- "Làm sao chắc chắn không trừ tiền hai lần?" - sang `Fencing_Token_Correctness_Requirement`

## Điều kiện sai

- Đọc riêng note này rồi kết luận "đã hiểu Redlock" - sai. Hub không thay thế nội dung.
- Dùng Redlock cho correctness mà không có fencing - sai, và đây là lỗi phổ biến nhất.
- Tin rằng đổi N lớn hơn sẽ chữa được process pause - sai, vấn đề không nằm ở số node.

## Related Notes

- Danh sách failure mode phải chặn: [[Distributed_Lock_Failure_Modes]]
- Cơ chế quorum quyết định tính đúng đắn: [[Redis_Redlock_Quorum_Mechanics]]
- Điều kiện đúng đắn còn thiếu nếu chỉ dùng Redlock: [[Fencing_Token_Correctness_Requirement]]
- Phương án khóa bi quan thay thế: [[Postgres_Select_For_Update_Pessimistic_Locking]]
- Bối cảnh vận hành nơi lock bị tranh chấp: [[Multi_Layer_Rate_Limiting_DDoS_Prevention]]
