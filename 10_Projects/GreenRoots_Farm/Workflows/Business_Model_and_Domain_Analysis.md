---
tags: [type/project, status/active]
date: 2026-11-11
description: "Phân tích mô hình kinh tế, phễu vấn đề và mục tiêu SMART cho đồ án thương mại điện tử nông sản sạch."
---

# Business Model and Domain Analysis

## TL;DR

- **Bản chất**: Tài liệu phân tích kinh tế học chuỗi cung ứng, cơ chế xác thực nguồn gốc và chân dung người dùng cho dự án nông sản.
- **Mục đích**: Cung cấp cơ sở lý luận học thuật vững chắc cho Chương 1 và ngăn chặn các ngụy biện kinh tế học khi bảo vệ đề tài.
- **Điểm mấu chốt**: Thành bại của mô hình D2C nông sản phụ thuộc vào việc chuyển đổi sang Subscription để kiểm soát chi phí vận chuyển chặng cuối.

---

## Phễu Vấn đề và Cơ chế Xác thực Nguồn gốc 3 Lớp (Q6)

Giải quyết nghịch lý tự công bố chất lượng (Self-proclaimed Transparency Paradox):

- **Dữ liệu thị trường tiêu dùng cập nhật (PwC Vietnam 2025 & Vietnam Report 2025-2026)**:
  - Theo Khảo sát Người tiêu dùng Việt Nam của PwC (Voice of Consumer 2025), người tiêu dùng ngày càng thắt chặt chi tiêu do bối cảnh kinh tế, nhưng lại khắt khe hơn bao giờ hết về chất lượng dinh dưỡng, tính an toàn và tính minh bạch nguồn gốc của thực phẩm.
  - Theo Vietnam Report (2025-2026), người tiêu dùng đô thị hình thành thói quen kiểm tra khắt khe nguồn gốc xuất xứ thực phẩm trước khi mua, đẩy nhu cầu truy xuất nguồn gốc số thành tiêu chuẩn bắt buộc.
  - Khảo sát của Cimigo và các vụ bê bối dán nhãn VietGAP giả mạo (2022-2025) cho thấy trên 61% người tiêu dùng mất niềm tin vào nhãn mác tĩnh thiếu cơ chế đối soát.
- **Giải pháp xác thực 3 lớp (3-Tier Verification)**:
  - _Lớp 1 (Không gian & Thời gian)_: Nhật ký canh tác gắn với mã số lô đất (Plot ID) và mốc thời gian thực bất biến.
  - _Lớp 2 (Đối soát bên thứ ba)_: Mã chứng nhận VietGAP/USDA liên kết trực tiếp tới URL tra cứu công khai của cơ quan cấp chứng chỉ.
  - _Lớp 3 (Truy xuất bao bì)_: Mã QR trên từng túi sản phẩm dẫn trực tiếp đến hồ sơ Lô thu hoạch (Batch) kèm biên bản phân tích mẫu đất và nước.

---

## Kinh tế học Đơn hàng D2C và Tối ưu Vận chuyển (Q7)

Khắc phục ngụy biện loại bỏ trung gian và giải quyết bài toán chi phí giao nhận chặng cuối:

- **Dữ liệu chuỗi cung ứng và thất thoát sau thu hoạch (VLR 2025-2026 & Bộ NN&PTNT)**:
  - Theo Vietnam Logistics Review (VLR giai đoạn 2025-2026), chi phí logistics nông sản Việt Nam vẫn chiếm 20% - 25% tổng chi phí chuỗi giá trị, riêng rau quả tươi sống chiếm gần 30% giá thành do thiếu hụt hạ tầng chuỗi lạnh đồng bộ.
  - Thống kê của FAO và Bộ NN&PTNT cập nhật năm 2025-2026 chỉ ra tỷ lệ thất thoát sau thu hoạch của rau quả tươi sống tại Việt Nam dao động từ 20% đến 30% (tương đương 3.9 tỷ USD mỗi năm), khẳng định tính cấp thiết của việc rút ngắn thời gian lưu kho.
  - _Tập trung vào Gói định kỳ (Subscription Basket)_: Đẩy 80% doanh thu sang combo tuần/tháng (giỏ rau 3-5kg, giá trị 150.000đ - 250.000đ/lần giao).
  - _Gom đơn theo tuyến đường cố định_: Chỉ giao định kỳ vào Thứ 3 và Thứ 6 hàng tuần để tối ưu lộ trình (Route Optimization), kéo chi phí vận chuyển xuống dưới 15% giá trị đơn.
  - _Ràng buộc đơn mua lẻ_: Đơn hàng lẻ chịu phí ship động theo km thực tế và áp dụng giá trị đơn hàng tối thiểu (Minimum Order Value - 150.000đ).

---

## Chân dung Khách hàng Mục tiêu (Q8)

Xác lập đối tượng khách hàng trọng tâm chi trả cho dịch vụ:

- **Khách hàng cốt lõi (Primary Persona)**:
  - Hộ gia đình trẻ tại đô thị (Urban Middle Class), có con nhỏ hoặc phụ nữ mang thai.
  - Thu nhập trung bình khá trở lên, sẵn sàng chi trả mức giá chênh lệch 30% - 50% so với chợ truyền thống để đổi lấy sự an toàn tuyệt đối.
  - Bận rộn, không có thời gian đi chợ hàng ngày, ưu tiên nhận thực phẩm tươi định kỳ tận nhà.
- **Khách hàng phụ trợ (Secondary Persona)**:
  - Bếp ăn trường mầm non tư thục hoặc nhà hàng phân khúc thực dưỡng hữu cơ cần nguồn cung ổn định và đầy đủ chứng từ xuất xứ.

---

## Thiết kế Vận hành Đồng ruộng cho Farm Staff (Q9)

Xóa bỏ điểm nghẽn thao tác ngoài đồng ruộng của nhân sự canh tác:

- **Rào cản thực tế**: Nhân viên làm vườn thao tác bằng điện thoại thông minh trong điều kiện dính bùn đất, nắng gắt và kết nối mạng chập chờn. Giao diện form nhập liệu phức tạp sẽ bị tẩy chay.
- **Thiết kế tối ưu hóa**:
  - _Giao diện dạng thẻ (Card UI)_: Thao tác chọn Mùa vụ và Hành động (Gieo hạt, Tưới, Bón phân, Thu hoạch) qua các khối nút bấm lớn.
  - _Chuẩn hóa mốc canh tác (SOP Stages)_: Chỉ yêu cầu cập nhật tại các mốc sinh trưởng chính thay vì bắt nhập liệu nhật ký mỗi ngày.
  - _Nén ảnh tự động tại Client_: Hình ảnh và video chụp từ camera được tự động nén xuống dưới 300KB trước khi đẩy lên Cloudinary để thích ứng mạng 4G yếu.

---

## Mục tiêu S.M.A.R.T Học thuật cho Báo cáo Tuần 1 (Q10)

Hệ thống chỉ tiêu định lượng phục vụ nghiệm thu đồ án:

| Tiêu chí           | Nội dung cụ thể                                                                                                                       | Chỉ số đo lường (Metrics)                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **S - Specific**   | Xây dựng hệ thống thương mại điện tử D2C khép kín cho 1 nông trại, tích hợp quản lý kho Lô (Batch), xuất kho FEFO và QR Traceability. | Hoàn thiện 5 phân hệ người dùng theo tài liệu đặc tả.                                                                             |
| **M - Measurable** | Thời gian phản hồi quét mã QR truy xuất; tỷ lệ tuân thủ FEFO; độ chính xác tự sinh đơn Subscription.                                  | Thời gian tải trang QR < 2s; 100% đơn hàng xuất đúng lô FEFO; 100% đơn định kỳ sinh đúng lịch.                                    |
| **A - Achievable** | Giới hạn phạm vi trong ma trận MoSCoW, loại bỏ Mobile App native và AI dự báo sản lượng.                                              | Hoàn thành toàn bộ Must-have và Should-have trong khung thời gian 3 tuần (21 ngày).                                               |
| **R - Relevant**   | Trực tiếp giải quyết bài toán cốt lõi của nông sản tươi: quản lý hạn sử dụng ngắn hạn và minh bạch quy trình trồng trọt.              | Khớp hoàn toàn với tiêu chuẩn nghiệm thu của giảng viên.                                                                          |
| **T - Time-bound** | Phân bổ tiến độ thực hiện theo chu kỳ 3 tuần (21 ngày).                                                                               | Tuần 1: Đặc tả & CSDL Drizzle; Tuần 2: Backend NestJS Core & API Adapter; Tuần 3: Frontend Next.js/React.js, Kiểm thử & Đóng gói. |

---

## Danh mục Nguồn Dữ liệu Thị trường Được Xác Thực (Cập nhật 2025-2026)

Các số liệu trích dẫn trong phân tích bài toán và báo cáo Chương 1:

1. **Khảo sát Người tiêu dùng Việt Nam (PwC Vietnam 2025)**: Thấu hiểu hành vi tiêu dùng khắt khe về an toàn và nguồn gốc thực phẩm. Tham chiếu: PwC Vietnam, _Voice of the Consumer Survey 2025_, phát hành tháng 10/2025, <https://www.pwc.com/vn/vn/publications/2025/voice-of-consumer-2025.pdf>.
2. **Xu hướng Tiêu dùng và Truy xuất Nguồn gốc Thực phẩm (Vietnam Report 2025-2026)**: Thói quen kiểm tra nguồn gốc nông sản của người tiêu dùng đô thị. Tham chiếu: Vietnam Report & Báo Tuổi Trẻ (2025-2026), _Sức mua tăng, cùng lúc người Việt ngày càng soi nguồn gốc thực phẩm_, <https://www.vietnam.vn/suc-mua-tang-cung-luc-nguoi-viet-ngay-cang-soi-nguon-goc-thuc-pham>.
3. **Thực trạng Chi phí Logistics và Chuỗi Lạnh Nông sản (VLR 2025-2026)**: Chi phí logistics chiếm 29% - 29.5% giá thành rau quả tươi sống. Tham chiếu: Vietnam Logistics Review (2025-2026), _Chuỗi lạnh nông sản Việt Nam: Bao giờ thoát cảnh được mùa rớt giá_, <https://vlr.vn/chuoi-lanh-nong-san-viet-nam-bao-gio-thoat-canh-duoc-mua-rot-gia-26306.html>.
4. **Thất thoát Sau Thu hoạch Nông sản (FAO & Bộ NN&PTNT 2025-2026)**: Thất thoát 8.8 triệu tấn nông sản/năm (3.9 tỷ USD); rau củ quả hao hụt 20% - 30% do thiếu chuỗi lạnh. Tham chiếu: Báo Nhân Dân (2025-2026), _Giảm thất thoát trong chuỗi cung ứng nông sản_, <https://nhandan.vn/ocop/giam-that-thoat-trong-chuoi-cung-ung-nong-san-post999834.html>.

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Xử lý trường hợp biên và vận hành: [[Operations_and_Edge_Cases_RFC]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
