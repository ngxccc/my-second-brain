---
tags: [type/concept, status/permanent]
date: 2026-11-02
description: "Phần attention còn bám lại việc cũ sau khi đã chuyển sang việc mới, làm giảm hiệu suất ở việc mới dù việc cũ đã dừng."
---

# Attention Residue

## TL;DR

- **Bản chất**: Khi chuyển việc, một phần working memory vẫn xử lý việc cũ; phần bị chiếm đó không tự giải phóng lúc mày đã quay lại việc mới.
- **Mục đích**: Giải thích vì sao "check nhanh 10 giây" không tốn 10 giây, và vì sao chia khối thắng việc chen ngang liên tục.
- **Điểm mấu chốt**: Thiệt hại tỉ lệ với độ dang dở của việc cũ, không tỉ lệ với thời gian chen vào; cắt ngang lúc chưa đóng gói đắt hơn nhiều.

---

## Core Concept

- Attention residue (Leroy, 2009): sau khi rời việc A để làm B, một phần attention vẫn gắn với A và làm giảm hiệu suất trên B.
- Cơ chế: việc chưa đóng để lại một goal state đang hoạt động; não tiếp tục phân bổ tài nguyên cho nó dù mày đã đổi cửa sổ.
- Cùng gốc với hiện tượng open loop: việc chưa xong vẫn chiếm chỗ trong đầu, kể cả khi đang nghỉ hoặc đang ngủ.

## Điều kiện làm nó nặng hay nhẹ

| Yếu tố              | Nặng                                | Nhẹ                              |
| ------------------- | ----------------------------------- | -------------------------------- |
| Trạng thái việc cũ  | Cắt giữa lúc chưa rõ bước tiếp theo | Đã ghi "đang ở đâu, làm gì tiếp" |
| Độ phức tạp việc cũ | Nhiều ràng buộc chưa giải           | Việc cơ học, tuyến tính          |
| Thời gian chen vào  | 10 giây cũng đủ gây residue         | Không có ngưỡng an toàn          |
| Số lần chuyển       | Nhiều lần nhỏ, không đóng gói       | Một lần có chủ đích, có ghi chú  |

## Hệ quả thực hành

- Chi phí thật của một lần check là 10 giây cộng 10-15 phút lấy lại độ sâu, không phải 10 giây.
- Chuyển việc có kiểm soát vẫn ổn nếu đóng gói trước: ghi trạng thái, đặt mốc quay lại, rồi mới rời.
- Đây là lý do một khối 90 phút một việc thắng một lịch dày đặc nhiều việc nhỏ, dù tổng thời gian bằng nhau.

## Khi nào kết luận này không áp dụng

- Việc cũ đã hoàn thành trọn vẹn: residue gần bằng 0, chuyển sang việc mới gần như miễn phí.
- Việc chen vào là nghỉ thật (đi bộ, nhìn xa, thở): không chiếm kênh ngôn ngữ nên không tạo residue đáng kể.
- Bản thân việc mới cũng cơ học: residue có tồn tại nhưng không làm hỏng kết quả.

## Related Notes

- Quy trình áp dụng: [[Deep_Work]]
- Giới hạn working memory làm nền: [[Cognitive_Load_Theory]]
- Nguyên tắc Focus trong framework học tập: [[Ultralearning_Framework]]
