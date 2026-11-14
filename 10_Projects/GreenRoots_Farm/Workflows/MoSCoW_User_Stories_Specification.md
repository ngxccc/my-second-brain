---
tags: [type/project, status/active]
date: 2026-11-13
description: "Đặc tả chi tiết 35 User Stories phân loại theo ma trận MoSCoW cho hệ thống GreenRoots Farm."
---

# MoSCoW User Stories Specification

## TL;DR

- **Bản chất**: Tài liệu đặc tả 35 User Stories chi tiết của dự án thương mại điện tử nông sản sạch GreenRoots Farm.
- **Mục đích**: Thiết lập chuẩn nghiệm thu chức năng theo mô hình Agile, đồng bộ trực tiếp với file bảng tính nghiệp vụ.
- **Điểm mấu chốt**: Phân bổ nghiêm ngặt 35 ca sử dụng qua 10 Epic và 6 vai trò, khóa chặt nhóm Must-have cho bài toán tươi sống.

---

## 1. Bảng Tổng Hợp Phân Bổ MoSCoW Theo Epic

Hệ thống bao gồm 35 User Stories được phân loại theo 4 cấp độ ưu tiên của ma trận MoSCoW:

|   STT    | Tên Epic                | Tổng số UC | Must-Have | Should-Have | Could-Have | Won't-Have |
| :------: | :---------------------- | :--------: | :-------: | :---------: | :--------: | :--------: |
|    1     | Access Control          |     5      |     4     |      1      |     0      |     0      |
|    2     | Storefront Catalog      |     4      |     4     |      0      |     0      |     0      |
|    3     | Subscription Management |     4      |     0     |      3      |     1      |     0      |
|    4     | Product Traceability    |     3      |     3     |      0      |     0      |     0      |
|    5     | Farm Operations         |     5      |     5     |      0      |     0      |     0      |
|    6     | Order Fulfillment       |     3      |     3     |      0      |     0      |     0      |
|    7     | Customer Complaints     |     2      |     0     |      2      |     0      |     0      |
|    8     | Waste Management        |     3      |     2     |      0      |     1      |     0      |
|    9     | Business Analytics      |     4      |     0     |      4      |     0      |     0      |
|    10    | Out of Scope            |     2      |     0     |      0      |     0      |     2      |
| **Tổng** | **10 Epics**            |   **35**   |  **21**   |   **10**    |   **2**    |   **2**    |

---

## 2. Danh Sách Chi Tiết 35 User Stories (Chuẩn Agile Narrative)

Bảng dữ liệu đồng bộ nguyên mẫu với file bảng tính tại `/home/ngxc/Downloads/greenroots-farm-user-story.xlsx`:

| UC  | Priority | Epic                    | As a(n)            | I want to                                                                           | So that                                                                                  | MoSCoW |
| :-: | :------: | :---------------------- | :----------------- | :---------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :----: |
|  1  |   High   | Access Control          | Guest              | Đăng ký tài khoản khách hàng bằng email và số điện thoại                            | Có thể đăng nhập, đặt hàng và theo dõi tiến trình giao nông sản                          |  Must  |
|  2  |   High   | Access Control          | User               | Đăng nhập vào hệ thống bằng thông tin xác thực an toàn                              | Được phân quyền truy cập đúng vai trò (Khách, Farm Staff, Sales, Admin, SuperAdmin)      |  Must  |
|  3  |   High   | Access Control          | User               | Đăng xuất khỏi hệ thống và vô hiệu hóa JWT token                                    | Bảo vệ an toàn tài khoản và ngăn chặn việc tái sử dụng phiên làm việc                    |  Must  |
|  4  |   Med    | Access Control          | User               | Khôi phục mật khẩu thông qua email xác thực                                         | Có thể lấy lại quyền truy cập tài khoản khi lỡ quên mật khẩu                             | Should |
|  5  |   High   | Access Control          | SuperAdmin         | Khởi tạo, phân quyền và khóa/mở khóa tài khoản nhân sự nội bộ (Admin, Sales, Staff) | Kiểm soát an toàn quyền truy cập, thực thi nguyên tắc phân lập trách nhiệm (SoD)         |  Must  |
|  6  |   High   | Storefront Catalog      | Guest              | Xem danh mục nông sản tươi và lọc theo chứng nhận (VietGAP/USDA), mức giá           | Tìm kiếm và lựa chọn đúng loại nông sản sạch theo nhu cầu                                |  Must  |
|  7  |   High   | Storefront Catalog      | Customer           | Xem chi tiết sản phẩm gồm giá bán, đơn vị tính, mô tả nguồn gốc mùa vụ              | Hiểu rõ chất lượng và độ an toàn của nông sản trước khi quyết định mua                   |  Must  |
|  8  |   High   | Storefront Catalog      | Customer           | Thêm sản phẩm vào giỏ hàng với kiểm tra tồn kho tổng thời gian thực                 | Đảm bảo không đặt vượt quá khối lượng nông sản thực tế có thể cung ứng                   |  Must  |
|  9  |   High   | Storefront Catalog      | Customer           | Tiến hành đặt hàng và chọn hình thức thanh toán COD hoặc chuyển khoản PayOS         | Chủ động thanh toán linh hoạt qua mã QR ngân hàng hoặc trả tiền mặt khi nhận             |  Must  |
| 10  |   High   | Subscription Management | Customer           | Đăng ký gói combo rau củ định kỳ giao vào Thứ 3 hoặc Thứ 6 hàng tuần                | Nhận nguồn thực phẩm tươi sống ổn định mà không cần tốn công đặt hàng mỗi ngày           | Should |
| 11  |   High   | Subscription Management | Customer           | Thanh toán trả trước gói định kỳ theo tháng hoặc theo quý                           | Nhận mức giá ưu đãi và miễn phí vận chuyển trên tuyến đường gom                          | Should |
| 12  |   Med    | Subscription Management | System Scheduler   | Tự động sinh đơn hàng định kỳ vào 04:00 sáng ngày giao T3, T6                       | Bộ phận nông trại thu hoạch đúng sản lượng và điều phối giao hàng đúng hẹn               | Should |
| 13  |   Low    | Subscription Management | Customer           | Tạm dừng hoặc hủy gói định kỳ khi có việc bận hoặc đi công tác                      | Chủ động kiểm soát lịch giao nhận thực phẩm của gia đình                                 | Could  |
| 14  |   High   | Product Traceability    | Customer           | Quét mã QR dán trên bao bì sản phẩm bằng camera điện thoại                          | Mở trực tiếp trang web tra cứu thông tin Lô hàng, ngày thu hoạch, HSD và kỹ sư phụ trách |  Must  |
| 15  |   High   | Product Traceability    | Customer           | Xem dòng thời gian nhật ký canh tác kèm ảnh thực tế tại vườn                        | Chứng thực quy trình trồng trọt minh bạch, không sử dụng hóa chất độc hại                |  Must  |
| 16  |   Med    | Product Traceability    | Customer           | Tra cứu chứng chỉ kiểm nghiệm đất, nước và tiêu chuẩn VietGAP/USDA                  | Có cơ sở pháp lý đối soát độc lập với cơ quan chức năng thay vì tin lời quảng cáo        |  Must  |
| 17  |   High   | Farm Operations         | Farm Staff         | Thiết lập và quản lý các mùa vụ canh tác gắn liền với mã lô đất (Plot ID)           | Phân vùng quy hoạch đất trồng và theo dõi vòng đời sinh trưởng của cây trồng             |  Must  |
| 18  |   High   | Farm Operations         | Farm Staff         | Cập nhật nhật ký canh tác (gieo hạt, tưới nước, bón phân, thu hoạch) kèm ảnh        | Lưu vết bất biến (Append-only) toàn bộ quy trình chăm sóc ngoài đồng ruộng               |  Must  |
| 19  |   High   | Farm Operations         | Farm Staff         | Khởi tạo Lô thu hoạch (Batch) với số lượng ban đầu và hạn sử dụng                   | Nhập nông sản mới thu hoạch vào kho để chuẩn bị xuất bán                                 |  Must  |
| 20  |   High   | Farm Operations         | Farm Staff         | Kết xuất và in tem nhãn chứa mã QR định danh duy nhất cho từng Lô nông sản          | Định danh Lô hàng phục vụ dán tem truy xuất nguồn gốc trước khi giao hàng                |  Must  |
| 21  |   High   | Farm Operations         | SuperAdmin         | Cấu hình thông tin nông trại, biểu phí vận chuyển km và bật/tắt cổng PayOS          | Chủ động điều phối chính sách giao nhận và bảo vệ tài khoản nhận tiền của nông trại      |  Must  |
| 22  |   High   | Order Fulfillment       | Sales              | Xem danh sách đơn hàng mới và kiểm tra trạng thái thanh toán                        | Tiếp nhận đơn và điều phối shipper giao hàng hỏa tốc nội thành                           |  Must  |
| 23  |   High   | Order Fulfillment       | Sales / System     | Tự động phân bổ và trừ kho theo nguyên tắc FEFO (HSD gần nhất xuất trước)           | Ngăn chặn tình trạng tồn kho cũ, giảm tỷ lệ hư hỏng và đảm bảo độ tươi ngon              |  Must  |
| 24  |   High   | Order Fulfillment       | Sales              | Xem danh sách nhặt hàng chi tiết (Pick List) từ bảng batch_allocations              | Nhặt đúng nông sản từ các kệ hàng hoặc thùng chứa của từng Lô chỉ định                   |  Must  |
| 25  |   Med    | Customer Complaints     | Customer           | Gửi khiếu nại bồi hoàn trong vòng 24h (1-5 ảnh bắt buộc, tối đa 1 video)            | Được bảo vệ quyền lợi khi nông sản tươi sống bị hư hỏng trong quá trình vận chuyển       | Should |
| 26  |   Med    | Customer Complaints     | Sales / Admin      | Kiểm duyệt ảnh khiếu nại và duyệt hoàn tiền hoặc tạo đơn giao bù                    | Xử lý đền bù thỏa đáng và duy trì niềm tin của khách hàng đối với nông trại              | Should |
| 27  |   High   | Waste Management        | Farm Staff / Sales | Tạo phiếu đề xuất xuất hủy nông sản bị dập nát kèm số kg và ảnh chụp                | Báo cáo số lượng nông sản hư hao cần loại bỏ khỏi kho                                    |  Must  |
| 28  |   High   | Waste Management        | Admin              | Phê duyệt hoặc từ chối phiếu xuất hủy để chính thức trừ tồn kho thực tế             | Kiểm soát thất thoát nội bộ, chống gian lận và tuồn hàng ra ngoài                        |  Must  |
| 29  |   Low    | Waste Management        | Admin / System     | Nhận cảnh báo các Lô hàng có HSD dưới 48 giờ và kích hoạt Flash Sale                | Xả hàng giảm giá 50% ở mục 'Giải cứu nông sản' để cắt giảm tỷ lệ xuất hủy                | Could  |
| 30  |   Med    | Business Analytics      | Admin              | Xem báo cáo tổng doanh thu và số lượng đơn hàng theo ngày, tuần, tháng              | Nắm bắt tình hình kinh doanh và điều chỉnh kế hoạch bán lẻ                               | Should |
| 31  |   Med    | Business Analytics      | Admin              | Xem thống kê khối lượng nông sản xuất hủy và tỷ lệ hao hụt sau thu hoạch            | Tối ưu hóa quy trình bảo quản lạnh và điều chỉnh sản lượng thu hoạch                     | Should |
| 32  |   Med    | Business Analytics      | Admin              | Xem danh sách top các mặt hàng nông sản tiêu thụ tốt nhất                           | Lên kế hoạch luân canh và gieo trồng các giống cây được ưa chuộng                        | Should |
| 33  |   Med    | Business Analytics      | SuperAdmin         | Xem báo cáo dòng tiền ngân hàng, doanh thu thực nhận và phân tích lợi nhuận         | Nắm bắt chính xác hiệu quả tài chính thực tế mà không để lộ biên lợi nhuận cho nhân sự   | Should |
| 34  |   Low    | Out of Scope            | User               | Sử dụng ứng dụng di động gốc (Mobile App iOS/Android)                               | Loại bỏ để tập trung toàn lực vào Web Mobile-first trong deadline 3 tuần                 | Won't  |
| 35  |   Low    | Out of Scope            | Third-party Farm   | Đăng ký mở gian hàng bán nông sản của nông trại khác (Multi-vendor)                 | Loại bỏ để giữ vững bản chất hệ sinh thái khép kín cho 1 Nông trại (Single Farm)         | Won't  |

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Báo cáo hoàn chỉnh Chương 1: [[Chapter_01_Project_Initiation_Report]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Xử lý trường hợp biên: [[Operations_and_Edge_Cases_RFC]]
- Lộ trình khởi tạo dự án: [[Project_Initiation_and_Execution_Roadmap]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
