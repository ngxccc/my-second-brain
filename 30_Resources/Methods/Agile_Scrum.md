---
tags: [type/method, topic/engineering, topic/productivity]
aliases: [Quy trình Agile Scrum, Agile Scrum Process]
date: 2026-06-23
---

# Quy Trình Agile & Scrum Trong Dự Án

## TL;DR

Quy trình quản lý dự án linh hoạt (Agile) áp dụng khung làm việc Scrum nhằm tối ưu hóa năng suất phát triển phần mềm thông qua các chu kỳ phát triển ngắn (Sprints) và cải tiến liên tục.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Các dự án phát triển phần mềm có yêu cầu thay đổi liên tục, không thể xác định 100% nghiệp vụ từ đầu.
  - Các dự án yêu cầu bàn giao sản phẩm chạy được (working software) định kỳ để lấy phản hồi từ khách hàng hoặc mentor.
  - Các nhóm làm việc tự quản (self-organizing teams) muốn tối ưu hóa tốc độ và quy trình giao tiếp.
- **Điều kiện tiên quyết (Prerequisites):**
  - Phân chia rõ ràng 3 vai trò: Product Owner (PO), Scrum Master (SM), và Development Team.
  - Có danh sách các yêu cầu (Product Backlog) được viết dưới dạng **User Story**.

### 🌟 3 Trụ Cột Cốt Lõi Của Scrum (Empiricism)

Scrum vận hành dựa trên chủ nghĩa thực nghiệm với 3 trụ cột cốt lõi:

1. **Tính Minh Bạch (Transparency):** Mọi thông tin (tiến độ, lỗi, yêu cầu thay đổi) phải được hiển thị rõ ràng cho tất cả các thành viên và mentor.
2. **Tính Thanh Tra (Inspection):** Định kỳ kiểm tra sản phẩm và quy trình làm việc (thông qua các cuộc họp Daily, Review, Retro) để phát hiện sớm các sai lệch.
3. **Tính Thích Ứng (Adaptation):** Sẵn sàng thay đổi quy trình làm việc hoặc sản phẩm ngay khi phát hiện sai lệch để giảm thiểu rủi ro (ví dụ: thích ứng khi có Change Requirement - CR ở Day 12).

---

## Step-by-Step Guideline

### 1. Chuẩn Bị & Quản Lý Product Backlog

- **Người thực hiện:** Product Owner (PO).
- **Hành động:**
  - PO thu thập yêu cầu từ khách hàng và phân rã thành các **User Story** theo mẫu: _"Là [vai trò], tôi muốn [chức năng] để [lợi ích]."_
  - Sắp xếp thứ tự ưu tiên cho các User Story từ cao xuống thấp.

### 2. Họp Kế Hoạch Sprint (Sprint Planning)

- **Thời điểm:** Đầu mỗi Sprint (chu kỳ từ 1 đến 4 tuần, thông thường là 1 tuần cho dự án ngắn hạn).
- **Hành động:**
  1. Cả team họp cùng PO để chọn ra các User Story ưu tiên hàng đầu mà team cam kết sẽ hoàn thành trong Sprint này (đưa vào **Sprint Backlog**).
  2. Development Team thực hiện phân rã các User Story được chọn thành các task kỹ thuật cụ thể (WBS - Work Breakdown Structure) với thời gian hoàn thành từ 2 - 4 tiếng mỗi task.

### 3. Thực Hiện Sprint & Họp Hàng Ngày (Daily Scrum / Standup)

- **Thời điểm:** Hàng ngày trong suốt Sprint, thường họp nhanh tối đa 15 phút vào cùng một giờ cố định.
- **Hành động:**
  - _Lưu ý từ Scrum Guide 2020:_ Scrum Guide đã chính thức lược bỏ cấu trúc bắt buộc "3 câu hỏi" truyền thống nhằm tăng tính chủ động cho Developers. Mục tiêu chính là kiểm tra tiến độ hướng tới **Sprint Goal** và cập nhật **Sprint Backlog**.
  - Tuy nhiên, với các nhóm mới bắt đầu, cấu trúc 3 câu hỏi vẫn là công cụ đơn giản nhất để cập nhật:
    1. _Hôm qua tôi đã làm gì để giúp team đạt Sprint Goal?_
    2. _Hôm nay tôi sẽ làm gì để giúp team đạt Sprint Goal?_
    3. _Tôi có gặp khó khăn hay trở ngại gì không?_ (Blockers)
  - Scrum Master ghi nhận các khó khăn (blockers) để tìm phương án giải quyết sớm nhất, đảm bảo team không bị tắc nghẽn.

### 4. Họp Đánh Giá Sprint (Sprint Review)

- **Thời điểm:** Cuối Sprint.
- **Hành động:**
  1. Development Team thực hiện **Demo** các tính năng đã hoàn thành và chạy được trực quan trước PO và khách hàng (hoặc Mentor).
  2. PO nghiệm thu sản phẩm dựa trên tiêu chí chấp nhận (Acceptance Criteria) của từng User Story. Các User Story chưa hoàn thành sẽ được đẩy ngược lại Product Backlog để làm sau.

### 5. Họp Rút Kinh Nghiệm Sprint (Sprint Retrospective)

- **Thời điểm:** Cuối Sprint, ngay sau Sprint Review.
- **Hành động:**
  - Cả team nhìn nhận lại quá trình làm việc của Sprint vừa qua để chỉ ra:
    - **What went well:** Cái gì làm tốt và cần phát huy?
    - **What didn't go well:** Cái gì làm chưa tốt và cần cải thiện?
    - **Action Items:** Các hành động cải tiến cụ thể cho Sprint tiếp theo.

---

## Verification / Testing

- [ ] Product Backlog có đầy đủ User Stories được sắp xếp thứ tự ưu tiên.
- [ ] Sprint Backlog được thiết lập và phân chia task cụ thể trên bảng Kanban (GitHub Projects, Jira hoặc Trello).
- [ ] Báo cáo Daily Standup được thực hiện đầy đủ hàng ngày.
- [ ] Tổ chức đầy đủ cuộc họp Sprint Review và Sprint Retrospective kèm biên bản họp (Meeting Minutes).

---

**Related Notes:**

- [[Standard_Project_Timeline_SOP]]

## Sources / References

- [Scrum.org - The Scrum Guide (Official 2020 Edition)](https://scrumguides.org/scrum-guide.html)
- [Atlassian Agile Coach - Scrum Work Management](https://www.atlassian.com/agile/scrum)
