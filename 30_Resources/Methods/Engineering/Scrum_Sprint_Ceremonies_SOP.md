---
tags: [type/method, status/permanent]
date: 2026-10-31
description: "SOP chạy 5 nghi thức Scrum trong một Sprint: thời điểm, người thực hiện, hành động và checklist nghiệm thu cho từng cuộc họp."
---

# Scrum Sprint Ceremonies SOP

## TL;DR

- **Bản chất**: Chuỗi nghi thức lặp mỗi Sprint: làm mịn backlog, Planning, Daily, Review, Retrospective — mỗi cuộc họp có mốc thời gian và đầu ra riêng.
- **Mục đích**: Chạy đúng nghi thức ở mức tối thiểu đủ để có vòng phản hồi ngắn và cải tiến thật sau mỗi Sprint.
- **Điểm mấu chốt**: Planning phải chốt Sprint Goal và tách task 2-4 tiếng; Daily theo Scrum Guide 2020 không bắt buộc 3 câu hỏi, chỉ cần hướng về Sprint Goal.

## Context: When to use?

- **Dùng khi:** team đã có Product Backlog bằng User Story và đang chạy Sprint ngắn (1-4 tuần, dự án ngắn thường chọn 1 tuần).
- **Điều kiện tiên quyết:** vai trò PO / SM / Developers đã rõ, và có Definition of Done chung do cả team thống nhất.
- **Khung khái niệm đứng sau các nghi thức này:** [[Agile_Scrum]].

## Step-by-Step Guideline

### 1. Chuẩn Bị & Quản Lý Product Backlog

- **Người thực hiện:** Product Owner (PO).
- **Hành động:** thu thập yêu cầu từ khách hàng và phân rã thành **User Story** theo mẫu _"Là [vai trò], tôi muốn [chức năng] để [lợi ích]"_ rồi sắp thứ tự ưu tiên từ cao xuống thấp.

### 1.5. Cải Tiến Product Backlog (Refinement)

- **Thời điểm:** định kỳ trong Sprint, thường giữa Sprint hoặc trước Sprint Planning.
- **Hành động:** cả team cùng PO rà soát backlog, làm rõ nghiệp vụ và chi tiết hóa story cho Sprint sau; Developers ước lượng Story Point.

### 2. Họp Kế Hoạch Sprint (Sprint Planning)

- **Thời điểm:** đầu mỗi Sprint.
- **Hành động:**
  1. Cả team họp cùng PO để chọn các User Story ưu tiên cao nhất đưa vào **Sprint Backlog** và xác định **Sprint Goal**.
  2. Developers phân rã story thành task kỹ thuật cụ thể (WBS) với thời lượng 2-4 tiếng mỗi task.

### 3. Thực Hiện Sprint & Họp Hàng Ngày (Daily Scrum)

- **Thời điểm:** hàng ngày trong Sprint, tối đa 15 phút, cùng một giờ cố định.
- **Hành động:** kiểm tra tiến độ hướng tới **Sprint Goal** và cập nhật **Sprint Backlog**; Scrum Master ghi nhận blockers để xử lý sớm.
- **Lưu ý từ Scrum Guide 2020:** cấu trúc "3 câu hỏi" đã bị lược bỏ khỏi quy định bắt buộc. Với team mới, bộ câu hỏi vẫn là công cụ đơn giản nhất:
  1. _Hôm qua tôi đã làm gì để giúp team đạt Sprint Goal?_
  2. _Hôm nay tôi sẽ làm gì để giúp team đạt Sprint Goal?_
  3. _Tôi có gặp khó khăn hay trở ngại gì không?_ (Blockers)

### 4. Họp Đánh Giá Sprint (Sprint Review)

- **Thời điểm:** cuối Sprint.
- **Hành động:**
  1. Developers **Demo** các tính năng đã hoàn thành và chạy được trước PO, khách hàng hoặc Mentor.
  2. PO nghiệm thu dựa trên Acceptance Criteria của từng story và Definition of Done chung; story chưa hoàn thành được đẩy ngược lại Product Backlog.

### 5. Họp Rút Kinh Nghiệm (Sprint Retrospective)

- **Thời điểm:** cuối Sprint, ngay sau Sprint Review.
- **Hành động:** cả team trả lời ba câu hỏi cố định:
  - **What went well:** cái gì làm tốt và cần phát huy?
  - **What didn't go well:** cái gì chưa tốt và cần cải thiện?
  - **Action Items:** hành động cải tiến cụ thể cho Sprint tiếp theo.

## Verification / Testing

- [ ] Product Backlog có đầy đủ User Story, Product Goal rõ ràng và đã sắp thứ tự ưu tiên.
- [ ] Hoạt động Backlog Refinement được thực hiện đều đặn trước mỗi đợt Planning.
- [ ] Sprint Backlog có Sprint Goal cụ thể và task được chia trên bảng Kanban (GitHub Projects, Jira hoặc Trello).
- [ ] Có bộ Definition of Done (DoD) chung được cả team thống nhất.
- [ ] Báo cáo Daily Standup được thực hiện đầy đủ hàng ngày hướng tới Sprint Goal.
- [ ] Sprint Review và Sprint Retrospective được tổ chức đầy đủ kèm biên bản họp (Meeting Minutes).

## Related Notes

- Khung khái niệm, trụ cột và giá trị của Scrum: [[Agile_Scrum]]
- [[Agile_Management_via_GitHub]]: Cách vận hành bảng Kanban và backlog trực tiếp trên GitHub.
- Lịch 16 tuần đặt các ceremony vào đâu: [[Standard_Project_Timeline_SOP]]
- [[Kanban_Methodology]]: Giới hạn WIP khi song song nhiều luồng việc.
