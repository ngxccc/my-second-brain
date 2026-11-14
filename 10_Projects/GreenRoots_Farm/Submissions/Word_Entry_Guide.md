---
tags: [type/submission, status/active]
date: 2026-11-14
description: "Tài liệu hướng dẫn chi tiết và tổng hợp biểu mẫu nội dung để Huỳnh Kim Anh nhập liệu trực tiếp vào file Word báo cáo đồ án."
---

# Hướng Dẫn Soạn Thảo Báo Cáo Cho Huỳnh Kim Anh

## TL;DR

- **Bản chất**: Cẩm nang biên soạn nội dung văn bản hoàn chỉnh phục vụ gỡ điểm Tuần 1 và hoàn tất phần việc Tuần 2 của Huỳnh Kim Anh.
- **Mục đích**: Cung cấp sẵn các đoạn văn và bảng biểu đạt chuẩn để sao chép thẳng vào báo cáo mà không cần viết lại từ đầu.
- **Điểm mấu chốt**: Đồng bộ hóa tuyệt đối giữa biểu chấm của giảng viên với phân quyền 6 vai trò và cấu trúc 18 bảng cơ sở dữ liệu.

---

## 1. Khắc Phục Lỗi Nhận Xét Tuần 1 Để Gỡ 0.5 Điểm

Nội dung dùng để chèn trực tiếp vào file `greenroots-farm-report-chapter-1.docx` nhằm khắc phục các điểm trừ trong phiếu đánh giá của Thầy Nguyễn Đức Duy.

### 1.1. Bổ sung Mục 1.6: Tổng Hợp Công Nghệ Sử Dụng (Gỡ 0.4 điểm)

Sao chép toàn bộ bảng dưới đây vào cuối Chương 1, ngay sau mục Kế hoạch quản trị rủi ro kỹ thuật:

| Thành phần kiến trúc        | Công nghệ lựa chọn              | Phiên bản / Chuẩn                 | Lý do lựa chọn và vai trò trong hệ thống                                                                                  |
| :-------------------------- | :------------------------------ | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **Frontend Storefront**     | Next.js, React, Tailwind CSS    | Next.js 16, React 19, Tailwind v4 | Xây dựng giao diện mua sắm khách hàng chuẩn Mobile-first; tối ưu hóa SEO và Server-Side Rendering cho trang tra cứu QR.   |
| **Frontend Backoffice**     | React, Vite SPA, TanStack Suite | React 19, TanStack Router/Table   | Dashboard điều hành nội bộ đa màn hình cho Farm Staff, Sales và Admin; tối ưu tốc độ render bảng dữ liệu lớn.             |
| **Backend REST API**        | NestJS Framework, TypeScript    | NestJS 12, TypeScript 5.8         | Kiến trúc Module hóa theo tiêu chuẩn doanh nghiệp; kiểm soát luồng dữ liệu chặt chẽ qua DTO, Guards và Interceptors.      |
| **Cơ sở dữ liệu**           | PostgreSQL                      | PostgreSQL 18                     | CSDL quan hệ hỗ trợ toàn vẹn ACID, khóa dòng `SELECT ... FOR UPDATE` chống bán âm kho và lưu trữ JSONB linh hoạt.         |
| **ORM & Schema Migration**  | Drizzle ORM                     | Drizzle 1.0, Drizzle Kit          | Quản lý schema bằng TypeScript (Type-safe), thực thi migration tự động và kiểm soát tính nhất quán của 18 bảng.           |
| **Caching & Message Queue** | Redis, BullMQ                   | Redis 8, BullMQ 5.4               | Lưu cache token xác thực, idempotency key 24 giờ và điều phối hàng đợi tác vụ nền (quét đơn quá hạn 15 phút, cron 04:00). |
| **Cổng thanh toán Online**  | PayOS VietQR API                | Open Banking API                  | Tạo mã VietQR động theo đơn hàng, xác thực giao dịch tức thì qua Webhook bảo mật HMAC SHA-256.                            |
| **Lưu trữ Đa phương tiện**  | Cloudinary API                  | RESTful Media API                 | Lưu trữ hình ảnh canh tác, video khiếu nại thông qua Signed Upload; tự động nén và tối ưu hóa định dạng hiển thị.         |

### 1.2. Bổ sung Mục 1.2.1: Phân Lập Trách Nhiệm Admin vs SuperAdmin (Gỡ 0.1 điểm)

Chèn bảng phân định nguyên tắc phân quyền (Separation of Duties - SoD) vào dưới Bảng 1.1 (S.M.A.R.T) để giải thích lý do tồn tại vai trò SuperAdmin:

| Tiêu chí phân lập       | Quản trị vận hành (Admin)                                                                         | Chủ sở hữu / Quản trị tối cao (SuperAdmin)                                                        |
| :---------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| **Trọng tâm công việc** | Điều phối vận hành hàng ngày: duyệt xuất hủy, kích hoạt Flash Sale, duyệt hoàn tiền khiếu nại.    | Quản trị tài sản và an toàn hệ thống: giám sát dòng tiền, cấu hình đối tác và phân quyền nhân sự. |
| **Cấu hình thanh toán** | **Không có quyền**: Cấm thay đổi cấu hình API Key và tài khoản nhận tiền PayOS để chống gian lận. | **Toàn quyền**: Thiết lập tài khoản ngân hàng thụ hưởng, bật/tắt cổng PayOS và kênh tiền mặt COD. |
| **Báo cáo tài chính**   | Chỉ xem doanh thu chu kỳ và khối lượng xuất hủy; **không được xem lợi nhuận ròng (Net Profit)**.  | Xem toàn bộ báo cáo doanh thu thực nhận, đối soát ngân hàng và biên lợi nhuận ròng của nông trại. |
| **Quản trị người dùng** | Không có quyền can thiệp vào tài khoản của Admin khác hoặc SuperAdmin.                            | Khởi tạo, phân quyền, tạm khóa hoặc thu hồi quyền truy cập của Admin, Sales và Farm Staff.        |

### 1.3. Checklist Chỉnh Sửa Thể Thức File Word Báo Cáo

Kim Anh thực hiện 3 thao tác định dạng trực tiếp trên file Word:

- **Xóa các tiêu đề trống:** Xóa toàn bộ các trang trắng từ Chương 2 đến Chương 4 (giảng viên đã nhắc nhở vì nộp kèm đề mục trống ở Tuần 1).
- **Trang Danh mục hình ảnh:** Xóa tạm trang này nếu Chương 1 chưa có hình; chỉ bật lại khi chèn sơ đồ Use Case và ERD ở Tuần 2 và Tuần 3.
- **Trang bìa và năm báo cáo:** Kiểm tra mốc thời gian đảm bảo ghi đúng **Tháng 11 Năm 2026** (tránh nhầm lẫn 2027).

---

## 2. Soạn Thảo Tiêu Chí 1 Tuần 2: Phân Quyền & Tác Nhân (1.5 Điểm)

Nội dung dùng để sao chép thẳng vào **Mục 2.1: Phân quyền Hệ thống & Định nghĩa Tác nhân** trong báo cáo Tuần 2.

### 2.1. Bốn Nhóm Vai Trò Nghiệp Vụ Cốt Lõi (Theo yêu cầu đề bài)

Hệ thống thiết lập ranh giới trách nhiệm nghiêm ngặt giữa 4 nhóm tác nhân vận hành nhằm đảm bảo tính toàn vẹn dữ liệu:

1. **Khách hàng (Customer):**
   - _Phạm vi được phép_: Duyệt danh mục nông sản, tra cứu nhật ký canh tác qua mã QR, quản lý giỏ hàng, đặt hàng mua lẻ, đăng ký gói định kỳ theo tháng, tích lũy điểm thưởng và gửi khiếu nại bồi hoàn trong 24 giờ.
   - _Giới hạn bảo mật_: Không được xem tồn kho chi tiết từng Lô, không truy cập dữ liệu tài chính hoặc API nội bộ.

2. **Nhân viên Nông trại (Farm Staff):**
   - _Phạm vi được phép_: Quản lý mùa vụ canh tác, ghi chép tiến độ chăm sóc vào nhật ký canh tác (chế độ chỉ thêm mới Append-only), khởi tạo Lô thu hoạch (Batch), in tem mã QR và lập phiếu đề xuất xuất hủy nông sản hư hỏng.
   - _Giới hạn bảo mật_: **Tuyệt đối không có quyền xem đơn hàng, không xem thông tin khách hàng và không được tự duyệt xuất kho.**

3. **Nhân viên Bán hàng & CSKH (Sales):**
   - _Phạm vi được phép_: Tiếp nhận đơn hàng, tính phí vận chuyển theo khoảng cách thực tế, bấm xác nhận đơn để chạy thuật toán trừ kho FEFO, xuất danh sách nhặt hàng (Pick List), điều phối giao hàng và sơ duyệt hình ảnh khiếu nại từ khách.
   - _Giới hạn bảo mật_: **Không có quyền can thiệp vào quy trình canh tác, không sửa nhật ký nông trại và không tự tạo lô hàng mới.**

4. **Quản trị viên Nông trại (Admin):**
   - _Phạm vi được phép_: Giám sát báo cáo doanh thu chu kỳ, theo dõi tỷ lệ hao hụt hàng hóa, phê duyệt phiếu xuất hủy tồn kho từ Staff, kích hoạt chương trình Flash Sale cho lô cận hạn dưới 48 giờ và duyệt hoàn tiền khiếu nại.
   - _Giới hạn bảo mật_: Không thay đổi thông tin thụ hưởng thanh toán, không xem lợi nhuận ròng của chủ nông trại.

### 2.2. Hai Vai Trò Mở Rộng Đảm Bảo An Ninh Hệ Thống

Để hiện thực hóa trọn vẹn mô hình thương mại điện tử khép kín, hệ thống phân rã thêm 2 tác nhân đặc thù:

- **Khách vãng lai (Guest):** Đại diện cho người dùng chưa đăng nhập, chỉ được phép xem danh sách sản phẩm công khai, đọc câu chuyện thương hiệu và quét mã QR tra cứu nguồn gốc.
- **Chủ sở hữu tối cao (SuperAdmin):** Nắm quyền kiểm soát hạ tầng, quản trị danh sách nhân sự nội bộ, cấu hình tham số vận hành nông trại và theo dõi báo cáo dòng tiền ngân hàng độc lập.

---

## 3. Hướng Dẫn Đặc Tả CSDL 18 Bảng Cho Tuần 3 (Chuẩn Bị Sớm)

### 3.1. Quy Định Về Số Bảng Trong Biểu Chấm

Biểu chấm của Thầy Nguyễn Đức Duy tại Tuần 3 **không giới hạn số lượng bảng tối đa hay tối thiểu**. Biểu chấm chỉ yêu cầu:

- _Đầy đủ thực thể cốt lõi_: Phải có sản phẩm, lô hàng, chi tiết đơn, nhật ký canh tác, gói định kỳ và lịch giao.
- _Chuẩn hóa_: Các bảng phải đạt chuẩn 3NF, khóa chính/khóa ngoại đúng và có chỉ mục cho các trường lọc thường xuyên.
- _Kết luận_: CSDL 18 bảng của GreenRoots là cấu trúc chuẩn chỉ cấp độ doanh nghiệp, bao phủ trọn vẹn từ gieo trồng đến bàn ăn, hoàn toàn không bị coi là thừa.

### 3.2. Cách Nhóm 18 Bảng Để Trình Bày Khoa Học

Để tránh báo cáo bị rối mắt, Kim Anh chia 18 bảng thành 4 nhóm mạch lạc trong Chương 3:

1. **Nhóm Định danh & Bảo mật (4 bảng)**: `users`, `refresh_tokens`, `user_addresses`, `farms`.
2. **Nhóm Canh tác Nông trại (3 bảng)**: `plots`, `seasons`, `farming_logs`.
3. **Nhóm Sản phẩm & Tồn kho Lô (4 bảng)**: `categories`, `products`, `batches`, `waste_logs`.
4. **Nhóm Bán lẻ, Giao hàng & Khiếu nại (7 bảng)**: `orders`, `order_items`, `batch_allocations`, `subscription_plans`, `subscriptions`, `payments`, `complaints`.

Toàn bộ chi tiết từng cột, kiểu dữ liệu PostgreSQL và ý nghĩa nghiệp vụ của 18 bảng đã có sẵn tại tài liệu [[Database_ERD_and_Data_Dictionary]], Kim Anh chỉ cần sao chép bảng tương ứng sang Word.

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Báo cáo Chương 1 hoàn chỉnh: [[Chapter_01_Project_Initiation_Report]]
- Đặc tả 5 Use Case và bảng NFR: [[Week_02_Use_Case_Specs_and_NFR]]
- Sơ đồ ERD và Từ điển Dữ liệu 18 bảng: [[Database_ERD_and_Data_Dictionary]]
- Đặc tả phân quyền 6 Roles: [[Role_Based_Access_Control_Specification]]
