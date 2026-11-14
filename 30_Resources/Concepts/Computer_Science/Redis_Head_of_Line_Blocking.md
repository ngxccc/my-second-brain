---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Head-of-Line Blocking trong Redis: vì sao lệnh O(N) đóng băng Event Loop, và bảng lệnh thay thế non-blocking cho từng lệnh."
---

# Redis Head-of-Line Blocking và Kỷ luật Non-blocking

## TL;DR

- **Bản chất**: Mọi Command đi trên một đường ray duy nhất, nên một lệnh $O(N)$ giữ luồng chính và mọi Client khác nằm chờ trong queue.
- **Mục đích**: Biết lệnh nào phải thay bằng bản phân trang hoặc bất đồng bộ trước khi lên production.
- **Điểm mấu chốt**: `KEYS *` trên 1 triệu key giữ CPU khoảng 850 ms, khiến một `GET` 50 ns phía sau cũng chịu Queue Wait Time $\ge 850$ ms.

## Cơ chế Head-of-Line Blocking

Vì toàn bộ Command được thực thi trên một đường ray duy nhất (Single Timeline):

$$\text{Total Latency} = \text{Queue Wait Time} + \text{Execution Time} + \text{Network RTT}$$

Nếu Client #3 phát lệnh `KEYS *` trên cơ sở dữ liệu có $1,000,000$ Keys:

- Quá trình quét toàn bộ Buckets trong RAM tốn khoảng $850\text{ ms}$ thời gian CPU của luồng chính.
- Trong suốt $850\text{ ms}$ này, vòng lặp `while(!stop)` bị giữ chặt tại `processCommand` của Client #3.
- Toàn bộ các yêu cầu cực nhẹ của Client khác (ví dụ `GET user:1` chỉ mất 50ns) đến sau trong Fired Events Queue đều phải chịu **Queue Wait Time** $\ge 850\text{ ms}$. Hiện tượng này gọi là **Head-of-Line Blocking**.

## Bảng lệnh thay thế Non-blocking

Để bảo vệ Event Loop, mọi thao tác có Time Complexity phụ thuộc vào quy mô dữ liệu $O(N)$ đều phải được chuyển đổi sang cơ chế Non-blocking:

| Lệnh gây nghẽn ($O(N)$ Blocker) | Rủi ro kỹ thuật                                                                      | Lệnh thay thế Non-blocking chuẩn       | Cơ chế khắc phục                                                                                                                    |
| :------------------------------ | :----------------------------------------------------------------------------------- | :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `KEYS *`                        | Duyệt toàn bộ Keyspace, chiếm dụng CPU từ vài trăm ms đến vài chục giây.             | `SCAN cursor MATCH pattern* COUNT 100` | Duyệt qua con trỏ trạng thái (Cursor-based Iterator). Mỗi lần gọi chỉ quét 1 lượng Buckets cố định rồi nhả CPU cho các Events khác. |
| `DEL <large_key>`               | Giải phóng đồng bộ hàng trăm ngàn phần tử trong Hash/Set/List, làm đứng luồng chính. | `UNLINK <large_key>`                   | Tách Key khỏi Keyspace trong $O(1)$ và đẩy tiến trình `free` bộ nhớ cho luồng ngầm (`bio.c` - `bio_lazy_free`) xử lý bất đồng bộ.   |
| `HGETALL <large_hash>`          | Đọc toàn bộ Field-Value, chiếm dụng băng thông mạng và Event Loop.                   | `HSCAN <key> cursor` hoặc `HMGET`      | Đọc dữ liệu theo từng Batch nhỏ.                                                                                                    |
| `SMEMBERS <large_set>`          | Trả về toàn bộ tập hợp, gây chậm trễ tuyến tính theo kích thước Set.                 | `SSCAN <key> cursor`                   | Đọc theo phân trang Cursor.                                                                                                         |
| `FLUSHALL` / `FLUSHDB`          | Xóa sạch toàn bộ dữ liệu trên toàn bộ DB một cách đồng bộ.                           | `FLUSHALL ASYNC` / `FLUSHDB ASYNC`     | Đẩy việc thu hồi vùng nhớ toàn cục cho Background Thread.                                                                           |

## Related Notes

- Kiến trúc Event Loop tạo ra rủi ro này: [[Redis_Single_Threaded_Event_Loop_Architecture]]
- Mô hình hóa Reactor Pattern bằng TypeScript: [[Redis_Reactor_Pattern_Typescript_Model]]
- [[Latency_Percentiles_and_Throughput_Fundamentals]]: Vì sao $p99$ mới là chỉ số nhìn thấy hiện tượng này.
- [[Redis_Roadmap]]
