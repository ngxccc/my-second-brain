---
tags: [type/method, status/permanent]
date: 2026-06-23
description: "Quy trình quản lý và phát triển phần mềm linh hoạt thông qua các chu kỳ ngắn (Sprints) và cải tiến quy trình liên tục."
---

# Quy Trình Agile & Scrum Trong Dự Án

## TL;DR

- **Bản chất**: Scrum là khung Agile chạy theo Sprint ngắn, có backlog, vai trò rõ ràng và vòng cải tiến sau mỗi Sprint.
- **Mục đích**: Chịu được requirement thay đổi liên tục và cho phản hồi sớm thay vì chờ đến cuối dự án.
- **Điểm mấu chốt**: Giá trị nằm ở vòng phản hồi ngắn, không ở nghi thức; giữ đủ nghi thức mà không cắt được scope chỉ là Scrum hình thức.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Các dự án phát triển phần mềm có yêu cầu thay đổi liên tục, không thể xác định 100% nghiệp vụ từ đầu.
  - Các dự án yêu cầu bàn giao sản phẩm chạy được (working software) định kỳ để lấy phản hồi từ khách hàng hoặc mentor.
  - Các nhóm làm việc tự quản (self-organizing teams) muốn tối ưu hóa tốc độ và quy trình giao tiếp.
- **Điều kiện tiên quyết (Prerequisites):**
  - Phân chia rõ ràng các vai trò trong Scrum Team: Product Owner (PO), Scrum Master (SM), và Developers.
  - Có danh sách các yêu cầu (Product Backlog) được viết dưới dạng **User Story**.

### Lịch Sử & Tiến Hóa

- **Bối cảnh ra đời:** chính thức hóa năm 2001 qua Agile Manifesto, để xử lý sự kém linh hoạt, chi phí thay đổi cao và yêu cầu bị đóng băng của các mô hình trước đó ([[Waterfall]], [[V_Model]], [[Spiral_Model]]).
- **Trọng tâm:** con người, sự thích ứng và bàn giao giá trị liên tục qua từng chu kỳ ngắn, thay vì quy trình và tài liệu.
- **Đọc thêm:** lược sử tiến hóa tại [[SDLC_Methodologies_Evolution]].

## Core Concept: Trụ cột, Giá trị, Hiện vật và Cam kết

### 3 Trụ Cột Cốt Lõi

Scrum vận hành dựa trên chủ nghĩa thực nghiệm với 3 trụ cột:

1. **Tính Minh Bạch (Transparency):** Mọi thông tin (tiến độ, lỗi, yêu cầu thay đổi) phải được hiển thị rõ ràng cho tất cả các thành viên và mentor.
2. **Tính Thanh Tra (Inspection):** Định kỳ kiểm tra sản phẩm và quy trình làm việc (thông qua các cuộc họp Daily, Review, Retro) để phát hiện sớm các sai lệch.
3. **Tính Thích Ứng (Adaptation):** Sẵn sàng thay đổi quy trình làm việc hoặc sản phẩm ngay khi phát hiện sai lệch để giảm thiểu rủi ro (ví dụ: thích ứng khi có Change Requirement - CR ở Day 12).

### 5 Giá Trị Của Scrum

1. **Cam Kết (Commitment):** Mỗi thành viên cam kết đạt mục tiêu của Scrum Team và hỗ trợ lẫn nhau.
2. **Tập Trung (Focus):** Tập trung tối đa vào công việc của Sprint để đạt tiến độ tốt nhất hướng tới các mục tiêu.
3. **Cởi Mở (Openness):** Chia sẻ cởi mở về tiến độ cũng như các khó khăn, thách thức gặp phải.
4. **Tôn Trọng (Respect):** Tôn trọng khả năng độc lập, chuyên môn và ý kiến của nhau.
5. **Dũng Cảm (Courage):** Dũng cảm đối mặt thử thách, làm điều đúng đắn và giải quyết các vấn đề khó khăn.

### 3 Hiện Vật & 3 Cam Kết

Mỗi hiện vật trong Scrum đi kèm một cam kết nhằm tăng tính minh bạch và cung cấp mục tiêu đo lường tiến độ:

1. **Product Backlog** (Cam kết: **Product Goal**) — mô tả trạng thái tương lai của sản phẩm, đóng vai trò mục tiêu dài hạn của Scrum Team.
2. **Sprint Backlog** (Cam kết: **Sprint Goal**) — mục tiêu duy nhất của Sprint hiện tại, mang lại sự tập trung và định hướng cho Developers.
3. **Increment** (Cam kết: **Definition of Done**) — mô tả chính thức về trạng thái của sản phẩm khi đáp ứng đầy đủ các tiêu chuẩn chất lượng bắt buộc.

> **Phân biệt DoD (Definition of Done) và AC (Acceptance Criteria):**
>
> - **Definition of Done (DoD):** bộ quy chuẩn chất lượng **chung** áp dụng cho _mọi_ User Story (code sạch, đã review chéo, đã kiểm thử, đã deploy thành công). Do cả team thống nhất.
> - **Acceptance Criteria (AC):** tiêu chí nghiệm thu **riêng** cho _từng_ User Story, do PO định nghĩa.
>   _Một User Story chỉ được coi là Done khi thỏa mãn cả AC riêng của nó và DoD chung của team._

## Related Notes

- Quy trình 5 nghi thức chạy trong mỗi Sprint: [[Scrum_Sprint_Ceremonies_SOP]]
- Vị trí của Scrum trong dòng tiến hóa SDLC: [[SDLC_Methodologies_Evolution]]
- Lịch 16 tuần áp dụng Scrum vào đồ án: [[Standard_Project_Timeline_SOP]]

## Sources / References

- [Scrum.org - The Scrum Guide (Official 2020 Edition)](https://scrumguides.org/scrum-guide.html)
- [Atlassian Agile Coach - Scrum Work Management](https://www.atlassian.com/agile/scrum)
