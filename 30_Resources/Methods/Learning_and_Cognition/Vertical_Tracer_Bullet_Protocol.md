---
tags: [type/method, status/permanent]
date: 2026-10-31
description: "Quy trình 3 bước Lát cắt xuyên tâm: neo một luồng nghiệp vụ, đào sâu cơ chế tại điểm chạm, rồi phản biện kiến trúc và đánh giá đánh đổi."
---

# Vertical Tracer Bullet Protocol

## TL;DR

- **Bản chất**: Một vòng lặp học từ codebase thật: mỗi lần đi hết một luồng nghiệp vụ là một lần bóc xong một tầng cơ chế hạ tầng.
- **Mục đích**: Đọc mã nguồn theo lát cắt xuyên tâm thay vì quét dàn trải theo thư mục từ A đến Z.
- **Điểm mấu chốt**: Mỗi điểm chạm hạ tầng (ví dụ `db.transaction()`) là một cửa sổ để bóc tách MVCC, row lock, WAL — đào sâu ở đúng đó thay vì học thuộc tài liệu.

## Context: When to use?

- **Dùng khi:** đang làm chủ một codebase dự án thật và cần lên trình từ mức "tính năng chạy được" lên mức chẩn đoán được sự cố hạ tầng.
- **Điều kiện tiên quyết:** có quyền chạy ứng dụng, đọc mã nguồn, và có ít nhất một luồng nghiệp vụ đại diện chạy được end-to-end.
- **Không dùng khi:** đang học công nghệ mới chưa có dự án dùng nó — khi đó cần một dự án nhỏ làm mỏ neo trước, theo [[Project_Anchored_Technical_Mastery]].

## Step-by-Step Guideline

```
[Bước 1: Neo đề bài]           --> Chọn 1 luồng nghiệp vụ duy nhất trong mã nguồn
                                      |
                                      v
[Bước 2: Đào sâu cơ chế]       --> Bóc tách cơ chế kỹ thuật tại đúng điểm chạm
                                      |
                                      v
[Bước 3: Phản biện đánh đổi]  --> Đặt câu hỏi tại sao và so sánh giải pháp thay thế
```

### Bước 1: Neo đề bài từ một luồng nghiệp vụ cụ thể

- Chọn một lát cắt nghiệp vụ đại diện trong dự án (ví dụ: luồng cập nhật đơn giá thỏa thuận của dòng máy công nghiệp).
- Xác định điểm bắt đầu của dữ liệu (yêu cầu mạng) và điểm kết thúc (trạng thái lưu trữ trong cơ sở dữ liệu).

### Bước 2: Đào sâu cơ chế bên dưới tại điểm chạm

Khi mã nguồn gọi một hàm hạ tầng (ví dụ `db.transaction()`), dừng lại và bóc tách nguyên lý vận hành:

- Ở mức cô lập mặc định `READ COMMITTED`, cơ chế Multi-Version Concurrency Control (MVCC) xử lý phiên bản dòng qua `xmin`, `xmax` ra sao?
- Khi hai tiến trình cùng cập nhật một dòng, cơ chế khóa hàng của cơ sở dữ liệu phản ứng thế nào?
- Dữ liệu được ghi vào Shared Buffer Pool, chuyển qua WAL Buffer và xả xuống đĩa vào thời điểm nào?

### Bước 3: Phản biện kiến trúc và đánh giá sự đánh đổi

- Đặt câu hỏi phản biện về ranh giới áp dụng của công nghệ: _tại sao cơ sở dữ liệu quan hệ hỗ trợ `SKIP LOCKED` tốt nhưng không thể thay thế hoàn toàn Message Broker chuyên dụng như Redis hay RabbitMQ?_
- **Bản chất kỹ thuật:** cơ sở dữ liệu quan hệ ghi dữ liệu lên các trang đĩa; khi tác vụ hoàn thành, thao tác cập nhật hoặc xóa tạo ra các dòng chết (Dead Tuples), gây phình bảng và tốn tài nguyên `autovacuum`. Redis lưu toàn bộ trên RAM với cấu trúc tối ưu cho việc đẩy/lấy phần tử $O(1)$ mà không tốn chi phí dọn dẹp đĩa.

## Verification / Testing

- [ ] Có ít nhất một luồng nghiệp vụ được lần theo end-to-end và ghi lại đường đi của dữ liệu.
- [ ] Mỗi điểm chạm hạ tầng đã có ít nhất một câu hỏi "cơ chế bên dưới chạy thế nào" được trả lời.
- [ ] Mỗi kết luận đánh đổi có nêu phương án thay thế và lý do không chọn nó.
- [ ] Phát hiện đã được ghi thành note nguyên tử, gắn với tệp mã nguồn làm bằng chứng.

## Related Notes

- Khung khái niệm và ma trận giao thoa nghiệp vụ - công nghệ: [[Project_Anchored_Technical_Mastery]]
- [[First_Principles_Thinking]]: Cách phân rã vấn đề về nguyên lý gốc trong bước 2.
- [[Socratic_Questioning_Method]]: Cách đặt câu hỏi phản biện trong bước 3.
- [[Metalearning_Just_In_Time_Framework]]: Học đúng thứ tự khi nào cần dùng đến.
