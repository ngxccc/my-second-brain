---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ma trận đánh đổi giữa kiến trúc Multi-Process và Multi-Thread: fault isolation, chi phí chia sẻ dữ liệu, rủi ro concurrency và RAM."
---

# Ma trận Đánh đổi: Multi-Process vs Multi-Thread

## TL;DR

- **Bản chất**: Bảng chọn giữa Multi-Process (Nginx, Chrome, PostgreSQL) và Multi-Thread (Java Netty, Go Runtime) theo 4 tiêu chí: cô lập lỗi, chia sẻ dữ liệu, rủi ro đồng thời, chi phí RAM.
- **Mục đích**: Trả lời câu "vì sao service này chạy nhiều process còn service kia chạy nhiều thread" bằng tiêu chí kỹ thuật thay vì theo thói quen.
- **Điểm mấu chốt**: Multi-Process cô lập tuyệt đối nhưng phải IPC; Multi-Thread chia sẻ dữ liệu qua con trỏ Heap nhưng đổi lại là Race Condition, Deadlock và Memory Visibility.

## Core Concept: Ma trận Đánh đổi

| Tiêu chí                                      | Multi-Process (Ví dụ: Nginx, Chrome, PostgreSQL)                                                     | Multi-Thread (Ví dụ: Java Netty, Go Runtime, Node Worker)                                                 |
| :-------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Tính cô lập & Chống sập (Fault Isolation)** | **Tuyệt đối**: Một Worker process bị crash/panic không làm sập các process khác.                     | **Thấp**: Một Thread bị Panic/Segfault không bắt được có thể làm sập toàn bộ Process.                     |
| **Chia sẻ dữ liệu**                           | Phức tạp, phải dùng IPC (Inter-Process Communication: Sockets, Pipes, Shared Memory, Message Queue). | Cực kỳ nhanh, chỉ cần đọc/ghi chung con trỏ trên Heap.                                                    |
| **Rủi ro Đồng thời (Concurrency Bug)**        | Không có Race Condition trên bộ nhớ nội bộ.                                                          | Rất dễ dính **Race Condition, Deadlock, Memory Visibility**. Bắt buộc dùng Mutex, Semaphore, hoặc Atomic. |
| **Chi phí RAM & CPU Overhead**                | Tốn nhiều RAM do nhân bản Page Table và các cấu trúc OS.                                             | Tiết kiệm RAM, tạo và hủy luồng nhanh hơn nhiều.                                                          |

## Khi nào chọn bên nào

- **Chọn Multi-Process** khi ưu tiên hàng đầu là không để một lỗi cục bộ kéo sập cả hệ thống (web server, database, trình duyệt đa tab), và chấp nhận trả giá bằng IPC cùng bộ nhớ nhân bản.
- **Chọn Multi-Thread** khi các đơn vị xử lý cần chia sẻ một khối dữ liệu lớn trong RAM (cache, connection pool, state của game), và team kiểm soát được kỷ luật đồng bộ.
- **Trường hợp lai**: Worker pool kiểu Nginx hay PostgreSQL vừa tách process để cô lập vừa dùng thread con bên trong mỗi process; đây là mặc định của phần lớn hệ thống production tải cao.

## Related Notes

- Cấu trúc bộ nhớ dẫn tới các đánh đổi này: [[Process_vs_Thread_Memory_Model]]
- Chi phí chuyển đổi ngữ cảnh giữa các đơn vị: [[Context_Switching_Cost_Mechanics]]
- [[Master_Backend_Engineering_SSOT]]: Khung chương trình và bản đồ thực hành Backend.
- [[000_Concepts_MOC]]: Danh mục lý thuyết nền tảng khoa học máy tính.
