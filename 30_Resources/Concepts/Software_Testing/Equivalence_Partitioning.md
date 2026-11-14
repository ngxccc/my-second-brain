---
tags: [type/concept, status/permanent]
date: 2026-07-20
description: "Kỹ thuật phân hoạch tương đương chia miền dữ liệu thành các tập rời nhau để tối ưu số lượng test case."
---

# Kỹ thuật Phân hoạch Tương đương

## TL;DR

- **Bản chất**: Chia miền đầu vào hoặc đầu ra thành các phân vùng rời nhau, mỗi phân vùng chỉ cần một test case đại diện.
- **Mục đích**: Cắt số test case từ vô hạn xuống bằng số phân vùng, dựa trên giả định mọi giá trị trong một phân vùng được xử lý như nhau.
- **Điểm mấu chốt**: Giả định đó chỉ đúng khi miền được chia đúng; thiếu một phân vùng nghĩa là cả một lớp hành vi không có test nào chạm tới.

---

## Core Concept

### 1. Đặt vấn đề & Bản chất Kỹ thuật

Khi thiết kế test case, việc thử nghiệm tất cả các giá trị đầu vào (Exhaustive Testing) là điều **bất khả thi** (Nguyên lý kiểm thử số 2 trong [[7_Principles_of_Testing]]). Nếu một ô nhập liệu nhận số nguyên từ 1 đến 10.000, việc tạo 10.000 test case là vô nghĩa và lãng phí tài nguyên.

Phân hoạch tương đương giải quyết bài toán bùng nổ test case (Combinatorial Explosion) bằng tư duy toán học:

- **Tập hợp đầu vào $S$** được chia thành $n$ tập hợp con (phân vùng) rời nhau $S_1, S_2, ..., S_n$ sao cho:
  $$\bigcup_{i=1}^{n} S_i = S \quad \text{và} \quad S_i \cap S_j = \emptyset \; (\forall i \neq j)$$
- **Tính tương đương hành vi (Equivalent Behaviour):** Nếu một đại diện $x \in S_i$ kích hoạt lỗi (Defect), tất cả các phần tử còn lại trong $S_i$ cũng được kỳ vọng sẽ kích hoạt lỗi đó. Nối tiếp logic này, nếu $x \in S_i$ vượt qua bài kiểm tra (Pass), mọi phần tử khác trong $S_i$ cũng sẽ Pass.

### 2. Phân loại Phân vùng

Theo chuẩn ISTQB CTFL, phân hoạch tương đương áp dụng cho cả đầu vào (Inputs), đầu ra (Outputs), giá trị nội tại (Internal States), thời gian (Time-related values) và các tham số giao diện (Interface Parameters). Mỗi miền được chia làm 2 loại phân vùng:

1. **Phân vùng Hợp lệ (Valid Equivalence Partition):**
   - Chứa các giá trị thuộc phạm vi xử lý mong muốn của spec/requirement.
   - Hệ thống chấp nhận và thực thi logic thành công (Positive Testing).
2. **Phân vùng Không hợp lệ (Invalid Equivalence Partition):**
   - Chứa các giá trị nằm ngoài phạm vi xử lý của spec (sai kiểu dữ liệu, vượt hạn mức, sai định dạng).
   - Hệ thống từ chối hoặc xử lý ngoại lệ thành công (Negative Testing / Error Handling).

### 3. Quy tắc Thiết kế Test Case theo EP

Để áp dụng EP đạt hiệu quả tối đa, tester/engineer thực hiện theo 4 bước:

1. **Nhận diện miền dữ liệu (Identify Data Domain):** Xác định điều kiện đầu vào/đầu ra của đối tượng cần kiểm thử.
2. **Xác định các Phân vùng (Form Partitions):** Đảm bảo phủ hết các phân vùng hợp lệ và không hợp lệ (không để sót giá trị nào của miền $S$).
3. **Chọn Giá trị Đại diện (Select Representatives):** Chọn **đúng 1 giá trị bất kỳ** cho mỗi phân vùng (thường chọn giá trị giữa phân vùng - Mid-point).
4. **Tạo Test Case (Derive Test Cases):**
   - _Quy tắc cho Phân vùng Hợp lệ:_ Một test case có thể kết hợp nhiều phân vùng hợp lệ của các trường dữ liệu khác nhau để giảm số lượng test case.
   - _Quy tắc cho Phân vùng Không hợp lệ:_ **Mỗi phân vùng không hợp lệ MUST có một test case riêng biệt**. Không kết hợp nhiều phân vùng không hợp lệ trong một test case (tránh hiện tượng lỗi trường này che giấu lỗi trường khác - Masking Effect).

### 4. Ưu điểm & Hạn chế

- **Ưu điểm:**
  - Tối ưu hóa số lượng test case rõ rệt, giảm thời gian và chi phí kiểm thử.
  - Áp dụng linh hoạt ở mọi mức kiểm thử: Component Testing, Integration Testing, System Testing, Acceptance Testing.
- **Hạn chế:**
  - **Bỏ sót lỗi tại biên:** Nếu chỉ chọn giá trị giữa phân vùng (Mid-point), các lỗi lập trình phổ biến liên quan đến toán tử so sánh (`>`, `>=`, `<`, `<=`) tại biên ranh giới sẽ bị bỏ qua $\rightarrow$ **Bắt buộc kết hợp với Phân tích Giá trị Biên (Boundary Value Analysis)**.
  - Phụ thuộc vào chất lượng của tài liệu tả yêu cầu (Requirement Specification). Nếu phân vùng sai, test case đại diện sẽ không mang tính bao quát.

---

## Related Notes

- Chạy đủ 4 bước trên một form thật: [[Equivalence_Partitioning_Worked_Example]]
- [[Black_Box_Testing_Techniques]]: Tổng quan về các kỹ thuật kiểm thử hộp đen.
- [[Test_Case]]: Cấu trúc và phương pháp thiết kế một test case tiêu chuẩn.
- [[7_Principles_of_Testing]]: 7 nguyên lý kiểm thử phần mềm nền tảng (Nguyên lý #2: Kiểm thử kiệt xuất là bất khả thi).
- [[Error_Defect_Failure]]: Khái niệm lỗi nhầm lẫn, lỗi sai sót và sự cố phần mềm.
- [[000_Concepts_MOC]]
