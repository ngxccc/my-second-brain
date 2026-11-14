---
tags: [type/concept, status/permanent]
date: 2026-10-30
description: "Mọi distributed lock dựa trên TTL, thiếu fencing token, đều có thể cấp quyền ghi cho hai owner cùng lúc."
---

# Distributed Lock Failure Modes

## TL;DR

- **Bản chất**: Distributed lock không đảm bảo mutual exclusion tuyệt đối. Nó chỉ đảm bảo **với xác suất cao** khi đồng hồ và tiến trình hoạt động bình thường.
- **Mục đích**: Nhận diện ba đường hỏng của mọi lock TTL-based, để biết khi nào lock là đủ và khi nào phải có tầng lưu trữ chặn.
- **Điểm mấu chốt**: Owner cũ có thể vẫn tin mình đang giữ lock trong khi lock đã hết hạn và owner mới đã vào. Không có fencing token thì đây là lỗi correctness, không phải lỗi hiệu năng.

## Core Concept

Ba đường hỏng, độc lập với thuật toán lock cụ thể:

- **Single node, single point of failure**: một Redis instance chết là toàn bộ cơ chế lock chết, hoặc mất luôn key lock sau restart.
- **Async replication + failover**: client lấy lock trên master, master chết trước khi key được replicate. Sentinel/cluster promote replica thành master mới, key lock biến mất, client khác lấy được cùng lock. Hai owner, cùng lúc.
- **Process pause hoặc network delay**: client lấy lock thành công, rồi bị Stop-The-World GC, swap, hoặc partition trong thời gian dài hơn TTL. Lock hết hạn, owner mới vào. Owner cũ tỉnh dậy, vẫn tin mình giữ lock, và ghi dữ liệu.
- **Clock skew**: NTP nhảy đồng hồ làm TTL hết sớm trên một node, phá vỡ tính quorum.

Hệ quả chung: lock có TTL là **lease**, không phải mutex. Nó trả lời câu "hiện tại không ai giữ" với độ tin cậy giới hạn, không trả lời "chắc chắn chỉ một người ghi".

Phân biệt hai mục đích, vì nó quyết định có cần fencing hay không:

- **Efficiency**: ngăn việc chạy trùng không mong muốn (gửi email hai lần, cronjob chạy song song). Trùng thỉnh thoảng chấp nhận được. Lock TTL là đủ.
- **Correctness**: ngăn hai writer cùng sửa một invariant (trừ tiền, xuất kho). Trùng là thảm họa. Cần fencing token ở tầng lưu trữ.

## Practical Implementation

```text
T1: Client A acquire lock (TTL 10s)
T2: Client A bi STW GC 15s
T3: Lock het han tren Redis
T4: Client B acquire lock thanh cong
T5: Client A tinh day, van tin minh giu lock, ghi du lieu  <- hai writer
```

Biện pháp giảm xác suất, không loại bỏ:

- TTL dài hơn thời gian xử lý tối đa, kèm watchdog gia hạn.
- Retry có jitter để tránh đồng loạt.
- Release bằng Lua so sánh token, tránh xóa lock của người khác - nhưng **không** ngăn được owner cũ ghi.

Biện pháp loại bỏ: xem [[Fencing_Token_Correctness_Requirement]].

## Điều kiện sai

- **"Có quorum là an toàn tuyệt đối"** - sai. Quorum không chặn được process pause.
- **"TTL dài là an toàn"** - sai. Chỉ đổi xác suất, và làm sự cố chậm phát hiện hơn.
- **"Release bằng Lua đã chống được hai owner"** - sai. Lua chỉ chống xóa nhầm lock, không chống ghi nhầm.
- **"Lock phân tán thay thế được transaction"** - sai. Lock và transaction bảo vệ hai thứ khác nhau.
- **"Dùng lock cho correctness thì cần lock mạnh hơn"** - sai hướng. Correctness phải được enforce ở tầng lưu trữ, không ở tầng lock.

## Related Notes

- [[Fencing_Token_Correctness_Requirement]] - điều kiện để lock dùng được cho correctness
- [[Redis_Redlock_Quorum_Mechanics]] - thuật toán quorum cụ thể
- [[Postgres_Select_For_Update_Pessimistic_Locking]] - lock trong một database, không có vấn đề phân tán
- [[Database_Transaction_Isolation_and_MVCC]] - nền tảng anomaly phía sau
