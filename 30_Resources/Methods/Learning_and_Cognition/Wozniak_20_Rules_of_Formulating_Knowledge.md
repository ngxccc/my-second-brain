---
tags: [type/method, status/permanent]
date: 2026-10-18
description: "20 nguyên tắc chuẩn hóa tri thức của Dr. Piotr Wozniak (tác giả SuperMemo/SM-2) nhằm tối ưu hóa việc tạo thẻ flashcard và triệt tiêu mệt mỏi nhận thức."
---

# Wozniak 20 Rules of Formulating Knowledge

## TL;DR

- **Bản chất**: Bản hướng dẫn phương pháp luận đúc kết năm 1999 bởi Tiến sĩ Piotr Woźniak (nhà sáng lập SuperMemo, cha đẻ thuật toán SM-2).
- **Mục đích**: Cắt tận gốc nguyên nhân gây nản chí và mệt mỏi nhận thức khi học flashcard bằng cách chuẩn hóa kỹ thuật cấu trúc tri thức.
- **Điểm mấu chốt**: Spaced Repetition không cứu được bộ thẻ biên soạn tồi: thẻ vi phạm Minimum Information Principle sẽ thành thẻ đỉa (Leech), gây Interference và Cognitive Overload.

## Core Concept

- Sai lầm khi học flashcard không nằm ở trí nhớ người học hay thuật toán phân bổ thời gian, mà nằm ở **cách diễn đạt kiến thức (Knowledge Formulation)**.
- 20 quy tắc dưới đây chia thành 4 nhóm theo thứ tự thi hành: hiểu và dựng nền, nguyên tử hóa thẻ, tăng cường liên kết thần kinh, rồi ngữ cảnh và bảo trì bộ thẻ.
- Cơ chế gây mệt mỏi và ví dụ thẻ tồi/thẻ tốt được tách riêng tại [[Flashcard_Formulation_Cognitive_Load]].

## 20 quy tắc theo 4 nhóm thực hành

### Nhóm 1: Nhận thức & Nền tảng (hiểu toàn cảnh trước khi bóc tách)

1. **Do not learn if you do not understand** — không tạo thẻ cho nội dung bản thân chưa thể tự giải thích bằng ngôn từ của mình.
2. **Learn before you memorize** — dựng bức tranh tổng thể trước chi tiết: hiểu mô hình đồ thị DAG và 3 trạng thái file trong Git trước khi nhớ các cờ lệnh.
3. **Build upon the basics** — không nhảy cóc vào tầng chuyên sâu khi khái niệm sơ cấp chưa được tự động hóa; nền vững giúp tiếp thu tầng sau theo hàm mũ.

### Nhóm 2: Kỹ thuật Nguyên tử hóa (trọng tâm triệt tiêu phân tâm)

4. **Stick to the minimum information principle** (quan trọng nhất) — mỗi thẻ chỉ kiểm tra đúng **1 sự thật nguyên tử**, hỏi đáp đủ ngắn để não phản xạ trong **3–8 giây**.
5. **Cloze deletion is easy and effective** — kỹ thuật điền khuyết giữ thẻ nguyên tử, giảm độ mơ hồ và rút ngắn thời gian soạn thẻ.
6. **Avoid sets** — _Sai_: "Những quốc gia nào thuộc G7?" hay "Kể tên 5 nguyên tắc SOLID?". _Đúng_: tách thành "Chữ S trong SOLID đại diện cho nguyên tắc nào?".
7. **Avoid enumerations** — chuỗi có thứ tự thì hỏi theo cặp nối tiếp: "Bước diễn ra ngay sau SYN là gì? → SYN-ACK".
8. **Optimize wording** — cắt từ nối rườm rà và văn cảnh hoa mỹ, đi thẳng vào bản chất kỹ thuật để mắt không phải đọc quét.

### Nhóm 3: Tăng cường liên kết thần kinh (đòn bẩy bộ nhớ)

9. **Use imagery** — não nhớ hình ảnh tốt hơn văn bản thuần; thêm sơ đồ kiến trúc, biểu đồ luồng dữ liệu để tăng tốc độ nhận diện.
10. **Graphic deletion is as good as cloze deletion** — che nhãn linh kiện, tên hàm hoặc cả khối trong sơ đồ để kiểm tra khả năng định vị cấu trúc.
11. **Use mnemonic techniques** — từ viết tắt hoặc Memory Palace cho dữ liệu trừu tượng; chỉ nên áp cho 1–5% kiến thức khó nhất.
12. **Combat interference** — cặp dễ lẫn (`Process` vs `Thread`, `PUT` vs `PATCH`) nên học bằng thẻ so sánh làm nổi bật khác biệt bản chất thay vì học riêng rẽ.
13. **Refer to other memories** — neo khái niệm mới vào thứ đã quen (Message Queue $\leftrightarrow$ hàng đợi xếp hàng mua bánh mì).
14. **Personalize and provide examples** — gắn câu hỏi với codebase hoặc bug thật từng gặp ("Bug deadlock tuần trước do thiếu cơ chế nào?").
15. **Rely on emotional states** — tình huống ấn tượng hoặc cú crash đáng nhớ được giữ lâu hơn định nghĩa học thuật khô khan.

### Nhóm 4: Ngữ cảnh, Nguồn dữ liệu & Bảo trì thẻ

16. **Context cues simplify wording** — dùng tiền tố trong ngoặc vuông (`[Postgres - Index]`, `[Go - Slice Header]`) thay cho câu hỏi dài mô tả ngữ cảnh.
17. **Redundancy does not contradict minimum information** — hỏi cùng một sự thật từ nhiều hướng (khái niệm → chức năng, vấn đề → giải pháp) để gia cố đường mòn liên kết.
18. **Provide sources** — đính kèm link tài liệu chính thức hoặc tên sách ở phần ghi chú để tra lại ngữ cảnh khi cần hiệu chỉnh.
19. **Provide date stamping** — gắn năm hoặc phiên bản cụ thể cho các thông số dễ thay đổi (phiên bản LTS, dung lượng RAM khuyến nghị, cú pháp mới).
20. **Prioritize** — ưu tiên tri thức cốt lõi tạo 80% giá trị; dũng cảm Suspend hoặc xóa thẻ kém giá trị và thẻ Leech.

## Related Notes

- Cơ chế gây quá tải và ví dụ thẻ tồi/thẻ tốt: [[Flashcard_Formulation_Cognitive_Load]]
- [[Spaced_Repetition_SM2]]: Thuật toán tính chu kỳ ôn tập được thiết kế để phối hợp với các quy tắc này.
- [[Cognitive_Load_Theory]]: Nền tảng giải thích vì sao Minimum Information Principle triệt tiêu Extraneous Load.
- [[Dunlosky_Learning_Techniques_Matrix]]: Khung thực chứng cho Practice Testing khi được cấu trúc đúng.
- [[Herbert_Simon_Learning_Method]]: Cơ chế Chunking và giới hạn bộ nhớ làm việc hỗ trợ việc phân rã thẻ.
