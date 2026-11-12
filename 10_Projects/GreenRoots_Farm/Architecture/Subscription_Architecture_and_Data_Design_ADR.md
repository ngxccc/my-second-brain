---
tags: [type/project, status/active]
date: 2026-11-12
description: "Quyết định kiến trúc tách bảng Subscription Plans, cơ chế Dual Ref-Snapshot và khung định lượng nông nghiệp."
---

# Subscription Architecture and Data Design ADR

## TL;DR

- **Bản chất**: Bản ghi quyết định kiến trúc chuẩn hóa mô hình đăng ký gói định kỳ kết hợp bất biến tài chính và nông nghiệp thực tế.
- **Mục đích**: Lưu vết lý do kỹ thuật tách bảng plans, dùng khung định lượng theo mùa và hạch toán đơn con cho toàn bộ nhóm phát triển.
- **Điểm mấu chốt**: Áp dụng mẫu Dual Ref-Snapshot chống sai lệch giá quá khứ và field weight_per_delivery_kg thay vì fix cứng mặt hàng.

---

## 1. Bối Cảnh và Vấn Đề (Context & Problem Statement)

Trong phiên bản thiết kế sơ bộ, thông tin gói định kỳ (`plan_name`, `total_deliveries`, `prepaid_amount`) được ghi cứng trực tiếp vào bảng `subscriptions`.

Thiết kế này bộc lộ ba lỗ hổng kiến trúc nghiêm trọng:

1. **Frontend Hardcoding**: Storefront không có nguồn dữ liệu động để hiển thị danh sách các gói cước đang mở bán.
2. **Admin Unmanageable**: Quản trị viên không thể tạo gói mới (ví dụ: _Gói Ăn Dặm Cho Bé_, _Gói Văn Phòng 1 Người_) hoặc điều chỉnh giá bán nếu không sửa mã nguồn ứng dụng.
3. **Financial Vulnerability**: Nếu sửa đổi giá trên một bảng chung, toàn bộ hợp đồng quá khứ của khách hàng sẽ bị sai lệch giá trị đối soát.

---

## 2. Quyết Định Kiến Trúc: Tách Bảng Subscription Plans và Mẫu Dual Ref-Snapshot

Hệ thống quyết định tách thành hai bảng độc lập:

- `subscription_plans`: Thực thể cấu hình danh mục gói cước do Admin quản lý.
- `subscriptions`: Hợp đồng cam kết giữa khách hàng và nông trại khi thanh toán trả trước.

Bảng `subscriptions` áp dụng đồng thời hai cơ chế:

```text
[subscription_plans] ◄── FK (plan_id) ────┐
   (Admin quản lý)                        │
                                          ▼
                                   [subscriptions]
                                   ├── plan_id (Phục vụ báo cáo kinh doanh / Analytics)
                                   └── DỮ LIỆU BẤT BIẾN TẠI THỜI ĐIỂM THANH TOÁN (OPTION A: TÊN TỰ NHIÊN):
                                       ├── plan_name
                                       ├── price
                                       ├── total_deliveries
                                       ├── weight_per_delivery_kg
                                       └── basket_description
```

### Ràng buộc bất biến tài chính (Financial Immutability)

Nếu khách hàng mua gói 1.200.000đ ngày 01/11, đến ngày 15/11 Admin tăng giá gói lên 1.500.000đ hoặc xóa gói:

- Khóa ngoại `plan_id` đặt `onDelete: set null` giúp bảo toàn hợp đồng.
- Các trường `plan_name`, `price`, `total_deliveries` giữ nguyên giá trị hợp đồng đã thanh toán, không bị sửa đổi theo bảng plans.

---

## 3. Lý Do Dùng weight_per_delivery_kg Thay Vì Bảng plan_items Cố Định

Trong thương mại điện tử thông thường, các gói combo thường gắn cứng danh sách sản phẩm (ví dụ: 1kg cà chua + 1kg xà lách). **Tuy nhiên, đây là cạm bẫy chết người đối với nông sản tươi sống.**

### Rủi ro thực tế nông nghiệp

- Nông sản phụ thuộc thời tiết, sâu bệnh và chu kỳ thu hoạch. Nếu một tuần mưa bão làm dập nát toàn bộ xà lách, nông trại không thể có đúng loại xà lách đó để giao.
- Việc hứa hẹn cố định mặt hàng sẽ dẫn đến tình trạng vỡ cam kết giao hàng và khách hàng khiếu nại hàng loạt.

### Giải pháp: Khung Định Lượng Nông Nghiệp Theo Mùa (Farm Seasonal Basket)

Hệ thống sử dụng hai trường đặc thù:

1. `weight_per_delivery_kg`: Cam kết chuẩn về tổng khối lượng nông sản thực nhận (ví dụ: cố định 5.0 kg/lượt giao).
2. `basket_description`: Bản mô tả cơ cấu nhóm rau củ theo mùa (ví dụ: _"2kg rau ăn lá + 2kg củ quả + 1kg rau gia vị tươi ngon nhất thu hái trong ngày"_).

Khi đến ngày giao, nhân viên kho dựa vào lượng tồn kho thực tế của các Lô (Batch) đạt chuẩn FEFO để đóng gói đủ 5kg giao cho khách.

---

## 4. Cơ Chế Hạch Toán Đơn Hàng Con: total_amount = prepaid_amount / total_deliveries

Khi tác nhân thời gian (Cron Job) tự động sinh đơn hàng con (`orders`) vào 04:00 sáng ngày giao:

- Đơn hàng con liên kết với gói thông qua trường `orders.subscription_id`.
- Phương thức thanh toán được gán: `payment_method = 'subscription'`, `payment_status = 'paid'`.
- Giá trị đơn hàng con được tính theo công thức:

$$\text{total\_amount} = \frac{\text{prepaid\_amount}}{\text{total\_deliveries}}$$

_Ví dụ: Gói 1.200.000đ gồm 8 lần giao $\rightarrow$ mỗi đơn con ghi nhận $\text{total\_amount} = 150.000\text{ đ}$._

### 3 mục đích nghiệp vụ sống còn của công thức này:

1. **Giá trị xuất kho thực tế**: Phản ánh chính xác giá trị hàng hóa rời khỏi kho bãi trong ngày, giúp báo cáo doanh thu tuần/tháng không bị đột biến ảo.
2. **Căn cứ bồi hoàn khiếu nại**: Nếu đợt giao đó rau bị hư hỏng và khách yêu cầu hoàn tiền, hệ thống có ngay con số chính xác (150.000đ) để hoàn trả qua ví/ngân hàng.
3. **Phiếu giao hàng minh bạch**: Phiếu in cho Shipper ghi rõ kiện hàng trị giá 150.000đ (đã thanh toán), tránh việc kiện hàng ghi 0đ gây hiểu lầm là hàng khuyến mãi vô giá trị.

---

## 5. Quy Trình Vòng Đời Gói Cước (Plan Lifecycle via Soft-Retire)

Để ngăn ngừa lỗi xung đột dữ liệu:

- Bảng `subscription_plans` tích hợp cờ `is_active: boolean` (mặc định `true`).
- Khi nông trại muốn dừng bán một gói hoặc thay đổi giá: Admin **chuyển `is_active = false`** để ẩn gói khỏi giao diện mua sắm và tạo gói mới.
- Tuyệt đối cấm sửa đè (`UPDATE`) giá trên dòng gói đang có người đăng ký.

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Sơ đồ ERD và Dữ liệu CSDL: [[Database_ERD_and_Data_Dictionary]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Đặc tả User Stories MoSCoW: [[MoSCoW_User_Stories_Specification]]
- Xử lý trường hợp biên: [[Operations_and_Edge_Cases_RFC]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
