---
tags: [type/project, status/active]
date: 2026-11-12
description: "Đặc tả chi tiết 6 vai trò, ma trận phân quyền RBAC và ranh giới bảo mật cho hệ thống GreenRoots Farm."
---

# Role Based Access Control Specification

## TL;DR

- **Bản chất**: Tài liệu phân ranh giới quyền hạn và bảo mật theo mô hình RBAC cho 6 nhóm tác nhân trong hệ thống.
- **Mục đích**: Triệt tiêu rủi ro gian lận thất thoát nội bộ và ngăn ngừa việc leo thang đặc quyền giữa các phòng ban.
- **Điểm mấu chốt**: Áp dụng Principle of Least Privilege và Separation of Duties để phân lập triệt để giữa Admin và SuperAdmin.

---

## 1. Cơ Chế Kiến Trúc RBAC và Nguyên Tắc Bảo Mật

Hệ thống GreenRoots Farm áp dụng kiến trúc phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) kết hợp cùng hai nguyên lý bảo mật phần mềm cốt lõi:

- **Principle of Least Privilege (PoLP)**: Mỗi tài khoản người dùng chỉ được cấp phát đúng những quyền tối thiểu cần thiết để hoàn thành nhiệm vụ được giao.
- **Separation of Duties (SoD)**: Tách rời quyền hạn giữa người tạo đề xuất và người phê duyệt (Maker-Checker Pattern) đối với các thao tác nhạy cảm liên quan đến tiền bạc và hao hụt kho hàng.

Cơ chế thực thi trên Backend NestJS:

```text
Incoming Request ──► JwtAuthGuard (Verify Token) ──► RolesGuard (Check Role) ──► Controller Endpoint
```

---

## 2. Đặc Tả Chi Tiết Quyền Hạn Của 6 Vai Trò

### 2.1. Guest (Khách vãng lai)

- **Định danh**: Người dùng chưa đăng nhập hoặc chưa đăng ký tài khoản.
- **Quyền hạn được phép**:
  - Xem danh mục sản phẩm, chi tiết sản phẩm, lọc theo chứng nhận VietGAP/USDA và mức giá.
  - Quét mã QR trên bao bì để mở trang tra cứu công khai thông tin Lô thu hoạch (`/trace/[batchCode]`).
  - Xem nhật ký canh tác công khai của mùa vụ tương ứng.
- **Giới hạn bảo mật**: Không thể lưu trữ giỏ hàng lâu dài, không thể checkout thanh toán, bị chặn toàn bộ API nội bộ.

### 2.2. Customer (Khách hàng thành viên)

- **Định danh**: Khách hàng đã đăng ký và xác thực tài khoản qua email/số điện thoại.
- **Quyền hạn được phép**:
  - Quản lý giỏ hàng cá nhân, tiến hành đặt hàng mua lẻ (COD hoặc chuyển khoản PayOS).
  - Đăng ký và quản lý gói rau định kỳ (Subscription) giao Thứ 3 hoặc Thứ 6.
  - Tích lũy 1% giá trị đơn hàng thành công làm điểm thưởng (`reward_points`) và khấu trừ vào lần mua sau.
  - Gửi khiếu nại yêu cầu bồi hoàn rau dập nát trong vòng 24 giờ sau khi nhận hàng (bắt buộc 1–5 ảnh chụp, tùy chọn tối đa 1 video <= 15s).
- **Giới hạn bảo mật**: Không được phép xem số lượng tồn kho theo từng Lô chi tiết, không xem báo cáo tài chính.

### 2.3. Farm Staff (Kỹ sư canh tác nông trại)

- **Định danh**: Kỹ sư hoặc nhân viên lao động phụ trách trực tiếp ngoài đồng ruộng.
- **Quyền hạn được phép**:
  - Quản lý mùa vụ canh tác và thông tin lô đất (Plot ID).
  - Ghi chép nhật ký canh tác (gieo hạt, tưới tiêu, bón phân, thu hoạch) theo cơ chế **Append-only log** (chỉ INSERT, không UPDATE/DELETE).
  - Khởi tạo Lô thu hoạch (Batch) với số lượng ban đầu và hạn sử dụng.
  - Kết xuất và in tem mã QR định danh duy nhất cho từng Lô nông sản.
  - Lập phiếu đề xuất xuất hủy nông sản hư hao ngoài ruộng (`waste_logs` ở trạng thái `PENDING_APPROVAL`).
- **Giới hạn bảo mật**: Không có quyền xem danh sách đơn hàng, không xem doanh thu, không được tự ý duyệt phiếu xuất hủy trừ kho.

### 2.4. Sales (Nhân viên kinh doanh & Điều phối)

- **Định danh**: Nhân viên phụ trách xử lý đơn hàng và điều phối giao nhận.
- **Quyền hạn được phép**:
  - Tiếp nhận đơn hàng mới từ Storefront, kiểm tra thông tin và điều phối giao hàng hỏa tốc trong ngày.
  - Thực thi thuật toán xuất kho **FEFO**: Khi bấm "Xác nhận đơn", hệ thống tự động phân bổ và trừ kho ưu tiên từ các Lô có HSD gần nhất vào bảng `batch_allocations`.
  - Xem danh sách nhặt hàng chi tiết (Pick List) để đóng gói chính xác số lượng từ từng Lô.
  - Tiếp nhận hình ảnh khiếu nại báo rau hỏng từ khách hàng để sơ duyệt.
- **Giới hạn bảo mật**: Không được sửa đổi nhật ký canh tác của Farm Staff, không được xóa đơn hàng, không được tự ý thay đổi giá niêm yết sản phẩm.

### 2.5. Admin (Quản lý nông trại vận hành - Farm Operations Manager)

- **Định danh**: Người điều hành trực tiếp toàn bộ hoạt động hàng ngày tại nông trại.
- **Quyền hạn được phép**:
  - Phê duyệt chính thức phiếu xuất hủy hao hụt (`waste_logs`) từ Staff để hệ thống trừ tồn kho thực tế.
  - Kích hoạt chương trình xả hàng Flash Sale đối với các Lô hàng cận hạn sử dụng (< 48 giờ).
  - Phê duyệt giải quyết khiếu nại bồi hoàn cho khách (hoàn tiền hoặc tạo đơn giao bù).
  - Theo dõi báo cáo thống kê vận hành: Doanh thu chu kỳ, khối lượng xuất hủy và top sản phẩm tiêu thụ tốt nhất.
- **Ranh giới bảo mật nghiêm ngặt (Những gì Admin KHÔNG ĐƯỢC LÀM)**:
  - **Không có quyền thay đổi API Key / Cấu hình PayOS**: Tránh rủi ro quản trị viên đổi số tài khoản nhận tiền sang tài khoản cá nhân.
  - **Không được xem báo cáo lợi nhuận ròng (Net Profit) của chủ sở hữu**.
  - **Không có quyền tạo, xóa hoặc phân quyền tài khoản Admin khác**.

### 2.6. SuperAdmin (Chủ sở hữu nông trại / Root Admin)

- **Định danh**: Chủ nông trại (Owner / Founder) hoặc kỹ sư quản trị hệ thống tối cao.
- **Quyền hạn tối cao**:
  - Cấu hình thông tin công khai nông trại (`farms` settings: hotline, địa chỉ, tọa độ GPS, tài khoản ngân hàng công khai), tinh chỉnh tham số phí ship / Flash Sale động và bật/tắt kênh thanh toán (`is_payos_enabled`, `is_cod_enabled`). Các khóa bí mật API (PayOS, Cloudinary, Resend) được lưu cố định trong `.env` và chỉ hiển thị trạng thái kết nối đã che khóa.
  - Quản lý danh sách nhân sự nội bộ: Tạo tài khoản, phân quyền, thu hồi hoặc vô hiệu hóa tài khoản của Admin, Sales, Farm Staff.
  - Xem toàn bộ báo cáo tài chính nhạy cảm: Dòng tiền ròng, doanh thu thực nhận về tài khoản ngân hàng và phân tích chi phí toàn diện.

---

## 3. Ma Trận Phân Quyền Chi Tiết (RBAC Matrix)

Quy ước: `C` (Create), `R` (Read), `U` (Update), `D` (Delete), `X` (Execute), `-` (Không có quyền).

| Phân hệ chức năng                                      | Guest | Customer | Farm Staff | Sales | Admin | SuperAdmin |
| :----------------------------------------------------- | :---: | :------: | :--------: | :---: | :---: | :--------: |
| Xem danh mục sản phẩm & Trang tra cứu QR               |   R   |    R     |     R      |   R   |   R   |     R      |
| Quản lý giỏ hàng & Đặt hàng mua lẻ                     |   -   |   CRUD   |     -      |   -   |   -   |    CRUD    |
| Đăng ký & Quản lý gói rau định kỳ                      |   -   |   CRUD   |     -      |   -   |   -   |    CRUD    |
| Tích lũy & Sử dụng điểm thưởng                         |   -   |    RU    |     -      |   -   |   -   |    CRUD    |
| Gửi khiếu nại bồi hoàn rau hỏng                        |   -   |    CR    |     -      |   -   |   -   |    CRUD    |
| Quản lý Mùa vụ & Lô đất canh tác                       |   -   |    -     |    CRUD    |   -   | CRUD  |    CRUD    |
| Cập nhật Nhật ký canh tác (Append-only)                |   -   |    -     |     CR     |   -   |  CR   |    CRUD    |
| Khởi tạo Lô thu hoạch (Batch) & In mã QR               |   -   |    -     |     CR     |   -   | CRUD  |    CRUD    |
| Xác nhận đơn hàng & Chạy thuật toán FEFO               |   -   |    -     |     -      |   X   |   X   |     X      |
| Xem danh sách nhặt hàng (Pick List)                    |   -   |    -     |     -      |   R   |   R   |     R      |
| Lập phiếu đề xuất xuất hủy hàng hỏng                   |   -   |    -     |     CR     |  CR   | CRUD  |    CRUD    |
| Phê duyệt phiếu xuất hủy trừ tồn kho                   |   -   |    -     |     -      |   -   |   X   |     X      |
| Kích hoạt Flash Sale lô cận hạn                        |   -   |    -     |     -      |   -   |   X   |     X      |
| Xử lý duyệt khiếu nại khách hàng                       |   -   |    -     |     -      |   R   |   X   |     X      |
| Báo cáo Doanh thu & Thống kê vận hành                  |   -   |    -     |     -      |   -   |   R   |    CRUD    |
| Báo cáo Lợi nhuận ròng & Dòng tiền ngân hàng           |   -   |    -     |     -      |   -   |   -   |    CRUD    |
| Cấu hình Nông trại, Tham số vận hành & Kênh thanh toán |   -   |    -     |     -      |   -   |   -   |    CRUD    |
| Quản trị Tài khoản & Phân quyền User                   |   -   |    -     |     -      |   -   |   -   |    CRUD    |

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Sơ đồ ERD và Dữ liệu CSDL: [[Database_ERD_and_Data_Dictionary]]
- Đặc tả User Stories MoSCoW: [[MoSCoW_User_Stories_Specification]]
- Xử lý trường hợp biên: [[Operations_and_Edge_Cases_RFC]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
