# Tài liệu học tập & Ôn thi môn Kiểm thử phần mềm (Software Testing)

Tài liệu thô được lưu trữ tạm thời tại Inbox để người dùng bóc tách thành các ghi chú nguyên tử (Atomic Notes). Cấu trúc tài liệu được tổng hợp từ khung đào tạo đại học và chuẩn công nghiệp ISTQB.

---

## 1. Khung lý thuyết cốt lõi (Core Theoretical Syllabus)

### A. Các cấp độ kiểm thử (Testing Levels)

- **Unit Testing (Kiểm thử đơn vị):** Kiểm thử các hàm, phương thức hoặc lớp riêng lẻ để đảm bảo logic chạy đúng độc lập. Thường do Developer thực hiện song song với viết code.
- **Integration Testing (Kiểm thử tích hợp):** Kiểm thử sự tương tác và truyền dữ liệu qua lại giữa các module/thành phần khác nhau của hệ thống.
- **System Testing (Kiểm thử hệ thống):** Kiểm thử toàn bộ hệ thống phần mềm đã được tích hợp đầy đủ nhằm đánh giá xem hệ thống có đáp ứng các yêu cầu đặc tả (Requirement Specs) ban đầu hay không.
- **Acceptance Testing (Kiểm thử chấp nhận):** Do khách hàng hoặc người dùng cuối thực hiện để nghiệm thu sản phẩm trước khi bàn giao (gồm Alpha Testing và Beta Testing).

### B. Các loại kiểm thử (Testing Types)

- **Functional Testing (Kiểm thử chức năng):** Xác thực xem phần mềm có thực hiện đúng các chức năng theo tài liệu đặc tả hay không (Đầu vào đúng -> Đầu ra đúng).
- **Non-functional Testing (Kiểm thử phi chức năng):** Kiểm tra hiệu năng (Performance), khả năng chịu tải (Stress/Load), độ bảo mật (Security), độ ổn định (Reliability), và trải nghiệm người dùng (Usability).

### C. Kỹ thuật thiết kế Test Case (Test Design Techniques)

1. **Kiểm thử hộp đen (Black-box Testing):** Thiết kế test case dựa trên yêu cầu hệ thống mà không cần biết cấu trúc mã nguồn bên trong.
   - **Phân vùng tương đương (Equivalence Partitioning):** Chia tập dữ liệu đầu vào thành các phân vùng (hợp lệ và không hợp lệ), chọn đại diện của mỗi phân vùng để test.
   - **Phân tích giá trị biên (Boundary Value Analysis):** Tập trung vào việc test các giá trị ở ranh giới của phân vùng (giá trị biên, sát biên).
   - **Bảng quyết định (Decision Table):** Sử dụng bảng logic để liệt kê tất cả các sự kết hợp của các điều kiện đầu vào và hành động tương ứng.
2. **Kiểm thử hộp trắng (White-box Testing):** Thiết kế test case dựa trên việc phân tích cấu trúc code bên trong.
   - **Độ phủ dòng lệnh (Statement Coverage):** Tỷ lệ phần trăm các dòng lệnh trong mã nguồn được thực thi bởi các test case.
   - **Độ phủ nhánh (Branch/Decision Coverage):** Tỷ lệ phần trăm các nhánh rẽ nhánh (ví dụ: điều kiện Đúng/Sai của câu lệnh `if/else`) được thực thi bởi các test case.

---

## 2. Đề cương chuẩn công nghiệp (ISTQB Foundation Level - CTFL)

Chứng chỉ quốc tế của **ISTQB** (Certified Tester Foundation Level) là bộ khung chuẩn hóa được các trường đại học lớn áp dụng làm tài liệu tham khảo chính. Cấu trúc học tập gồm 6 chương:

- **Chương 1: Các nguyên lý cơ bản của kiểm thử (Fundamentals of Testing)**
  - Định nghĩa kiểm thử, sự khác biệt giữa Lỗi (Defect), Sai sót (Error), và Sự cố (Failure).
  - 7 nguyên lý kiểm thử phần mềm (Ví dụ: Kiểm thử sớm, kiểm thử không bao giờ hết lỗi, nghịch lý thuốc trừ sâu...).
- **Chương 2: Kiểm thử trong vòng đời phát triển phần mềm (SDLC)**
  - Kiểm thử trong các mô hình: Waterfall, V-Model, Agile (Scrum), DevOps.
  - Kiểm thử tĩnh (Static testing) vs Kiểm thử động (Dynamic testing).
- **Chương 3: Kiểm thử tĩnh (Static Testing)**
  - Quy trình review tài liệu, thiết kế, code (Walkthrough, Inspection, Technical Review).
- **Chương 4: Kỹ thuật kiểm thử (Test Techniques)**
  - Học sâu về cách thiết kế test case hộp đen, hộp trắng và kỹ thuật dựa trên kinh nghiệm (Error guessing, Exploratory testing).
- **Chương 5: Quản lý kiểm thử (Test Management)**
  - Viết Test Plan (Kế hoạch test), phân tích rủi ro, quản lý lỗi (Bug/Defect Life Cycle).
- **Chương 6: Công cụ hỗ trợ kiểm thử (Tool Support for Testing)**
  - Cách chọn lựa công cụ, rủi ro và cơ hội khi áp dụng automation test vào dự án.

---

## 3. Bộ công cụ kiểm thử phổ biến (Manual vs Automation Tools)

| Nhóm chức năng          | Công cụ phổ biến                          | Ứng dụng thực tế                                                               |
| :---------------------- | :---------------------------------------- | :----------------------------------------------------------------------------- |
| **Quản lý Test & Bug**  | Jira, Trello, Redmine                     | Quản lý dự án Agile, log lỗi và theo dõi trạng thái lỗi.                       |
| **Unit Testing**        | JUnit (Java), Jest (JS/TS), PHPUnit (PHP) | Viết các script tự động hóa kiểm tra logic hàm/class.                          |
| **API Testing**         | Postman, SoapUI                           | Gửi các request HTTP để test API Backend không qua giao diện UI.               |
| **UI Automation (Web)** | Selenium WebDriver, Cypress, Playwright   | Viết script tự động mở trình duyệt, click chuột, nhập form giả lập người dùng. |
| **Performance Testing** | Apache JMeter                             | Giả lập lượng lớn người dùng ảo truy cập hệ thống để đo khả năng chịu tải.     |

---

## 4. Tài liệu học tập & Nguồn tham khảo chính thống

### 📚 Sách Giáo trình đề xuất

1. **The Art of Software Testing** – _Glenford J. Myers_: Sách nền tảng cực tốt về tư duy và chiến lược kiểm thử.
2. **Foundations of Software Testing: ISTQB Certification** – _Rex Black & Dorothy Graham_: Sách chuẩn hóa giúp vượt qua kỳ thi ISTQB CTFL.
3. **Introduction to Software Testing** – _Paul Ammann & Jeff Offutt_: Giáo trình kỹ thuật chuyên sâu về đồ thị luồng điều khiển và toán học trong kiểm thử.

### 🌐 Nguồn trực tuyến miễn phí

- **Vietnamese Testing Board (VTB):** [vietnamesetestingboard.org](https://vietnamesetestingboard.org/) - Tải tài liệu ISTQB CTFL Syllabus (bản tiếng Việt/tiếng Anh chính thức).
- **Cộng đồng Testing VN:** [testing.vn](https://testing.vn/) - Diễn đàn trao đổi kinh nghiệm, giải đề thi, chia sẻ slide và bài tập lớn.
- **Guru99 Software Testing:** [guru99.com/software-testing.html](https://www.guru99.com/software-testing.html) - Trang web học thực hành tốt nhất cho người mới bắt đầu.
