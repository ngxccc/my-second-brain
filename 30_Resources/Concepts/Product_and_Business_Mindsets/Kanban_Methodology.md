---
tags: [type/concept, status/permanent]
date: 2026-06-24
description: "Phương pháp và bảng Kanban quản lý dòng công việc trực quan theo mô hình Kéo (Pull)."
---

# Phương Pháp & Bảng Kanban Trong Quản Trị Dự Án

## TL;DR

- **Bản chất**: Kanban trực quan hóa workflow theo mô hình pull của Toyota, với WIP limit ở mỗi cột để chặn dòng việc đang làm vượt năng lực.
- **Mục đích**: Giảm cycle time và làm lộ bottleneck, vì việc đang làm dở nhiều hơn năng lực thì mọi thứ chậm lại.
- **Điểm mấu chốt**: WIP limit mới là cơ chế tạo áp lực cải tiến; bảng Kanban không có giới hạn WIP chỉ là danh sách việc trang trí đẹp.

---

## Core Concept: Kanban là gì?

**Kanban** (看板 - "bảng trực quan" hoặc "thẻ báo hiệu") được Taiichi Ohno phát triển tại hãng xe hơi **Toyota** cuối thập niên 1940 như công cụ sản xuất tinh gọn (Lean Manufacturing), tối ưu dây chuyền theo triết lý **Just-in-Time (JIT)**: chỉ sản xuất thứ cần thiết, khi cần thiết, với số lượng cần thiết. Năm 2004, **David J. Anderson** áp dụng các nguyên lý này vào công nghiệp phần mềm và công việc tri thức.

### 4 Nguyên Lý Quản Lý Thay Đổi

Khác với Scrum (thường yêu cầu thay đổi cấu trúc vai trò ngay lập tức), Kanban tiếp cận theo hướng tiến hóa tự nhiên:

1. **Start with what you do now:** giữ nguyên quy trình, vai trò và trách nhiệm hiện tại.
2. **Agree to pursue evolutionary change:** thay đổi nhỏ, liên tục và tích lũy ít bị kháng cự hơn.
3. **Respect the current process, roles, responsibilities & titles:** tránh xáo trộn tổ chức ngay lập tức, để quy trình phát triển dựa trên thực tế.
4. **Encourage acts of leadership at all levels:** bất kỳ thành viên nào cũng có thể đề xuất cải tiến quy trình (Kaizen).

---

## Áp dụng Kanban vào quản trị dự án

### 6 Thực Hành Cốt Lõi

1. **Trực Quan Hóa Quy Trình**: dùng bảng (Kanban Board) chia thành các cột trạng thái (`To do`, `In Progress`, `Review`, `Testing`, `Done`); mỗi công việc là một thẻ (Kanban Card) ghi mô tả, người làm, deadline.
2. **Giới Hạn Công Việc Đang Làm**: đây là thực hành quan trọng nhất — mỗi cột (trừ Done) có **WIP Limit**. Cột `In Progress` giới hạn 3 nghĩa là không ai được kéo thêm task mới cho tới khi có task rời cột. Mục đích là ép nhóm hoàn thành dứt điểm việc cũ (**"Stop starting, start finishing"**), loại bỏ tổn hao do context switching và multitasking.
3. **Quản Lý Dòng Chảy**: theo dõi tốc độ di chuyển của thẻ; khi một cột chạm WIP Limit, đó là **Điểm nghẽn (Bottleneck)** và cả nhóm cần swarming vào cột đó để khơi thông dòng chảy.
4. **Quy Định Rõ Ràng Các Chính Sách**: thiết lập tiêu chuẩn chung để dịch chuyển task giữa các cột (thế nào là hoàn thành, khi nào đủ điều kiện sang `Code Review` hoặc `Testing`).
5. **Thiết Lập Các Vòng Lặp Phản Hồi**: họp định kỳ (Kanban meeting hàng ngày, họp đánh giá dịch vụ) để đánh giá dòng chảy và điều chỉnh WIP Limit hoặc chính sách.
6. **Cải Tiến Cộng Tác**: dùng số liệu thực tế để phân tích hiệu suất và thử nghiệm cải tiến quy trình liên tục.

### Các Thành Phần Cấu Thành Bảng Kanban

1. **Kanban Cards:** đại diện một đơn vị công việc (Task/User Story).
2. **Kanban Columns:** các bước trong chuỗi giá trị (Value Stream).
3. **WIP Limits:** số thẻ tối đa ở đầu mỗi cột.
4. **Commitment Point:** thời điểm task được tiếp nhận từ backlog và bắt đầu thực hiện.
5. **Delivery Point:** thời điểm công việc hoàn tất và chuyển tới khách hàng hoặc mentor.
6. **Swimlanes:** hàng ngang phân chia công việc theo danh mục (Module, mức ưu tiên Khẩn cấp - Expedite, việc Thường - Standard).

## Related Notes

- Khi nào chọn Kanban thay vì Scrum, và phân tầng Maslow phù hợp: [[Kanban_vs_Scrum_and_Adoption_Context]]
- Đo dòng chảy bằng Lead Time, Cycle Time, Throughput: [[Kanban_Flow_Metrics]]
- [[Agile_Management_via_GitHub]]: vận hành bảng Kanban trên GitHub Projects.
- [[Agile_Scrum]]: khung chạy theo Sprint cố định.
- [[Systems_Thinking]]: tư duy về dòng chảy và điểm nghẽn trong hệ thống.

## Sources / References

- [Kanban University - What is the Kanban Method?](https://kanban.university/what-is-kanban/)
- [Atlassian Agile Coach - What is Kanban?](https://www.atlassian.com/agile/kanban)
- [David J. Anderson - "Kanban: Successful Evolutionary Change for Your Technology Business"](https://www.amazon.com/Kanban-Successful-Evolutionary-Technology-Business/dp/0984530500)
