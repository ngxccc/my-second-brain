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

- **Bố cục (Grocery-First Layout)**: Header cố định xanh lá (`#15803D`) chứa thanh tìm kiếm lớn, bộ chọn địa chỉ giao nhận (ước lượng khoảng cách Haversine cho 24 quận/huyện TP.HCM), nút Giỏ hàng (`Sheet` drawer), thanh điều hướng nhanh; thân trang gồm Hero + tra cứu nhanh mã Lô QR, kệ `DEAL TƯƠI TRONG NGÀY` (`< 48h`, giảm `50%`), các kệ rau củ và mục Gói định kỳ có nút `MUA NGAY` / `[- 1 +]` trực tiếp trên thẻ.
- **Trường dữ liệu & Hiển thị tồn kho**: Dùng `@greenroots/ui` và `@greenroots/shared`. Hàng thường hiển thị `{unitLabel} · Còn {availableQuantity} {unit}` (không vẽ thanh tiến độ giả); riêng sản phẩm thuộc kệ `DEAL TƯƠI TRONG NGÀY` hiển thị thanh nhiệt đỏ (`Đã xuất X% | Còn Y {unit}`) tính trên các lô cận hạn đang `IN_STOCK`. Tên nông trại, địa chỉ, hotline đọc từ `FARM_METADATA` / `BUSINESS_RULES`.

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

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Quy chuẩn Design Tokens: [[UI_Design_System_and_Tokens_Specification]]
- Đặc tả màn hình Backoffice: [[Backoffice_Screen_Specs]]
