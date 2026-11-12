---
tags: [type/project, status/active]
date: 2026-11-12
description: "Đặc tả chi tiết bố cục, trường dữ liệu và prompt tạo mẫu cho 10 màn hình thuộc phân hệ Backoffice."
---

# Backoffice Screen Specs

## TL;DR

- **Bản chất**: Tài liệu đặc tả chi tiết 10 màn hình vận hành nội bộ thuộc ứng dụng React Vite Backoffice.
- **Mục đích**: Cung cấp giao diện chuẩn xác cho 4 vai trò vận hành, đảm bảo thực thi đúng quy trình FEFO và kiểm soát xuất hủy.
- **Điểm mấu chốt**: Phân tách trải nghiệm di động một tay ngoài ruộng cho Farm Staff và không gian làm việc bảng biểu cho Sales và Admin.

---

## 1. Danh Mục Màn Hình Phân Hệ Backoffice

Phân hệ `apps/backoffice` bao gồm 10 màn hình phân bổ theo 4 vai trò nội bộ:

| Mã Màn Hình | Tên Màn Hình                  | Vai Trò Sử Dụng | Viewport Chuẩn     | Chức Năng Cốt Lõi                                             |
| :---------- | :---------------------------- | :-------------- | :----------------- | :------------------------------------------------------------ |
| `BO-01`     | Quản Lý Mùa Vụ & Lô Đất       | `Farm Staff`    | Mobile (`390px`)   | Theo dõi mùa vụ và chỉ số xét nghiệm đất, nước                |
| `BO-02`     | Ghi Nhật Ký Canh Tác          | `Farm Staff`    | Mobile (`390px`)   | Ghi sự kiện Append-only qua lưới 2x4 nút hành động            |
| `BO-03`     | Khởi Tạo Lô & Đề Xuất Hủy     | `Farm Staff`    | Mobile (`390px`)   | Nhập Lô mới, in tem QR nhiệt và lập phiếu xuất hủy            |
| `BO-04`     | Điều Phối Đơn & Xuất Kho FEFO | `Sales`         | Desktop (`1440px`) | Chạy thuật toán FEFO và xuất phiếu nhặt hàng Pick List        |
| `BO-05`     | Sơ Duyệt Khiếu Nại Bồi Hoàn   | `Sales`         | Desktop (`1440px`) | Kiểm tra ảnh dập nát, video đối chiếu tem QR                  |
| `BO-06`     | Phê Duyệt Xuất Hủy 2 Bước     | `Admin`         | Desktop (`1440px`) | Thẩm định bằng chứng và chính thức trừ tồn kho thực tế        |
| `BO-07`     | Cảnh Báo Hạn & Kích Hoạt Sale | `Admin`         | Desktop (`1440px`) | Theo dõi Lô cận hạn dưới 48 giờ và bật Flash Sale 50%         |
| `BO-08`     | Quản Lý Gói Rau & Báo Cáo Kho | `Admin`         | Desktop (`1440px`) | Cấu hình gói định kỳ và thống kê tỷ lệ hao hụt sau thu hoạch  |
| `BO-09`     | Đối Soát Dòng Tiền & PayOS    | `SuperAdmin`    | Desktop (`1440px`) | Sổ cái thanh toán tổng hợp đối soát mã giao dịch PayOS và COD |
| `BO-10`     | Phân Quyền RBAC & Cấu Hình    | `SuperAdmin`    | Desktop (`1440px`) | Quản lý tài khoản nội bộ và lưu khóa bí mật tích hợp          |

---

## 2. Đặc Tả Chi Tiết Từng Phân Hệ Vai Trò

### 2.1. Phân Hệ Kỹ Sư Nông Trại (Farm Staff — Mobile-first)

- **`BO-01` (Mùa vụ & Đất)**: Thẻ hiển thị mã thửa đất `plot_code`, diện tích, tình trạng mùa vụ và tóm tắt chỉ số an toàn từ `soil_test_result` và `water_test_result`.
- **`BO-02` (Nhật ký canh tác)**: Form dạng thẻ chạm lớn gồm dropdown chọn mùa vụ, lưới nút bấm 2x4 chọn đúng 8 loại hành động (`seeding`, `watering`, `bio_fertilizing`, `weeding`, `pest_control`, `soil_testing`, `harvesting`, `correction`), ô nhập mô tả và nút chụp 1–3 ảnh/video thực tế. Giao diện tuyệt đối không có nút sửa hoặc xóa bản ghi cũ.
- **`BO-03` (Lô hàng & Xuất hủy)**: Form nhập sản lượng thu hoạch, tự động tính hạn dùng; nút sinh và in tem QR dán thùng; tab lập phiếu đề xuất xuất hủy rau dập nát kèm ảnh cân đo hiện trường gửi trạng thái `pending_approval`.

### 2.2. Phân Hệ Nhân Viên Bán Hàng & Điều Phối (Sales — Desktop Workspace)

- **`BO-04` (Đơn hàng & FEFO)**: Bảng dữ liệu lọc đơn theo trạng thái; nút thực thi **Xác nhận đơn & Phân bổ FEFO** tự động trừ kho từ Lô cận hạn nhất; bảng **Pick List** hiển thị chi tiết số kg cần nhặt từ từng Lô hàng cụ thể; nút in phiếu giao hàng hiển thị rõ số tiền thu hộ `0đ` đối với đơn thuộc gói định kỳ.
- **`BO-05` (Sơ duyệt khiếu nại)**: Danh sách yêu cầu bồi hoàn gửi trong 24 giờ; trình xem phóng to ảnh tem QR dập nát, trình phát video kiểm tra và nút chuyển tiếp đề xuất xử lý lên Admin.

### 2.3. Phân Hệ Quản Trị Vận Hành (Admin — Desktop Control)

- **`BO-06` (Duyệt xuất hủy 2 bước)**: Danh sách phiếu xuất hủy chờ duyệt; xem ảnh bằng chứng cân đo, bấm **Phê duyệt** để trừ số lượng khả dụng của Lô hoặc bấm **Từ chối** kèm lý do.
- **`BO-07` (Cảnh báo cận hạn & Flash Sale)**: Danh sách các Lô còn hạn sử dụng dưới 48 giờ; công tắc kích hoạt đưa sản phẩm vào mục Flash Sale giảm giá 50% trên Storefront.
- **`BO-08` (Gói định kỳ & Báo cáo)**: Biểu mẫu bật tắt gói `subscription_plans`; biểu đồ tròn tỷ lệ hao hụt theo công thức `discarded / initial_quantity` và danh sách sản phẩm tiêu thụ tốt nhất. Tuyệt đối ẩn cấu hình khóa bí mật PayOS và báo cáo lợi nhuận ròng.

### 2.4. Phân Hệ Quản Trị Tối Cao (SuperAdmin — Root Governance)

- **`BO-09` (Đối soát tài chính)**: Sổ cái bảng `payments` tổng hợp toàn bộ giao dịch PayOS (mã `order_code`, `reference_code`, dữ liệu gốc `raw_payload`) và xác nhận thu tiền mặt COD.
- **`BO-10` (Phân quyền & Cấu hình động)**: Bảng quản lý người dùng nội bộ (`farm_staff`, `sales`, `admin`); form cấu hình động bảng `farms` (thông tin liên hệ, tọa độ GPS nông trại, bảng giá ship km, ngưỡng Flash Sale, bật/tắt kênh PayOS/COD) đồng bộ cache Redis 24h, kèm thẻ trạng thái kết nối PayOS/Cloudinary đã che khóa (API Keys giữ cố định trong `.env`).

---

## 3. Câu Lệnh Mẫu Tạo Giao Diện Bằng AI

Nhà thiết kế có thể sử dụng các đoạn mô tả dưới đây để sinh layout chi tiết trên các công cụ tạo mẫu AI:

```text
Prompt BO-02 (Farm Staff Mobile Screen):
Design a touch-friendly mobile web screen (390px width) in Vietnamese for a farm engineer working outdoors.
Theme: High contrast white cards, deep forest green (#15803D) primary buttons, 48px touch targets.
Components:
1. Header: Role badge "Farm Staff", Plot Selector "Thua dat PLOT-A1 - Vu Dong Xuan 2026".
2. Action Type Grid (2x4 touch buttons): "Gieo hat", "Tuoi nuoc", "Bon phan huu co", "Lam co", "Bao ve thuc vat", "Kiem nghiem dat", "Thu hoach", "Dinh chinh".
3. Notes textarea and a prominent media dropzone "Chup anh / Video thuc te (Toi da 3 tep, Video <= 15s)".
4. Warning badge: "Nhat ky la so cai bat bien (Append-only)". Sticky full-width submit button "Luu Nhat Ky Canh Tac".
5. Bottom navigation: 4 tabs ("Mua vu", "Nhat ky", "Lo & QR", "Xuat huy").
```

```text
Prompt BO-04 (Sales FEFO Desktop Screen):
Design a dense, clean enterprise ERP dashboard (1440px width) in Vietnamese for a Sales Coordinator.
Theme: Clean SaaS table layout, left sidebar (240px) with role badge "Sales", JetBrains Mono font for weights and currency.
Layout:
- Left Column (60%): Order Header "#ORD-20261112-009", Badge "Da thanh toan (PayOS)", Status Stepper (Pending Confirmation -> Packing -> Shipping -> Delivered -> Completed).
  Table "FEFO Pick List (Phieu nhat hang theo Lo)": Item "Ca chua bi (5 kg)" with expandable rows: "2.0 kg tu BATCH-20261110-TOM-01 (HSD: 14/11 - Can han)" (amber pill), and "3.0 kg tu BATCH-20261112-TOM-02 (HSD: 19/11)" (green pill).
- Right Column (40%): Customer address, Haversine distance "6.2 km - Phi ship 21.000d", Action buttons "Xac nhan & Phan bo FEFO", "In Phieu Giao Hang".
```

---

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Quy chuẩn Design Tokens: [[UI_Design_System_and_Tokens_Specification]]
- Đặc tả màn hình Storefront: [[Storefront_Screen_Specs]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Phân quyền 6 Roles RBAC: [[Role_Based_Access_Control_Specification]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
