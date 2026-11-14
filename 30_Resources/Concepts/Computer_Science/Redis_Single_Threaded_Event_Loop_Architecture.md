---
tags: [type/concept, status/permanent]
date: 2026-10-02
description: "Bản chất kiến trúc Single-threaded Event Loop của Redis: phân tách Network Layer qua I/O Multiplexing epoll/kqueue và Execution Layer tuần tự trên RAM."
---

# Redis Single Threaded Event Loop Architecture

## TL;DR

- **Bản chất**: Redis chạy theo **Reactor Pattern**: Network I/O phục vụ hàng chục ngàn kết nối qua I/O Multiplexing (`epoll`/`kqueue`), Execution chạy tuần tự từng Command trên đúng một luồng.
- **Mục đích**: Loại bỏ chi phí Thread Context Switch, triệt tiêu Lock Contention khi thao tác trực tiếp trên RAM, và tối đa hóa CPU Cache Locality ở tốc độ sub-microsecond.
- **Điểm mấu chốt**: Từ Redis 6.0, `io-threads` song song hóa việc đọc Socket và mã hóa RESP, nhưng khâu thực thi Command Logic vẫn hoàn toàn đơn luồng.

---

## Kiến trúc Tổng quan (System Overview)

![[30_Resources/Excalidraw/redis_event_loop_architecture.svg]]

Kiến trúc bên trong tiến trình `redis-server` được chia thành 2 phân tầng tách biệt:

1. **Network Layer (Kernel I/O Multiplexing)**: Quản lý hàng chục ngàn Socket connections qua File Descriptors (FD).
2. **Execution Layer (Redis Engine while(1) Loop)**: Vòng lặp `aeMain` rút từng Command từ Fired Events Queue và thực thi trực tiếp trên In-Memory Dict.

---

## Core Mechanics

### 1. Network Layer: I/O Multiplexing với `epoll` / `kqueue`

![[30_Resources/Excalidraw/redis_network_epoll_layer.svg]]

Trong mô hình mạng truyền thống (Multi-threaded Blocking I/O):

- Mỗi Client kết nối tới Server đòi hỏi 1 Thread riêng biệt.
- Với 10,000 Clients đồng thời, Server cần 10,000 Threads $\rightarrow$ Hầu hết Threads ở trạng thái Idle chờ gói tin, tiêu tốn hàng Gigabyte RAM cho Stack bộ nhớ và làm tê liệt CPU vì **Thread Context Switching**.

Redis giải quyết bài toán này bằng **I/O Multiplexing**:

- Mọi kết nối Client từ Backend App (Node.js, Go, Java, .NET) tới Redis port 6379 là một **TCP Socket Connection**. Ở tầng Linux Kernel, mỗi kết nối được định danh bằng một số nguyên gọi là **File Descriptor (FD)**.
- Thay vì tự theo dõi, Redis đăng ký toàn bộ danh sách FDs này vào hệ thống thông báo sự kiện của Kernel (`epoll` trên Linux, `kqueue` trên macOS/BSD).
- Hàm `epoll_wait()` đưa luồng của Redis vào trạng thái ngủ khi không có dữ liệu. Ngay khi có Network Packet đến một hoặc nhiều Socket (ví dụ Client #1 gửi chuỗi lệnh `GET user:1`), phần cứng kích hoạt ngắt (Hardware Interrupt), Kernel đánh thức Redis và trả về chính xác danh sách **Fired Events** chứa các FDs có dữ liệu sẵn sàng để đọc trong thời gian $O(1)$.
- **Kết quả**: 1 luồng duy nhất quản lý hơn 100,000 kết nối nhàn rỗi với $0\%$ CPU overhead.

> **Lưu ý về Multi-threaded I/O (Redis 6.0+)**:
> Từ bản 6.0, Redis bổ sung `io-threads` để đọc raw bytes từ Socket Buffer, giải mã giao thức RESP (Redis Serialization Protocol), và ghi dữ liệu phản hồi trả về Client song song trên nhiều Threads. Tuy nhiên, **khâu thực thi Command Logic vẫn hoàn toàn là Single-threaded**.

---

### 2. Execution Layer: Vòng lặp `aeMain` và Trực tiếp thao tác RAM

![[30_Resources/Excalidraw/redis_execution_event_loop_layer.svg]]

Trái tim của Redis Engine là một vòng lặp vô tận viết bằng ngôn ngữ C trong file `ae.c`:

```c
void aeMain(aeEventLoop *eventLoop) {
    eventLoop->stop = 0;
    while (!eventLoop->stop) {
        // 1. Chặn tại epoll_wait cho đến khi có Socket sẵn sàng hoặc Timer hết hạn
        aeProcessEvents(eventLoop, AE_ALL_EVENTS|AE_CALL_BEFORE_SLEEP|AE_CALL_AFTER_SLEEP);
    }
}
```

Khi `aeProcessEvents` nhận được danh sách các FDs có dữ liệu, luồng chính duyệt qua từng Event theo thứ tự FIFO (First-In, First-Out):

```
Fired Events: [FD 104] ──► [FD 105] ──► [FD 108] ──► [FD 9942]
                   │
                   ▼ (Tuần tự thực thi từng Command)
          processCommand(client)
                   │
                   ▼ (Thao tác RAM Dict ~50 nanoseconds)
          addReply(client)
```

Mỗi thao tác `processCommand` chỉ tác động lên cấu trúc dữ liệu con trỏ trên RAM (`dict.c`):

- `GET / SET`: Thao tác trên Hash Table với Time Complexity trung bình $O(1)$ (~50 nano-giây).
- Không có bất kỳ Disk I/O nào cản trở luồng thực thi trong quá trình xử lý lệnh.
- Không tồn tại Mutex Locks hay Spinlocks: Không xảy ra hiện tượng **Lock Contention** hay **Deadlock** giữa các luồng.

---

## Related Notes

- Vì sao lệnh $O(N)$ phá vỡ kiến trúc này: [[Redis_Head_of_Line_Blocking]]
- Mô hình hóa Reactor Pattern bằng TypeScript: [[Redis_Reactor_Pattern_Typescript_Model]]
- [[Context_Switching_Cost_Mechanics]]: Bản chất chi phí chuyển đổi ngữ cảnh và tài nguyên Thread.
- [[Latency_Percentiles_and_Throughput_Fundamentals]]: Phân tích hiện tượng Tail Latency và Coordinated Omission khi hàng đợi bị nghẽn.
- [[Redis_Roadmap]]
- [[000_Concepts_MOC]]: Danh mục tri thức nền tảng Khoa học Máy tính.
