---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Khi nào dùng Kanban thay vì Scrum: điều kiện áp dụng, phân tầng Maslow phù hợp và bảng so sánh năm tiêu chí."
---

# Kanban vs Scrum và Điều kiện Áp dụng

## TL;DR

- **Bản chất**: Kanban hợp với dòng việc liên tục và thay đổi bất chợt; Scrum hợp với nhịp Sprint cố định và mục tiêu ngắn hạn rõ ràng.
- **Mục đích**: Chọn đúng khung theo tính chất công việc, thay vì mặc định Scrum rồi ép mọi thứ vào Sprint.
- **Điểm mấu chốt**: Khác biệt cốt lõi nằm ở cách giới hạn WIP — Kanban giới hạn trực tiếp trên từng cột, Scrum giới hạn gián tiếp qua dung lượng cam kết của Sprint.

## Application Context & Maslow Alignment

- **Phân tầng Maslow phù hợp**: **Tầng 2 (Safety — kiểm soát công việc, giảm quá tải & stress)** và **Tầng 4 (Esteem — tối ưu hiệu suất và minh bạch hóa thành quả)**.
- **Điều kiện tiên quyết**: áp dụng được ở mọi tầng lớp và giai đoạn làm việc. Giới hạn WIP giúp giảm quá tải nhận thức và ngắt cơn Amygdala Hijack do bối rối vì quá nhiều task dồn dập.
- **Đối tượng áp dụng**: cá nhân tự quản lý công việc, đội kỹ sư phần mềm, quản lý dự án, tổ chức vận hành tinh gọn.

## So Sánh Kanban vs Scrum

| Tiêu chí so sánh      | Scrum                                                      | Kanban                                          |
| :-------------------- | :--------------------------------------------------------- | :---------------------------------------------- |
| **Nhịp độ (Cadence)** | Theo các Sprint cố định (1-4 tuần)                         | Dòng chảy liên tục (Continuous Flow)            |
| **Vai trò (Roles)**   | Yêu cầu 3 vai trò bắt buộc: PO, SM, Developers             | Không bắt buộc vai trò mới                      |
| **Quản lý WIP**       | Giới hạn gián tiếp qua dung lượng cam kết của Sprint       | Giới hạn trực tiếp bằng WIP Limit trên từng cột |
| **Thay đổi yêu cầu**  | Hạn chế thay đổi trong Sprint Backlog khi Sprint đang chạy | Chấp nhận thay đổi bất kỳ lúc nào ở cột To do   |
| **Chỉ số đo lường**   | Velocity (tốc độ hoàn thành công việc)                     | Lead Time, Cycle Time, Throughput               |

## Cách chọn

- **Chọn Kanban** khi công việc đến không đều, có nhiều luồng khẩn cấp chen ngang, hoặc không muốn thay đổi cấu trúc vai trò hiện có.
- **Chọn Scrum** khi cần mục tiêu ngắn hạn rõ ràng cho cả nhóm và muốn nhịp review/demo cố định với khách hàng.
- **Kết hợp** là hợp lệ: nhiều đội chạy Sprint của Scrum nhưng vẫn đặt WIP Limit trên bảng Kanban để kiểm soát dòng chảy bên trong Sprint.

## Related Notes

- Cơ chế, 6 thực hành và thành phần bảng: [[Kanban_Methodology]]
- Đo dòng chảy bằng Lead Time, Cycle Time, Throughput: [[Kanban_Flow_Metrics]]
- [[Agile_Scrum]]: khung Scrum đầy đủ gồm trụ cột, giá trị và hiện vật.
- [[Scrum_Sprint_Ceremonies_SOP]]: quy trình 5 nghi thức của một Sprint.
- [[Amygdala_Hijack_and_Prefrontal_Override]]: vì sao quá tải task làm sụt năng lực tư duy.
