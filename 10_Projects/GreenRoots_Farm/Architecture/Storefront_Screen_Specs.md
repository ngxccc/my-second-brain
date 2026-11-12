---
tags: [type/project, status/active]
date: 2026-11-12
description: "Đặc tả chi tiết bố cục, trường dữ liệu và prompt tạo mẫu cho 5 màn hình thuộc phân hệ Storefront."
---

# Storefront Screen Specs

## TL;DR

- **Bản chất**: Tài liệu đặc tả chi tiết 5 màn hình giao diện công khai và khách hàng thuộc ứng dụng Next.js Storefront.
- **Mục đích**: Cung cấp cấu trúc bố cục, trường dữ liệu và câu lệnh tạo mẫu AI để dựng giao diện không bị lệch nghiệp vụ.
- **Điểm mấu chốt**: Tập trung vào tính minh bạch nguồn gốc của trang quét QR và luồng tính phí vận chuyển theo khoảng cách thực tế.

---

## 1. Danh Mục Màn Hình Phân Hệ Storefront

Phân hệ `apps/storefront` bao gồm 5 màn hình chính phục vụ hai vai trò `Guest` và `Customer`:

| Mã Màn Hình | Tên Màn Hình                     | Tuyến Đường (Route)                  | Viewport Chính         | Tác Nhân Truy Cập   |
| :---------- | :------------------------------- | :----------------------------------- | :--------------------- | :------------------ |
| `SF-01`     | Trang Chủ & Giải Cứu Cận Hạn     | `/`                                  | Mobile & Desktop       | `Guest`, `Customer` |
| `SF-02`     | Danh Mục & Chi Tiết Sản Phẩm     | `/products`, `/products/:slug`       | Mobile & Desktop       | `Guest`, `Customer` |
| `SF-03`     | Trang Truy Xuất Nguồn Gốc QR     | `/trace/:batchCode`                  | Mobile-first (`390px`) | `Guest`, `Customer` |
| `SF-04`     | Đăng Ký Gói Rau Định Kỳ          | `/subscriptions`                     | Mobile & Desktop       | `Customer`          |
| `SF-05`     | Giỏ Hàng, Thanh Toán & Khiếu Nại | `/checkout`, `/orders/:id/complaint` | Mobile & Desktop       | `Customer`          |

---

## 2. Đặc Tả Chi Tiết Từng Màn Hình

### 2.1. Màn hình `SF-01`: Trang Chủ Siêu Thị Nông Sản (`/`)

- **Bố cục (Grocery-First Layout)**: Header cố định xanh lá (`#15803D`) chứa thanh tìm kiếm lớn, bộ chọn địa chỉ giao nhận (ước lượng khoảng cách Haversine), nút Giỏ hàng và nút Quét QR; thân trang chia 2 cột gồm Sidebar Danh mục sản phẩm cố định bên trái (`260px`) và vùng nội dung chính bên phải (dải icon danh mục nhanh, banner ngang gọn giới thiệu nông trại duy nhất `farms` kèm ô tra cứu nhanh mã Lô, hàng Flash Sale cận hạn `< 48h`, và lưới thẻ sản phẩm mật độ cao có nút `MUA` / `[- 1 +]` trực tiếp trên thẻ).
- **Trường dữ liệu**: Tên nông trại, địa chỉ từ bảng `farms`; danh mục từ `categories`; danh sách sản phẩm (`base_price`, `unit`, tổng `available_quantity`) và các gói rau định kỳ `subscription_plans`.

### 2.2. Màn hình `SF-02`: Chi Tiết Sản Phẩm (`/products/:slug`)

- **Bố cục**: Khung hiển thị tối đa 5 ảnh (`image_urls`), tên nông sản, đơn vị tính (`unit`), giá bán lẻ (`base_price`), nhãn chứng nhận canh tác, thông tin tổng số lượng tồn kho khả dụng và nút thêm vào giỏ hàng.
- **Ràng buộc**: Tuyệt đối không hiển thị mã Lô nội bộ cho khách chọn; số lượng thêm tối đa bằng tổng `available_quantity` của các Lô còn hạn.

### 2.3. Màn hình `SF-03`: Trang Truy Xuất Nguồn Gốc QR (`/trace/:batchCode`)

- **Bố cục**: Thẻ định danh Lô thu hoạch (`batch_code`, ngày thu hoạch, hạn dùng, trạng thái tươi mới); Thẻ hồ sơ thửa đất (`plot_code`, kết quả xét nghiệm đất và nước đạt chuẩn); Dòng thời gian nhật ký canh tác (`farming_logs`) hiển thị tuần tự từ gieo hạt đến thu hoạch kèm ảnh thực tế và huy hiệu xác thực bất biến.
- **Ràng buộc**: Thời gian tải trang dưới 2 giây trên mạng di động 4G; không có bất kỳ nút sửa hay xóa dữ liệu.

### 2.4. Màn hình `SF-04`: Đăng Ký Gói Rau Định Kỳ (`/subscriptions`)

- **Bố cục**: Danh sách các thẻ gói rau gia đình (`subscription_plans`), khối lượng mỗi lần giao (`weight_per_delivery_kg`), số lần giao (`total_deliveries`), mô tả giỏ rau mùa vụ và form chọn ngày giao định kỳ (**Thứ 3**, **Thứ 6** hoặc **Cả hai**).
- **Ràng buộc**: Nút đăng ký kích hoạt luồng thanh toán trả trước qua PayOS (`payment_url`).

### 2.5. Màn hình `SF-05`: Thanh Toán & Khiếu Nại (`/checkout`, `/orders/:id/complaint`)

- **Checkout**: Nhập địa chỉ nhận hàng, tự động hiển thị khoảng cách km nội suy theo Haversine và phí ship, ô tích lũy cấn trừ điểm thưởng 1%, lựa chọn trả tiền mặt COD hoặc quét mã VietQR PayOS (hiển thị đồng hồ đếm ngược 15 phút).
- **Khiếu nại 24h**: Chỉ kích hoạt trong vòng 24 giờ sau khi đơn nhận thành công; form yêu cầu mô tả lý do dập nát, **bắt buộc tải 1 đến 5 ảnh** (`proof_image_urls`) và **tùy chọn tải tối đa 1 video ngắn** ($\le 15\text{s}$, $\le 15\text{MB}$).

---

## 3. Câu Lệnh Mẫu Tạo Giao Diện Bằng AI

Nhà thiết kế có thể sao chép trực tiếp các đoạn mô tả dưới đây vào công cụ tạo mẫu AI:

```text
Prompt SF-03 (Traceability Mobile Screen):
Design a clean, mobile-first traceability screen (390px width) in Vietnamese for an organic farm at route /trace/BATCH-20261112-TOM-01.
Theme: Organic minimalism, warm background (#FAF8F5), forest green brand color (#15803D), white rounded cards.
Sections:
1. Header Card: Brand "GreenRoots Farm", verified badge "VietGAP & Append-only Verified", product "Ca chua bi huu co", Batch Code "BATCH-20261112-TOM-01", Harvest Date "12/11/2026", Expiry Date "19/11/2026".
2. Soil & Water Card: Plot Code "PLOT-A1", badges for Soil pH 6.5 (Dat chuan) and Water Heavy Metals Pass.
3. Cultivation Timeline: Vertical timeline entries (Gieo hat, Bon phan huu co, Tuoi nuoc, Thu hoach) with engineer name, timestamp, and field photos.
```

---

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Quy chuẩn Design Tokens: [[UI_Design_System_and_Tokens_Specification]]
- Đặc tả màn hình Backoffice: [[Backoffice_Screen_Specs]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Đặc tả User Stories MoSCoW: [[MoSCoW_User_Stories_Specification]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
