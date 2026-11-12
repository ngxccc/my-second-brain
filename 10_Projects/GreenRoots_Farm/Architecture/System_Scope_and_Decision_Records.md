---
tags: [type/project, status/active]
date: 2026-11-11
description: "Biên bản ghi nhận các quyết định kiến trúc cốt lõi định hình phạm vi đồ án Thương mại điện tử Nông sản sạch."
---

# System Scope and Decision Records

## TL;DR

- **Bản chất**: Tập hợp các thỏa thuận kỹ thuật xác lập ranh giới chức năng, cấu trúc dữ liệu và công nghệ triển khai cho toàn bộ hệ thống.
- **Mục đích**: Chốt chặt các phương án kỹ thuật từ Tuần 1 nhằm ngăn chặn hiện tượng phình to phạm vi và xung đột nghiệp vụ khi code.
- **Điểm mấu chốt**: Nếu không cô lập Batch Inventory và FEFO khỏi luồng giỏ hàng thông thường, toàn bộ hệ thống sẽ gãy tính toàn vẹn dữ liệu.

---

## Bối cảnh và Thách thức Nghiệp vụ

Đồ án đặt trọng tâm vào việc giải quyết bài toán vận hành thực tế của một nông trại hữu cơ đơn lẻ:

- Khách hàng có nhu cầu sử dụng thực phẩm an toàn nhưng thiếu công cụ kiểm chứng quy trình sản xuất tại chỗ.
- Sản phẩm tươi sống có chu kỳ vòng đời ngắn, dễ hư hỏng nếu không có cơ chế cảnh báo hạn dùng chính xác.
- Mô hình bán hàng trực tiếp loại bỏ trung gian đòi hỏi tích hợp chặt chẽ giữa nhật ký canh tác và quản lý kho.

---

## Quyết định 1 - Phạm vi MoSCoW và Cam kết Nghiệm thu

Xác định ranh giới tính năng dựa trên bảng yêu cầu Tuần 1 để đảm bảo điểm số tối đa:

- **Lựa chọn đã chốt**: Khóa toàn bộ tính năng quản lý tồn kho theo Batch, thuật toán xuất kho FEFO và tạo quét mã QR vào nhóm Must-have.
- **Phương án bị loại bỏ**: Đưa Batch Inventory xuống nhóm Should-have để chỉ làm kho tổng đơn giản.
- **Lý do kỹ thuật**: Nếu chỉ quản lý kho theo số lượng tổng, hệ thống sẽ thoái hóa thành một sàn thương mại điện tử đại trà, vi phạm mục tiêu cốt lõi của đề tài.

---

## Quyết định 2 - Quản lý Tồn kho theo Batch và Trừ kho FEFO

Quy định thời điểm và cơ chế khấu trừ số lượng sản phẩm trong kho:

- **Lựa chọn đã chốt**: Khi khách hàng thêm vào giỏ hàng và thanh toán, hệ thống chỉ kiểm tra tổng tồn khả dụng (`sum(batches.available_quantity) >= cart.quantity`). Việc phân bổ chi tiết vào từng Batch theo thuật toán FEFO chỉ diễn ra khi Sales bấm xác nhận đơn hàng đóng gói.
- **Phương án bị loại bỏ**: Khóa Batch cụ thể ngay từ giỏ hàng hoặc trừ kho lúc tạo đơn chưa thanh toán.
- **Lý do kỹ thuật**: Khách hàng chỉ chọn sản phẩm chứ không chọn lô hàng. Trừ kho sớm ở trạng thái chờ thanh toán gây hiện tượng giữ hàng ảo và đòi hỏi cơ chế rollback phức tạp khi khách hủy đơn.

---

## Quyết định 3 - Cơ chế Subscription và Tự sinh Đơn hàng

Thiết kế quy trình xử lý gói định kỳ hàng tuần cho khách hàng:

- **Lựa chọn đã chốt**: Áp dụng mô hình trả trước (Prepaid) toàn bộ gói tháng hoặc tùy chọn COD theo từng lần giao. Hệ thống dùng Scheduler định kỳ quét lịch đăng ký để tạo thực thể Order tự động.
- **Phương án bị loại bỏ**: Tích hợp trừ tiền tự động định kỳ (Recurring Billing) qua cổng thanh toán trực tuyến.
- **Lý do kỹ thuật**: Các cổng thanh toán nội địa môi trường Sandbox không cung cấp tính năng tự động trừ tiền thẻ định kỳ cho tài khoản nhà phát triển cá nhân.

---

## Quyết định 4 - Chiến lược Adapter Pattern cho Dịch vụ Bên thứ ba

Phương án xử lý các kết nối hạ tầng bên ngoài để đảm bảo độ ổn định khi nghiệm thu:

- **Lựa chọn đã chốt**: Triển khai Adapter Pattern kết hợp Strategy Pattern cung cấp hai bộ driver song song: `RealDriver` cho môi trường thực tế (tích hợp PayOS qua Webhook VietQR) và `MockDriver` cho môi trường nội bộ.
- **Phương án bị loại bỏ**: Gọi trực tiếp API bên thứ ba bên trong tầng nghiệp vụ của Service hoặc phụ thuộc vào cổng thanh toán truyền thống thiếu sandbox tự động.
- **Lý do kỹ thuật**: Ngăn ngừa rủi ro rớt mạng, lỗi hạn mức gọi API, hoặc gián đoạn dịch vụ làm tê liệt luồng thanh toán và tính phí giao hàng khi bảo vệ đồ án.

---

## Quyết định 5 - Lựa chọn Tech Stack và Phân quyền 6 Roles

Quy chuẩn công nghệ nền tảng và kiến trúc bảo mật:

- **Lựa chọn đã chốt**: TypeScript đồng nhất cho cả hệ thống. Backend sử dụng NestJS với Drizzle ORM, cơ sở dữ liệu PostgreSQL, Redis cho caching/rate-limiting/blacklist, Cloudinary cho lưu trữ media, và PayOS cho cổng thanh toán. Frontend hợp nhất trên một ứng dụng Next.js (App Router) duy nhất sử dụng Route Groups: `(storefront)` cho khách hàng (SSR/Mobile-first) và `(dashboard)` cho nhân viên nội bộ (`'use client'`).
- **Cơ chế phân quyền**: Sử dụng Role-Based Access Control chặt chẽ thông qua NestJS `Guards` và custom decorators gắn tại từng controller endpoint.
- **Phân cấp 6 Roles nghiệp vụ**:
  - `Guest`: Người dùng chưa xác thực, chỉ được xem danh mục sản phẩm và nhật ký công khai.
  - `Customer`: Khách hàng mua lẻ, đăng ký gói định kỳ, tích lũy điểm và gửi yêu cầu bồi hoàn.
  - `Farm Staff`: Kỹ sư nông trại chỉ phụ trách mùa vụ, cập nhật nhật ký canh tác, tạo lô hàng và in mã QR. Không có quyền xem dữ liệu tài chính hoặc đơn hàng.
  - `Sales`: Nhân viên kinh doanh xác nhận đơn hàng, điều phối giao nhận, chạy thuật toán FEFO xuất kho và giải quyết khiếu nại.
  - `Admin`: Quản lý nông trại vận hành hàng ngày, giám sát nhân sự, theo dõi tỷ lệ hao hụt và xử lý khiếu nại cấp cao.
  - `SuperAdmin`: Chủ sở hữu nông trại, nắm toàn quyền hệ thống, cấu hình tham số thanh toán, tạo tài khoản quản trị và xem báo cáo tài chính ròng.

---

## Ma trận Phân quyền Vai trò Người dùng

Bảng đối chiếu quyền hạn thao tác trên các phân hệ chức năng:

| Phân hệ chức năng                   | Guest | Customer | Farm Staff | Sales   | Admin   | SuperAdmin |
| ----------------------------------- | ----- | -------- | ---------- | ------- | ------- | ---------- |
| Xem sản phẩm & Nhật ký canh tác     | Read  | Read     | Read       | Read    | Read    | Read       |
| Đặt hàng & Đăng ký gói định kỳ      | None  | Create   | None       | None    | None    | Create     |
| Quản lý Mùa vụ & Cập nhật Nhật ký   | None  | None     | CRUD       | None    | CRUD    | CRUD       |
| Tạo Lô hàng (Batch) & In mã QR      | None  | None     | CRUD       | None    | CRUD    | CRUD       |
| Xác nhận đơn hàng & Xuất kho FEFO   | None  | None     | None       | Execute | Execute | Execute    |
| Ghi nhận Xuất hủy & Hao hụt         | None  | None     | Create     | Create  | CRUD    | CRUD       |
| Xử lý Khiếu nại đổi trả             | None  | Create   | None       | Execute | CRUD    | CRUD       |
| Báo cáo Tài chính & Doanh thu Ròng  | None  | None     | None       | None    | Read    | CRUD       |
| Quản lý Tài khoản & Phân quyền User | None  | None     | None       | None    | None    | CRUD       |

---

## Quyết định 6 - Bảng Trung Gian Phân Bổ Lô Hàng (Batch Allocations) (Q19)

- **Vấn đề**: Một dòng sản phẩm trong đơn hàng ($5\text{ kg}$ cà chua) có thể được thuật toán FEFO phân bổ từ 2 Lô khác nhau ($2\text{ kg}$ Lô A cận hạn và $3\text{ kg}$ Lô B kế tiếp).
- **Lựa chọn đã chốt**: Thiết lập bảng quan hệ trung gian **`batch_allocations`** (`id`, `order_item_id`, `batch_id`, `allocated_quantity`). Bảng `order_items` giữ nguyên 1 dòng duy nhất đại diện cho món hàng của khách.
- **Lý do kỹ thuật**: Tách biệt rõ ràng giữa trải nghiệm người dùng (hóa đơn đơn giản) và cơ chế vận hành kho (phiếu nhặt hàng chi tiết từng gram theo đúng nguyên tắc FEFO).

---

## Quyết định 7 - Tính Bất Biến của Nhật Ký Canh Tác (Append-Only Log) (Q20)

- **Vấn đề**: Ngăn chặn hành vi can thiệp hoặc sửa đổi hồi tố nhật ký canh tác nhằm che giấu sai phạm hoặc gian lận chứng chỉ VietGAP/USDA.
- **Lựa chọn đã chốt**: Áp dụng mô hình **Sổ cái bổ sung (Append-Only Log)** cho bảng `farming_logs`. Cơ sở dữ liệu nghiêm cấm lệnh `UPDATE` và `DELETE` đối với bản ghi nhật ký. Mọi sửa đổi phải được thực hiện bằng cách tạo bản ghi mới với loại hành động là `CORRECTION` (Đính chính) kèm lý do giải trình.
- **Lý do kỹ thuật**: Đảm bảo tính minh bạch tuyệt đối của dữ liệu truy xuất nguồn gốc khi khách hàng quét mã QR đối soát.

---

## Quyết định 8 - Chiến Lược Caching Redis và Tính Nhất Quán Tồn Kho (Q21)

- **Vấn đề**: Rủi ro bán khống hàng (Overselling) do lệch dữ liệu giữa bộ nhớ đệm Redis và cơ sở dữ liệu PostgreSQL khi nhiều khách hàng cùng thanh toán.
- **Lựa chọn đã chốt**: **Không lưu số lượng tồn kho khả dụng (`available_quantity`) vào Redis**. Dữ liệu tồn kho luôn được truy vấn trực tiếp từ PostgreSQL thông qua giao dịch có khóa hàng cấp cơ sở dữ liệu (`SELECT ... FOR UPDATE`).
- **Lý do kỹ thuật**: Nông sản tươi sống có vòng đời ngắn và biến động liên tục; tính nhất quán dữ liệu (Data Consistency) được ưu tiên tuyệt đối so với tốc độ đọc ghi cache. Redis chỉ phục vụ: Lưu Token Blacklist (đăng xuất), Rate Limiting, và Cache danh mục sản phẩm tĩnh.

---

## Quyết định 9 - Quy Trình Phê Duyệt Xuất Hủy Hao Hụt 2 Bước (Q22)

- **Vấn đề**: Ngăn chặn thất thoát và gian lận nội bộ khi nhân viên tự ý trừ kho với lý do hàng dập nát hư hỏng.
- **Lựa chọn đã chốt**: Thiết lập quy trình phê duyệt 2 bước (**Two-step Approval Workflow**): Nhân viên kho lập phiếu đề xuất xuất hủy (`waste_logs`) với trạng thái `PENDING_APPROVAL`, bắt buộc chọn Lô hàng, nhập số lượng và tải ảnh chụp thực tế. Chỉ có tài khoản **Admin** hoặc **SuperAdmin** mới có quyền phê duyệt để trừ tồn kho thực tế.
- **Lý do kỹ thuật**: Đảm bảo kiểm soát nội bộ chặt chẽ (Internal Control) và minh bạch hóa tỷ lệ hao hụt theo chuẩn ERP doanh nghiệp.

---

## Quyết định 10 - Quản Lý Dự Án Monorepo (Q23)

- **Vấn đề**: Chiến lược tổ chức mã nguồn cho nhóm 5 người (Backend NestJS + Frontend Next.js).
- **Lựa chọn đã chốt**: Sử dụng cấu trúc **Monorepo** trên một kho mã nguồn GitHub duy nhất (`greenroots-farm`). Phân tách rõ ràng thành các workspace: `apps/api` (NestJS Backend Core) và `apps/web` (Next.js Storefront & Dashboard).
- **Lý do kỹ thuật**: Đồng bộ hóa 100% các kiểu dữ liệu dùng chung (TypeScript Interfaces/DTOs), quản lý tập trung biến môi trường và tài liệu đồ án, hỗ trợ nhóm kiểm soát toàn bộ vòng đời sản phẩm tại một nơi duy nhất.

---

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Chi tiết kỹ thuật Adapter Pattern: [[Third_Party_API_Adapter_Pattern_Strategy]]
- Kiến trúc hệ thống toàn cục: [[000_System_Structure]]
