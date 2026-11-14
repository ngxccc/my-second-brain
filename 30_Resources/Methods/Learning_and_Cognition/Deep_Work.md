---
tags: [type/method, status/permanent]
date: 2026-11-02
description: "Quy trình vận hành khối tập trung sâu: chốt trước việc cần làm, cắt chi phí chuyển ngữ cảnh, và nghiệm thu bằng artifact thay vì số giờ ngồi."
---

# Deep Work

## TL;DR

- **Bản chất**: Một khối 90 phút chỉ giải một việc đã định trước, lấy chi phí chuyển ngữ cảnh làm đơn vị đo thay vì cảm giác bận.
- **Mục đích**: Đổi thời gian ngồi lấy sản phẩm: mỗi khối phải kết thúc bằng một commit, một câu trả lời, hoặc một quyết định kiểm chứng được.
- **Điểm mấu chốt**: Thứ phá khối không phải điện thoại mà là quyết định giữa khối; chốt việc từ tối hôm trước rẻ hơn mọi kỹ thuật ý chí.

---

## Context: When to use?

- **Dùng khi:** việc cần suy luận liên tục — viết code khó, debug, đọc source lạ, thiết kế hệ thống.
- **Không dùng khi:** việc cơ học chia nhỏ được (sửa test, đổi tên, dọn import); chen vào khối sâu chỉ làm tăng số lần chuyển ngữ cảnh.
- **Tiền đề:** đã ngủ đủ. Thiếu ngủ làm hỏng đúng chức năng mà khối này cần, xem [[Sleep_Optimization_Protocol]].

## Step-by-Step

1. **Chốt việc từ tối hôm trước.** Ghi đúng một câu hành động cụ thể: "thêm retry với exponential backoff cho API client", không phải "làm backend". Quyết định _làm gì_ tiêu cùng ngân sách với _làm_.
2. **Cắt chi phí chuyển ngữ cảnh trước khi ngồi.** Điện thoại ra khỏi phòng, không chỉ úp xuống bàn. Tắt notification ở tầng OS. Đóng tab chat.
3. **Chạy khối 90 phút, một việc.** Hai khối/ngày là mức tốt, bốn là mức xuất sắc. Mở việc thứ hai là kết thúc khối thứ nhất.
4. **Chấp nhận thuế 15 phút đầu.** Cảm giác khó chịu ở phút 10-15 là chi phí vào cửa, không phải tín hiệu đổi việc.
5. **Nghỉ thật giữa các khối.** Mười phút: đứng dậy, đi bộ, nhìn xa. Lướt điện thoại không phải nghỉ — nó nạp thêm tải và phá khối sau.
6. **Đóng ngày bằng shutdown ritual.** Hai dòng: đang dừng ở đâu, việc tiếp theo là gì. Rồi đóng hết, để việc chưa xong không chạy nền trong đầu.

## Tiêu chí: deep work thật hay tiêu thụ

Ba câu hỏi, sai câu nào cũng không tính là deep work:

1. **Có artifact kiểm chứng được không?** Commit, test xanh, đoạn note có kết luận, hoặc một quyết định đã chốt.
2. **Có ra quyết định mà trước đó mày chưa biết đáp án không?** Làm đúng theo tutorial là thực thi, không phải suy luận.
3. **Bỏ hết input đi thì còn lại gì?** Nếu chỉ còn cảm giác "đã hiểu" thì không còn gì.

| Hoạt động                                     | Phân loại         | Lý do                                                               |
| --------------------------------------------- | ----------------- | ------------------------------------------------------------------- |
| Xem video, đọc blog, đọc lý thuyết            | Tiêu thụ          | Không có nhánh quyết định, không có artifact                        |
| Code-along tutorial                           | Tiêu thụ trá hình | Gõ đúng lệnh có sẵn, không tự chọn cách làm                         |
| Đọc docs để trả lời một câu hỏi rồi implement | Deep work         | Có câu hỏi cụ thể, kết thúc bằng code                               |
| Đọc source lạ để tìm bug                      | Deep work         | Phải đặt giả thuyết và loại trừ                                     |
| Refactor khi test đã xanh                     | Deep work         | Có ràng buộc thiết kế, có đánh đổi                                  |
| Đổi tên, format, sửa import                   | Cơ học            | Không cần suy luận liên tục, chen vào khối chỉ tăng chuyển ngữ cảnh |
| Vẽ diagram để hiểu luồng hệ thống             | Deep work         | Artifact là mô hình, không phải cảm giác                            |
| Ghi note không kèm câu hỏi                    | Tiêu thụ          | Chép lại nguồn, không nén thành kết luận                            |
| Nghe podcast kỹ thuật                         | Tiêu thụ          | Không sai, nhưng không đếm vào chỉ tiêu                             |

Ba dạng deep work giả dễ mắc nhất:

- **Nghiên cứu mở 20 tab:** cảm giác tiến bộ rõ, nhưng không có quyết định nào được chốt.
- **Refactor vô hạn:** dọn dẹp là cách né phần khó mà vẫn thấy mình đang làm việc.
- **Đọc thêm để chuẩn bị:** trì hoãn có học thức; đến lúc viết code thì đã hết khối.

Tỷ lệ thực dụng: mỗi giờ input trả bằng ít nhất một giờ output. Input chiếm quá nửa thời gian học là dấu hiệu trì hoãn, không phải dấu hiệu chăm.

## Âm thanh và môi trường

| Việc                                  | Âm thanh                                   |
| ------------------------------------- | ------------------------------------------ |
| Suy luận, debug, đọc docs, viết logic | Im lặng; nếu phòng ồn thì pink/brown noise |
| Code cơ học, refactor, chạy test      | Nhạc quen bất kỳ                           |
| Có tiếng người nói ngắt quãng         | Noise ổn định đủ che, không phải nhạc      |

- Nhạc có lời chiếm kênh ngôn ngữ — đúng thứ dùng để đặt tên biến, đọc docs, suy luận bằng chữ.
- Cấm YouTube có hình và autoplay: chi phí thật nằm ở việc chọn nhạc, không ở âm thanh.
- Cơ chế và bằng chứng từng loại noise, 40Hz gamma, và khi nào im lặng mới là tốt nhất: [[Auditory_Environment_and_Cognition]].

## Kiểm tra sau 2 tuần

- [ ] Mỗi ngày có ít nhất 2 khối 90 phút, mỗi khối đúng một việc đã chốt từ hôm trước.
- [ ] Không mở điện thoại trong khối (tự khai, log thật, không ước lượng).
- [ ] Mỗi khối kết thúc bằng artifact hoặc quyết định, không kết thúc bằng "đang tìm hiểu".
- [ ] Chạy thí nghiệm âm thanh theo thiết kế trong [[Auditory_Environment_and_Cognition]].

## Related Notes

- Cơ chế nền: [[Attention_Residue]] — vì sao một lần check 10 giây tốn 15 phút.
- Nền tảng về giấc ngủ: [[Sleep_Optimization_Protocol]]
- Nguyên tắc Focus trong framework lớn hơn: [[Ultralearning_Framework]]
- Bộ lọc nội dung ngắn hằng ngày: [[Student_Daily_Practice_Protocol]]
- Kiểm soát tải nhận thức: [[Cognitive_Load_Theory]]
- Chọn âm thanh nền: [[Auditory_Environment_and_Cognition]]
