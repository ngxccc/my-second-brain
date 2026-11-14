---
tags: [type/project, status/active]
date: 2026-11-12
description: "Quy chuẩn Design Tokens, Typography, Bảng màu và Ngôn ngữ thị giác Organic Minimalism cho GreenRoots Farm."
---

# UI Design System and Tokens Specification

## TL;DR

- **Bản chất**: Tài liệu quy chuẩn thiết kế nền tảng định hình ngôn ngữ thị giác Organic Minimalism cho cả hai phân hệ web.
- **Mục đích**: Cung cấp bảng mã Design Tokens, quy cách khung hình và tỷ lệ lưới để đội ngũ thiết kế đồng bộ giao diện.
- **Điểm mấu chốt**: Ưu tiên độ tương phản cao cho thao tác ngoài trời của Farm Staff và tính rõ ràng cho bảng số liệu kho bãi.

---

## 1. Ngôn Ngữ Thị Giác Organic Minimalism

Hệ thống giao diện của GreenRoots Farm theo đuổi phong cách tối giản hữu cơ:

- **Nền sáng tự nhiên**: Tôn vinh hình ảnh rau củ tươi sống, tránh dùng màu nhân tạo sặc sỡ.
- **Phân cấp thị giác rõ ràng**: Trạng thái tươi mới, cận hạn và xuất hủy được biểu thị bằng mã màu trực quan.
- **Thân thiện ngoài trời**: Các nút bấm trên thiết bị di động có chiều cao tối thiểu $48\text{px}$ để kỹ sư dễ thao tác bằng một tay.

---

## 2. Bảng Mã Design Tokens Toàn Cục

Hệ thống token được đồng bộ trực tiếp vào cấu hình Tailwind CSS của toàn bộ dự án:

| Nhóm Token     | Tên Biến Tailwind   | Giá Trị Hex | Ý Nghĩa Sử Dụng                                          |
| :------------- | :------------------ | :---------- | :------------------------------------------------------- |
| Primary Brand  | `brand-forest`      | `#15803D`   | Màu thương hiệu chính, nút bấm CTA, thanh điều hướng     |
| Primary Hover  | `brand-forest-dark` | `#166534`   | Trạng thái hover và active của các nút chính             |
| Accent Harvest | `accent-harvest`    | `#D97706`   | Cảnh báo lô hàng cận hạn, nhãn Flash Sale giảm giá 50%   |
| Surface Canvas | `surface-warm`      | `#FAF8F5`   | Màu nền tổng thể Storefront tạo cảm giác nông trại ấm áp |
| Surface Card   | `surface-card`      | `#FFFFFF`   | Nền thẻ sản phẩm, bảng biểu DataTable, khung hồ sơ QR    |
| Border Subtle  | `border-subtle`     | `#E5E7EB`   | Đường viền ngăn cách thẻ và các hàng trong bảng dữ liệu  |
| Text Primary   | `text-ink`          | `#111827`   | Tiêu đề, số liệu định lượng, tên sản phẩm thương mại     |
| Text Muted     | `text-muted`        | `#6B7280`   | Nhãn phụ, thời gian ghi nhận, mã định danh lô đất        |
| Status Success | `status-fresh`      | `#059669`   | Trạng thái tươi mới, đã thanh toán, đã duyệt xuất kho    |
| Status Danger  | `status-spoiled`    | `#DC2626`   | Trạng thái quá hạn, từ chối duyệt, đơn hàng đã hủy       |

---

## 3. Quy Chuẩn Typography và Khung Hình

Phông chữ được cấu hình hiển thị chuẩn xác dấu tiếng Việt và chữ số định lượng:

- **Font Sans (`font-sans`)**: Sử dụng phông `Be Vietnam Pro` cho toàn bộ văn bản, nhãn nút và tiêu đề.

Kích thước khung hình chuẩn trên công cụ thiết kế:

| Ứng Dụng                  | Màn Hình Mục Tiêu           | Viewport Chuẩn                            | Quy Cách Thiết Kế                                                 |
| :------------------------ | :-------------------------- | :---------------------------------------- | :---------------------------------------------------------------- |
| `apps/storefront`         | Khách vãng lai & Khách mua  | `390x844` (Mobile) & `1440x900` (Desktop) | Ưu tiên Mobile-first, dải lưới 12 cột trên màn hình rộng          |
| `apps/backoffice` (Staff) | Kỹ sư nông trại ngoài ruộng | `390x844` (Mobile Phone)                  | Thẻ chạm lớn, nút $\ge 48\text{px}$, điều hướng Bottom Tabs       |
| `apps/backoffice` (Desk)  | Sales, Admin, SuperAdmin    | `1440x900` (Desktop Workspace)            | Sidebar cố định $240\text{px}$, vùng dữ liệu DataTable mật độ cao |

---

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Đặc tả màn hình Storefront: [[Storefront_Screen_Specs]]
- Đặc tả màn hình Backoffice: [[Backoffice_Screen_Specs]]
