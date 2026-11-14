---
tags: [type/method, status/permanent]
date: 2026-10-31
description: "Quy trình 3 bước thay thế thói quen học tập kém hiệu quả bằng Practice Testing, Spaced Repetition và Interleaving."
---

# Study Habit Upgrade Protocol

## TL;DR

- **Bản chất**: Quy trình ba bước thay thói quen Low Utility bằng khung High Utility: cắt gạch chân/đọc lại, lấy Practice Testing làm trung tâm, rồi nâng chiều sâu bằng Moderate Utility.
- **Mục đích**: Chuyển từ học thụ động sang truy xuất chủ động mà không cần thêm thời gian học, chỉ đổi cách dùng thời gian đó.
- **Điểm mấu chốt**: Mọi tài liệu phải được chuyển thành câu hỏi truy vấn trước khi ghi nhớ; ghi lại sự thật là học thụ động, viết câu hỏi mới là học chủ động.

## Vì sao thói quen kém vẫn được ưa chuộng

1. **Hiệu ứng trôi chảy (Fluency Heuristic)**: khi đọc lại một trang sách hoặc nhìn dòng highlight, mắt nhận diện từ ngữ rất trơn tru. Não nhầm sự quen thuộc bề mặt (Perceptual Fluency) với năng lực làm chủ kiến thức thực tế.
2. **Tránh né nỗ lực nhận thức (Avoidance of Cognitive Work)**: đọc lại và gạch chân đòi hỏi rất ít năng lượng; Practice Testing và Distributed Practice tạo trở lực nhận thức cao (Desirable Difficulties) nên người học có xu hướng trốn tránh.

## Context: When to use?

- **Dùng khi:** phiên ôn tập bắt đầu thấy nản (thẻ tồn đọng dồn cục, vừa mở app đã muốn bỏ), hoặc khi vừa phát hiện mình đang dựa vào gạch chân và đọc lại.
- **Điều kiện tiên quyết:** đã có danh sách tài liệu cần học và một hệ thống ôn tập ngắt quãng (Anki/Yanki) để chứa câu hỏi sinh ra.
- **Không dùng khi:** đang cần nắm bức tranh tổng thể lần đầu — bước hiểu trước khi ghi nhớ phải xong trước, theo [[Wozniak_20_Rules_of_Formulating_Knowledge]].

## Step-by-Step Guideline

### Bước 1: Khai tử thói quen thụ động (Cut Low Utility)

- Cắt bỏ hoàn toàn việc cầm bút dạ quang tô màu văn bản.
- Khi đọc tài liệu kỹ thuật, không đọc lại lần thứ hai liên tiếp. Nếu cần ôn lại, đóng tài liệu và viết ra giấy những gì vừa đọc.

### Bước 2: Thiết lập khung xương High Utility (Active Recall + Spaced Repetition)

- **Practice Testing làm trung tâm**: chuyển mọi tài liệu thành câu hỏi truy vấn thay vì gạch đầu dòng tuyên bố sự thật:
  - _Thay vì ghi_: `Postgres MVCC dùng xmin và xmax để quản lý transaction visibility.`
  - _Hãy viết_: `Trong Postgres MVCC, hai trường header nào quyết định một transaction có nhìn thấy tuple hay không, và nguyên lý so sánh là gì?`
- **Tự động hóa với Spaced Repetition**: đưa các câu hỏi nguyên tử này vào hệ thống ôn tập ngắt quãng (như [[Spaced_Repetition_SM2]] qua Anki hoặc Yanki).

### Bước 3: Nâng cấp chiều sâu với Moderate Utility

- **Elaborative Interrogation khi debug hoặc đọc tài liệu**: mỗi khi gặp thiết kế kiến trúc hay cú pháp mới, tự hỏi _"Tại sao tác giả thiết kế như vậy mà không dùng phương án đơn giản hơn?"_.
- **Interleaved Practice khi luyện thuật toán**: thay vì giải 10 bài Sliding Window liên tiếp trong 2 ngày, trộn 2 bài Sliding Window, 2 bài Binary Search, 2 bài Graph để rèn phản xạ nhận diện bài toán.

## Verification / Testing

- [ ] Không còn bút dạ quang trong phiên đọc tài liệu kỹ thuật.
- [ ] Mỗi trang tài liệu đã đọc sinh ra ít nhất một câu hỏi truy vấn nguyên tử.
- [ ] Câu hỏi đã được đưa vào hệ thống ôn tập ngắt quãng, không nằm rời trong file ghi chú.
- [ ] Lịch luyện bài tập trộn dạng thay vì luyện nguyên khối một dạng.

## Related Notes

- Bảng xếp hạng và cơ chế của 10 kỹ thuật: [[Dunlosky_Learning_Techniques_Matrix]]
- [[Spaced_Repetition_SM2]]: Thuật toán tính chu kỳ ôn tập.
- [[Wozniak_20_Rules_of_Formulating_Knowledge]]: Quy tắc viết câu hỏi nguyên tử đúng chuẩn.
- [[Flashcard_Formulation_Cognitive_Load]]: Vì sao thẻ viết tồi làm phiên học sụp đổ.
- [[Ultralearning_Framework]]: Khung dự án tự học áp dụng các nguyên tắc này.
