---
tags: [type/concept, status/permanent]
date: 2026-10-03
description: "Bản đồ điều hướng trung tâm (MOC) tổng hợp toàn bộ các lộ trình học tập thực chiến 80/20 về Kỹ thuật phần mềm, Hệ thống phân tán và Ngôn ngữ trong Second Brain."
---

# Master Roadmaps Index

## TL;DR

- **Bản chất**: Không chứa nội dung học: mỗi dòng chỉ là một liên kết tới roadmap hoặc note phương pháp, kèm trạng thái và tiêu chuẩn nghiệm thu của mục đó.
- **Mục đích**: Là điểm vào duy nhất để biết mình đang học gì, tiêu chuẩn nghiệm thu là gì, và phương pháp thực thi nằm ở note nào.
- **Điểm mấu chốt**: Giá trị phụ thuộc vào việc cập nhật khi roadmap đổi; một index lệch đường dẫn sẽ đưa người đọc tới note đã lỗi thời.

---

## 1. Kỹ thuật Phần mềm & Hệ thống Hạ tầng (Core Engineering & Infrastructure)

Các lộ trình trang bị năng lực chẩn đoán sự cố, tối ưu hóa tài nguyên phần cứng và làm chủ môi trường Production:

- **[[Linux_Roadmap]]**: Lộ trình làm chủ Linux Kernel, Process Memory, Sockets, Namespaces, Cgroups, Systemd và eBPF Tracing trên Arch Linux theo phương pháp USE Method.
- **[[Reverse_Engineering_Roadmap]]**: Lộ trình làm chủ Reverse Engineering và Binary Systems. Tập trung vào x86_64/ARM64 Calling Conventions, cấu trúc PE/ELF/DEX, Static Decompilation với Ghidra/Jadx, Dynamic Instrumentation với Frida, và bóc tách Network Protocols.
- **[[Master_Backend_Engineering_SSOT]]**: Nguồn sự thật duy nhất về mục tiêu vai trò, tiêu chuẩn kỹ thuật và các mốc thời gian phát triển sự nghiệp Backend Engineer.
- **[[Backend_Learning_Path]]**: Lộ trình backend 60 mục chia 6 tầng, tách `Now` và `Post-offer`, kèm điều kiện tiên quyết và sprint hiện tại.
- **[[Backend_Knowledge_Checklist]]**: Bản đồ codebase `open-genset/backend` gồm 177 mục gắn mức năng lực L1-L5, dùng để đối chiếu khi học.
- **[[Electronics_Roadmap]]**: Lộ trình làm chủ điện tử căn bản thực chiến theo phương pháp Ultralearning. Bóc tách trực quan Định luật Ohm, phân áp, linh kiện thụ động và bán dẫn, 4 bậc ngân sách từ 0 đồng, phân cấp năng lực Capability Gates và kỹ năng đo đạc VOM.
- **[[IoT_Roadmap]]**: Lộ trình làm chủ IoT và Nông nghiệp thông minh từ số 0. Bắt đầu bằng mô phỏng Wokwi không chi phí, lập trình Firmware ESP32, giao thức MQTT/LoRaWAN, chuẩn công nghiệp RS485/Modbus RTU và cơ chế tiết kiệm năng lượng Deep Sleep.

---

## 2. Hệ thống Phân tán, Hiệu năng & In-Memory (Performance & In-Memory Systems)

Các lộ trình làm chủ bài toán tải cao (High-Concurrency), độ trễ cực thấp và tối ưu hóa hệ thống bộ nhớ:

- **[[Redis_Roadmap]]**: Lộ trình làm chủ In-Memory Systems Engineering với Redis. Tập trung vào Single-threaded Event Loop, Non-blocking I/O, Compact Encodings (`listpack`), phòng thủ 4 thảm họa Cache và tối ưu hóa Persistence.
- **[[Grafana_K6_Roadmap]]**: Lộ trình làm chủ kiểm thử hiệu năng và độ trễ hệ thống với Grafana k6. Tập trung vào Closed vs Open Workload Models, xử lý Coordinated Omission, thiết lập Threshold Quality Gates và tự động hóa CI/CD.

---

## 3. Kiến trúc Hệ thống & Thuật toán (Architecture & Algorithms)

Các lộ trình rèn luyện tư duy thiết kế hệ thống quy mô lớn và phản xạ giải thuật:

- **[[System_Design_Roadmap]]**: Lộ trình thiết kế hệ thống phân tán, xử lý tải đột biến, tính nhất quán dữ liệu (CAP/PACELC), và phân vùng dữ liệu (Partitioning & Sharding).
- **[[LeetCode_Roadmap]]**: Lộ trình làm chủ 14 mẫu hình giải thuật cốt lõi (Sliding Window, Two Pointers, Fast & Slow, Monotonic Stack, BFS/DFS).
- **[[DSA_Roadmap]]**: Nền tảng cấu trúc dữ liệu và giải thuật căn bản (Trees, Graphs, Sorting, Hash Tables).

---

## 4. Năng lực Ngôn ngữ & Giao tiếp Kỹ thuật (Language & Communication)

Các lộ trình phát triển phản xạ ngôn ngữ thực chiến theo Khoa học Nhận thức và Second Language Acquisition (SLA):

- **[[English_Roadmap]]**: Lộ trình nắm chắc từ vựng và ngữ pháp tiếng Anh theo nghiên cứu SLA và Ultralearning. Cân bằng bộ tứ Four Strands (25% mỗi nhánh), tối ưu hóa lõi từ vựng NGSL (2,800 từ = 92% độ bao phủ), vận hành Syntax State Machines và giảm tải nhận thức qua Pedagogical Translanguaging.
- **[[English_Learner_Profile]]**: Hồ sơ cá nhân theo dõi các mốc năng lực CEFR, danh mục quy tắc ngữ pháp đã làm chủ và nhật ký kiểm tra định kỳ.
- **[[TOEIC_Roadmap]]**: Lộ trình tự học nghe và viết bổ trợ phương pháp Dictation Part 1 & Part 2.

---

## Related Notes

- [[000_System_Structure]]
- [[000_Methods_MOC]]
- [[000_Tech_MOC]]
- [[000_Concepts_MOC]]
