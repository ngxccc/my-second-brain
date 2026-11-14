---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba chỉ số đo dòng chảy trong Kanban: Lead Time, Cycle Time và Throughput, cùng cách dùng chúng để phát hiện nghẽn."
---

# Chỉ số Đo Dòng chảy trong Kanban

## TL;DR

- **Bản chất**: Ba chỉ số đo một dòng việc: Lead Time (yêu cầu đến bàn giao), Cycle Time (bắt đầu đến bàn giao), Throughput (số việc xong mỗi đơn vị thời gian).
- **Mục đích**: Đo bằng số thật thay vì cảm giác, để biết WIP Limit đang đúng hay sai và nghẽn nằm ở cột nào.
- **Điểm mấu chốt**: Cycle Time là chỉ số đánh giá năng lực thực tế của đội, còn Lead Time là thứ khách hàng cảm nhận; chênh lệch giữa hai chỉ số này chính là thời gian chờ trong backlog.

## Core Concept: Ba chỉ số và mốc đo

- **Lead Time (Thời gian hoàn thành):** khoảng thời gian từ lúc khách hàng yêu cầu (đưa vào backlog) đến lúc bàn giao thành công (Delivery Point).
- **Cycle Time (Thời gian chu kỳ):** khoảng thời gian từ khi bắt đầu thực hiện công việc (Commitment Point) đến lúc hoàn thành (Delivery Point). Đây là chỉ số quan trọng để đánh giá năng lực thực tế của Dev team.
- **Throughput (Năng suất đầu ra):** số lượng công việc hoàn thành trong một đơn vị thời gian (ví dụ 10 tasks/tuần).

## Cách đọc số

- **Lead Time − Cycle Time = thời gian chờ** trong backlog hoặc hàng đợi giữa các cột; khoảng này tăng là dấu hiệu đầu tiên của nghẽn.
- **Throughput giảm trong khi WIP không đổi** nghĩa là dòng chảy bị tắc ở một cột cụ thể, không phải đội làm chậm đi.
- **Giảm WIP Limit mà Cycle Time không giảm** là tín hiệu nghẽn nằm ở nguồn lực chuyên môn hoặc chính sách chuyển cột, không ở số lượng việc đang làm.

## Related Notes

- Cơ chế WIP Limit và quản lý dòng chảy: [[Kanban_Methodology]]
- Chọn Kanban hay Scrum theo tính chất công việc: [[Kanban_vs_Scrum_and_Adoption_Context]]
- [[Latency_Percentiles_and_Throughput_Fundamentals]]: phân biệt throughput với phân bố độ trễ khi đánh giá hệ thống.
