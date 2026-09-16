---
tags:
  [
    type/audit,
    topic/business-domain,
    topic/hyundai-ecommerce,
    architecture/b2b-rfq,
  ]
date: 2026-09-12
aliases:
  [Bussiness Domain Audit, Kien Truc Nghiep Vu Thuc Te, Legacy Code Inventory]
status: completed
---

# Báo Cáo Khảo Sát Nghiệp Vụ Thực Tế & Rà Soát Mã Nguồn Dự Án Hyundai E-Commerce

> **Mục đích tài liệu:** Xác lập bản đồ nghiệp vụ thực tế (Ground-Truth Business Domain) của dự án dựa trên kết quả quét mã nguồn thực tế tại `backend/`, `admin/` và `storefront/`. Phân định rõ ràng giữa luồng nghiệp vụ cốt lõi hiện tại (B2B Báo Giá & Admin CMS) với các thành phần cũ (B2C Orders, Cart, Payments, Better Auth) để phục vụ định hướng phát triển, dọn dẹp mã nguồn và chuẩn bị phỏng vấn.

---

## 1. Bản Chất Nghiệp Vụ Thực Tế Của Dự Án (The True Business Model)

Khác với các sàn thương mại điện tử bán lẻ tiêu dùng (B2C E-commerce) thông thường, Hyundai E-Commerce là một **Hệ Thống Đàm Phán Báo Giá & Quản Trị Phân Phối Thiết Bị Máy Công Nghiệp B2B (B2B Industrial Machinery Quotation & Negotiation Platform)**.

Sản phẩm kinh doanh là các thiết bị giá trị cao (máy phát điện công nghiệp 3 pha, máy bơm công nghiệp, máy nông nghiệp). Đặc thù của ngành hàng này:

- Giá cả phụ thuộc vào số lượng, cấu hình kỹ thuật tùy chỉnh và chính sách chiết khấu từng thời điểm.
- Khách hàng doanh nghiệp không thanh toán ngay qua cổng thanh toán trực tuyến mà cần quy trình: **Gửi yêu cầu báo giá (RFQ) -> Sales liên hệ đàm phán giá -> Thống nhất điều khoản thương mại (bảo hành, tiến độ thanh toán, giao hàng) -> Xuất văn bản báo giá đóng dấu/ký tên hoặc xuất Excel**.

### 1.1. Luồng Storefront (Customer RFQ Portal - Kênh Tiếp Nhận)

- **Bản chất:** Storefront đóng vai trò là Catalog giới thiệu sản phẩm và cổng tiếp nhận yêu cầu báo giá (Request for Quotation - RFQ).
- **Hoàn toàn KHÔNG CÓ:**
  - Không có giỏ hàng thương mại điện tử (B2C Shopping Cart).
  - Không có trang thanh toán (Checkout) hay cổng thanh toán trực tuyến (PayOS).
  - Không có đăng ký/đăng nhập tài khoản khách hàng bắt buộc.
  - Các route `/cart`, `/checkout`, `/orders` đều rơi vào catch-all và trả về 404 `notFound()`.
- **Hành trình khách hàng thực tế:**
  1. Khách hàng xem danh mục máy móc tại `/products` hoặc `/products/category/[slug]`.
  2. Tại trang chi tiết sản phẩm `/products/[slug]`, khách hàng bấm "Báo giá ngay" hoặc "Thêm vào danh sách báo giá".
  3. Danh sách sản phẩm quan tâm được lưu trữ phía client bằng Zustand Persisted Store (`use-quote.ts`, key `hyundai-b2b-quote-list`). Nút "Mua ngay" trên thẻ sản phẩm thực chất là shortcut thêm sản phẩm vào danh sách báo giá và chuyển hướng tới trang `/quote`.
  4. Tại trang `/quote`, khách hàng điền biểu mẫu liên hệ doanh nghiệp: Tên khách hàng, Số điện thoại, Email, Tên công ty, Mã số thuế (MST), Địa chỉ giao hàng, Ghi chú yêu cầu.
  5. Khi submit, Next.js Server Action `quote.action.ts` gọi trực tiếp API Backend: `POST /api/v1/quotes` (Public endpoint, rate-limited 10 request/phút).
  6. Khách hàng nhận được mã số báo giá (ví dụ: `BG-202609-0001`) và thông báo nhân viên kinh doanh sẽ liên hệ.

### 1.2. Luồng Admin CMS (The Engine - Trung Tâm Điều Hành Nghiệp Vụ)

Admin CMS (`admin/`) là trái tim thực sự của toàn bộ dự án, nơi diễn ra toàn bộ các hoạt động thương mại:

1. **Quản lý danh sách báo giá (`admin/app/[locale]/(dashboard)/quotes/`):**
   - Danh sách phân trang toàn bộ báo giá với bộ lọc trạng thái và tìm kiếm.
2. **Soạn thảo báo giá mới (`QuoteComposer` tại `quotes/new/`):**
   - Nhân viên kinh doanh có thể chủ động tạo báo giá cho khách hàng vãng lai hoặc đại lý gọi điện thoại tới hotline.
   - Form gồm: Thông tin khách hàng doanh nghiệp, bảng chọn thiết bị (hỗ trợ cả sản phẩm có sẵn trong catalog lẫn sản phẩm tùy chỉnh custom-item ngoài danh mục), và trình biên tập điều khoản thương mại.
3. **Buồng lái đàm phán giá (`QuotePricingCockpit` tại `quotes/[id]/`):**
   - Nhân viên xem được giá bán lẻ niêm yết (Retail Price).
   - Xem giá khách hàng kỳ vọng (Customer Requested Price).
   - Nhập giá bán thỏa thuận (Agreed Unit Price).
   - Điều chỉnh tỷ lệ chiết khấu (Discount %) và thuế suất VAT (mặc định 10%).
   - Biên tập 5 điều khoản thương mại chuẩn công nghiệp:
     - Thời hạn hiệu lực báo giá (`validityDays`).
     - Tiến độ thanh toán (`paymentSchedule`, ví dụ: tạm ứng 30%, thanh toán 70% khi giao hàng).
     - Điều khoản bảo hành (`warrantyTerms`, ví dụ: 24 tháng hoặc 2000 giờ chạy).
     - Thời gian giao hàng (`deliveryTime`).
     - Địa điểm giao hàng (`deliveryLocation`).
4. **Máy trạng thái báo giá (Quotation State Machine):**
   - `DRAFT`: Soạn thảo nội bộ bởi nhân viên kinh doanh.
   - `SUBMITTED`: Khách hàng vừa gửi từ Storefront.
   - `NEGOTIATING`: Đang trao đổi, điều chỉnh giá thỏa thuận.
   - `APPROVED`: Hai bên chốt giá và điều khoản.
   - `REJECTED`: Khách không đồng ý giá hoặc hủy yêu cầu.
   - `EXPIRED`: Quá hạn thời gian hiệu lực.
5. **Xuất bản tài liệu thương mại:**
   - **Bản in PDF (`/quotes/[id]/export/`):** Giao diện dàn trang chuẩn A4 tiếng Việt với đầy đủ thông tin doanh nghiệp, bảng báo giá chi tiết, điều khoản thanh toán, bảo hành và 2 ô ký tên đóng dấu (Đại diện bên mua / Đại diện bên bán).
   - **Xuất Excel (`backend/src/modules/quotes/services/quote-excel.service.ts`):** Sử dụng `exceljs` dựng bảng tính 8 cột, tự động chèn công thức Excel `SUM`, định dạng tiền tệ VND, đọc tổng số tiền thành chữ bằng tiếng Việt ("Bằng chữ: ..."), phục vụ bộ phận kế toán.
6. **Quản trị danh mục máy móc công nghiệp (`admin/app/[locale]/(dashboard)/products/`):**
   - Quản lý sản phẩm đa ngôn ngữ (`vi`/`en`) thông qua bảng liên kết `product_translations`.
   - Quản lý bảng thông số kỹ thuật (Specifications: công suất KVA, điện áp, dung tích xi-lanh, loại nhiên liệu).
   - Quản lý bộ sưu tập hình ảnh lưu trữ trên Cloudinary.
   - Bật/tắt cờ `isQuoteOnly` (chỉ báo giá, không hiển thị giá niêm yết).

---

## 2. Kiến Trúc Xác Thực Thực Tế (Authentication Architecture)

### 2.1. Đính chính về Better Auth

- **Hiện trạng:** **Better Auth hoàn toàn KHÔNG TỒN TẠI trong dự án.** Mọi tài liệu hoặc ghi chú trước đây nhắc đến Better Auth đều là phác thảo cũ đã bị bãi bỏ.
- Trong `package.json` của cả 3 ứng dụng đều không có bất kỳ dependency nào liên quan đến Better Auth.

### 2.2. Hệ thống xác thực thực tế (Hand-rolled NestJS JWT + RTR)

Hệ thống sử dụng cơ chế xác thực JWT chuẩn mực công nghiệp được xây dựng trực tiếp trong `backend/src/modules/auth/`:

- **Access Token:**
  - Định dạng Stateless JWT ký bởi `@nestjs/jwt` sử dụng secret `JWT_SECRET`.
  - Mang payload: `{ sub: userId, email: user.email, role: user.role }`.
  - Thời hạn ngắn (mặc định cấu hình qua `JWT_ACCESS_EXPIRES_IN`).
  - Được kiểm tra bởi `JwtAuthGuard` (`backend/src/common/guards/jwt-auth.guard.ts`).
- **Refresh Token (Opaque Token với SHA-256 Hash):**
  - Không phải JWT, mà là chuỗi ngẫu nhiên 32-byte hex sinh bằng `crypto.randomBytes(32).toString("hex")`.
  - Token gốc được gửi về client, trong cơ sở dữ liệu (bảng `refresh_tokens`) chỉ lưu bản hash **SHA-256** của token để chống lộ token nếu DB bị rò rỉ.
  - Cơ chế **Rotate-on-use (RTR)**: Mỗi lần client gọi `POST /api/v1/auth/refresh`, refresh token cũ bị thu hồi ngay lập tức và một cặp token mới được sinh ra.
  - Dọn dẹp tự động: `TokenCleanupService` chạy cron job định kỳ dọn sạch các token đã hết hạn trong database.
- **Phân quyền (RBAC):**
  - `RolesGuard` (`backend/src/common/guards/roles.guard.ts`) kết hợp decorator `@Roles(Role.ADMIN, Role.SALES)` kiểm tra trường `role` trong payload JWT, ném lỗi 403 Forbidden nếu không đủ thẩm quyền.
- **Cơ chế lưu trữ và làm mới ở Admin CMS:**
  - Đăng nhập `POST /api/v1/auth/login` lưu 2 token vào Cookie có cờ `HttpOnly`: `adminAccessToken` và `adminRefreshToken`.
  - Một cookie không-HttpOnly `adminUser` chứa thông tin cơ bản `{ id, email, fullName, role }` phục vụ hiển thị tên trên thanh header.
  - Trong `admin/src/lib/api-client.ts`, middleware tự động kiểm tra: nếu `adminAccessToken` còn hạn dưới 60 giây, nó tự động gọi `POST /auth/refresh` bằng raw `fetch()` và cập nhật token mới một cách trong suốt.

---

## 3. Phân Loại Toàn Diện Các Thành Phần Trong Mã Nguồn

Dựa trên việc kiểm tra chéo giữa code backend và các màn hình thực tế ở frontend:

```
+-------------------------------------------------------------------+
|                        TOÀN BỘ MÃ NGUỒN                           |
+-------------------------------------------------------------------+
  |
  +---> [1] QUAN TRỌNG & CỐT LÕI (Core Active Business)
  |     - Quotes Module (Báo giá, FSM, PDF/Excel, Negotiation)
  |     - Catalog Module (Products, Translations, Specs, Categories)
  |     - Auth & Users Module (JWT, Refresh Token Rotation, RBAC)
  |     - Leads Module (Thu thập khách hàng tiềm năng)
  |     - Admin CMS (Dashboard điều hành báo giá & catalog)
  |     - Storefront RFQ (Kênh gửi yêu cầu báo giá B2B)
  |
  +---> [2] THỪA & TỒN DƯ CẦN DỌN DẸP / ĐÓNG BĂNG (Redundant / Legacy)
  |     - Cart Module (Đã đánh dấu @deprecated, frontend không gọi)
  |     - Orders Module (B2C guest order, B2B instant checkout)
  |     - Payments & PayOS Module (Thanh toán online cổng VietQR)
  |
  +---> [3] TÀI LIỆU CŨ CẦN VIẾT LẠI TRONG SECOND-BRAIN (Outdated Docs)
  |     - Better_Auth_Session_Flow.md (Sai hoàn toàn với thực tế)
  |     - Database_Payment_Design.md (Mô tả Star Schema B2C cũ)
  |     - B2B_Corporate_Hierarchy_Design.md (Mô tả duyệt đơn hàng cũ)
  |     - Order_Pagination_Mechanism.md (Cần chuyển trọng tâm sang Quotes)
  |
  +---> [4] CHƯA CẦN DÙNG ĐẾN (Unused / Pending Future Phase)
        - Chức năng chuyển báo giá thành đơn hàng (approve-to-order)
        - Quản lý công nợ đại lý tự động (debt repayments qua PayOS)
        - Các chỉ số KPI doanh thu trên Dashboard Overview (hiện đang hard-code 0)
```

### 3.1. Nhóm 1: Quan Trọng & Cốt Lõi (Core & Active Business)

Đây là các module tạo nên 100% giá trị nghiệp vụ hiện tại của dự án:

1. **Module `quotes` (`backend/src/modules/quotes/` + `admin/src/features/quotes/` + `storefront/src/features/quote/`):**
   - Toàn bộ quy trình tiếp nhận RFQ, đàm phán giá, máy trạng thái báo giá, tính toán VAT/chiết khấu, xuất PDF in ấn và xuất file Excel kế toán.
2. **Module `catalog` (`backend/src/modules/catalog/`):**
   - Quản lý máy móc công nghiệp, hệ thống dịch đa ngôn ngữ `product_translations`, bảng thông số kỹ thuật (Specifications).
3. **Module `auth` & `users` (`backend/src/modules/auth/`):**
   - Quản lý tài khoản Admin/Sales, xác thực JWT, bảo vệ API bằng Guards.
4. **Module `leads` (`backend/src/modules/leads/`):**
   - Tiếp nhận thông tin khách hàng muốn tư vấn nhanh từ form liên hệ Storefront.
5. **Module `warehouse` (`backend/src/modules/warehouse/`):**
   - Quản lý số lượng máy móc tồn thực tế tại các kho hàng của công ty để nhân viên kinh doanh biết tình trạng hàng khi làm báo giá.

### 3.2. Nhóm 2: Thừa & Tồn Dư Từ Luồng B2C Cũ (Redundant / Legacy Code)

Đây là tàn tích từ giai đoạn đầu khi dự án còn định hướng làm website thương mại điện tử bán lẻ:

1. **Module `cart` (`backend/src/modules/cart/`):**
   - `CartController` đã được gắn cờ `@deprecated` với ghi chú rõ ràng: _"Legacy B2C cart controller, currently dormant as the platform transitioned to a B2B RFQ model"_.
   - Storefront không hề gọi bất kỳ endpoint nào của `cart`, mà dùng `use-quote.ts` (Zustand) để gom sản phẩm báo giá.
2. **Module `payments` (`backend/src/modules/payments/`):**
   - Tích hợp cổng PayOS tạo link thanh toán VietQR và webhook xử lý tiền về.
   - Luồng báo giá B2B máy công nghiệp không dùng PayOS. Hợp đồng tiền tỷ được chuyển khoản ngân hàng theo tiến độ hợp đồng (30% - 70%), kế toán kiểm tra tài khoản doanh nghiệp trực tiếp chứ không qua cổng thanh toán QR bán lẻ.
3. **Module `orders` (`backend/src/modules/orders/`):**
   - Hệ thống tạo đơn hàng bán lẻ (`createGuestOrder`), trừ kho tức thời, máy trạng thái đơn hàng (`PENDING` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`).
   - Storefront không có nút thanh toán đặt hàng. Trong Admin có màn hình `orders/` nhưng các nút giao vận và thanh toán tiền mặt đều là code phụ trợ/stub.

### 3.3. Nhóm 3: Tài Liệu Cũ Cần Viết Lại Trong Second-Brain

Các tài liệu hiện có trong `second-brain/` cần được cập nhật khẩn cấp để không gây hiểu nhầm:

1. **`second-brain/Auth/Better_Auth_Session_Flow.md`:** Cần xóa hoặc viết lại thành **`NestJS_JWT_Session_Flow.md`**.
2. **`second-brain/Database/Database_Payment_Design.md`:** Chứa thiết kế Star Schema cho Payment B2C cũ, không phản ánh luồng thương mại B2B.
3. **`second-brain/Database/B2B_Corporate_Hierarchy_Design.md`:** Mô tả luồng phân cấp đơn hàng duyệt giữa Approver và Purchaser của hệ thống bán lẻ cũ.
4. **`second-brain/Workflows/Order_Pagination_Mechanism.md`:** Minh họa bằng Order Pagination. Cần giữ lại thuật toán Keyset/Cursor nhưng đổi ngữ cảnh ví dụ sang Danh sách Báo Giá (Quotes) hoặc Sản Phẩm (Products).

### 3.4. Nhóm 4: Chưa Cần Dùng Đến (Unused / Pending Future Scope)

1. **Endpoint `POST /api/v1/quotes/:id/approve-to-order`:**
   - Code backend có hỗ trợ chuyển báo giá đã duyệt thành 1 Order. Tuy nhiên trong bối cảnh hiện tại, nghiệp vụ dừng lại ở khâu chốt báo giá, xuất PDF/Excel cho khách ký hợp đồng bên ngoài.
2. **Hệ thống thanh toán nợ tự động (`repay-debt`):**
   - Code có bảng `debt_repayments` và trường `currentDebt` trong user để theo dõi công nợ đại lý, nhưng chưa có màn hình giao diện người dùng hoàn chỉnh.

---

## 4. Hành Động Khuyến Nghị Tiếp Theo

1. **Về mặt Mã Nguồn (Codebase Hygiene):**
   - **Đóng băng (Freeze) hoặc cách ly:** Không xóa vội các file của `orders` hay `payments` để tránh làm gãy các dependency tham chiếu ngầm (như `approveAndConvertToOrder`), nhưng đánh dấu rõ ràng là _Dormant/Legacy Modules_.
   - **Tập trung 100% tài nguyên:** Hoàn thiện trải nghiệm quản trị báo giá ở Admin CMS (Quote Composer, Pricing Cockpit, Excel/PDF rendering).
2. **Về mặt Tài Liệu (Second-Brain & README):**
   - Cập nhật file `000_Hyundai_MOC.md` trỏ tới báo cáo nghiệp vụ mới này.
   - Viết lại tài liệu `Auth` trong Second-Brain: Thay `Better_Auth` bằng luồng **NestJS Custom JWT + Refresh Token Rotation**.
   - Cập nhật `README.md` chính: Định vị dứt khoát dự án là **B2B Industrial Machinery Quotation & Negotiation System**, làm nổi bật module Báo Giá và Admin CMS thay vì quảng bá giỏ hàng hay cổng PayOS.
