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
- **Chiến lược phòng thủ 3 tầng (Defense in Depth)**:
  1. _Tầng 1 (API)_: Controller không expose bất kỳ route nào có phương thức `PATCH`, `PUT`, hoặc `DELETE`.
  2. _Tầng 2 (DB Engine)_: Cài đặt PostgreSQL Trigger `BEFORE UPDATE OR DELETE` chặn đứng câu lệnh ở cấp lõi CSDL:
     ```sql
     CREATE OR REPLACE FUNCTION prevent_farming_log_mutation() RETURNS TRIGGER AS $$
     BEGIN RAISE EXCEPTION 'FARMING_LOG_IMMUTABLE: Nghiem cam UPDATE/DELETE nhat ky canh tac!'; END;
     $$ LANGUAGE plpgsql;
     CREATE TRIGGER trg_immutable_farming_logs BEFORE UPDATE OR DELETE ON farming_logs FOR EACH ROW EXECUTE FUNCTION prevent_farming_log_mutation();
     ```
  3. _Tầng 3 (Nghiệp vụ)_: Chỉ cho phép ghi đè thông tin bằng hành động `correction` để bảo toàn lịch sử kiểm toán.
- **Rào chắn tải lên tệp đa phương tiện (Media Guardrails)**: Giới hạn tối đa 3 tệp media/log, video $\le 15$s ($\le 15$MB), ảnh tự động nén WebP $\le 300$KB phía client để bảo vệ hạn mức Cloudinary.
- **Lý do kỹ thuật**: Đảm bảo tính minh bạch tuyệt đối của dữ liệu truy xuất nguồn gốc khi khách hàng quét mã QR đối soát.

---

## Quyết định 8 - Chiến Lược Caching Redis và Tính Nhất Quán Tồn Kho (Q21)

- **Vấn đề**: Rủi ro bán khống hàng (Overselling) do lệch dữ liệu giữa bộ nhớ đệm Redis và cơ sở dữ liệu PostgreSQL khi nhiều khách hàng cùng thanh toán.
- **Lựa chọn đã chốt**: **Không lưu số lượng tồn kho khả dụng (`available_quantity`) vào Redis**. Dữ liệu tồn kho luôn được truy vấn trực tiếp từ PostgreSQL thông qua giao dịch có khóa hàng cấp cơ sở dữ liệu (`SELECT ... FOR UPDATE`).
- **Lý do kỹ thuật**: Nông sản tươi sống có vòng đời ngắn và biến động liên tục; tính nhất quán dữ liệu (Data Consistency) được ưu tiên tuyệt đối so với tốc độ đọc ghi cache. Redis chỉ phục vụ: Rate Limiting, BullMQ Delay Jobs và Cache cấu hình nông trại (`farms` settings) / danh mục sản phẩm tĩnh.

---

## Quyết định 9 - Quy Trình Phê Duyệt Xuất Hủy Hao Hụt 2 Bước (Q22)

- **Vấn đề**: Ngăn chặn thất thoát và gian lận nội bộ khi nhân viên tự ý trừ kho với lý do hàng dập nát hư hỏng.
- **Lựa chọn đã chốt**: Thiết lập quy trình phê duyệt 2 bước (**Two-step Approval Workflow**): Nhân viên kho lập phiếu đề xuất xuất hủy (`waste_logs`) với trạng thái `PENDING_APPROVAL`, bắt buộc chọn Lô hàng, nhập số lượng và tải ảnh chụp thực tế. Chỉ có tài khoản **Admin** hoặc **SuperAdmin** mới có quyền phê duyệt để trừ tồn kho thực tế.
- **Lý do kỹ thuật**: Đảm bảo kiểm soát nội bộ chặt chẽ (Internal Control) và minh bạch hóa tỷ lệ hao hụt theo chuẩn ERP doanh nghiệp.

---

## Quyết định 10 - Quản Lý Dự Án Monorepo và Tách Biệt Storefront vs Backoffice (Q23)

- **Vấn đề**: Chiến lược tổ chức mã nguồn và phân tách giao diện người dùng cho nhóm 5 người (1 Backend NestJS + 2 phân hệ người dùng: Khách hàng công khai và Nội bộ doanh nghiệp gồm Farm Staff, Sales, Admin, SuperAdmin).
- **Lựa chọn đã chốt**: Sử dụng cấu trúc **Hybrid Monorepo** trên một kho mã nguồn GitHub duy nhất (`greenroots-farm`), phân tách thành 4 workspace:
  1. `apps/api`: **NestJS Backend Core** (REST API, Drizzle ORM, Cron Job, BullMQ).
  2. `apps/storefront`: **Next.js (App Router)** phục vụ Khách vãng lai & Khách hàng (Storefront D2C, SEO catalog, Checkout và trang truy xuất nguồn gốc `/trace/[batchCode]` tải nhanh dưới 2 giây).
  3. `apps/backoffice`: **React + Vite SPA** sử dụng đồng bộ hệ sinh thái **TanStack (TanStack Router + TanStack Query + TanStack Table)** phục vụ toàn bộ vận hành doanh nghiệp nội bộ (`Farm Staff` mobile-first ngoài ruộng, `Sales` điều phối FEFO, `Admin` duyệt hủy/analytics, `SuperAdmin` tài chính/RBAC). Không dùng tên `apps/admin` để phản ánh đúng phạm vi đa phòng ban.
  4. `packages/shared`: Chia sẻ 100% TypeScript Interfaces, Enums, Zod Schemas và DTO Contracts.
- **Lý do kỹ thuật**: Phù hợp với mô hình công nghiệp của các nền tảng Headless Commerce chạy NestJS/TypeScript (như Vendure dùng React + Vite + TanStack cho Dashboard và Next.js cho Storefront). Next.js giải quyết SSR/SEO cho Storefront và trang quét QR; Vite SPA kết hợp TanStack Router mang lại `beforeLoad()` RBAC guard, `validateSearch` Zod-typed cho bảng lọc đơn/Lô hàng và tách bạch hoàn toàn JS bundle nội bộ khỏi khách hàng bên ngoài.

---

## Quyết định 11 - Chiến Lược Tác Vụ Nền: Cron Job Kết Hợp BullMQ và Loại Bỏ Outbox Pattern (Q24)

- **Vấn đề**: Lựa chọn kiến trúc xử lý tác vụ định kỳ (sinh đơn định kỳ, quét HSD) và tác vụ hàng đợi bất đồng bộ (gửi email, hủy đơn trễ hạn 15 phút).
- **Lựa chọn đã chốt**:
  1. **Tác vụ định kỳ CSDL**: Dùng `@nestjs/schedule` (@Cron) thực thi trực tiếp trong PostgreSQL Transaction (04:00 sáng sinh đơn Subscription, 00:00 quét HSD Lô hàng).
  2. **Hàng đợi bất đồng bộ & Delayed Job**: Dùng **BullMQ + Redis** (`mail-queue` gửi email xác thực/hóa đơn với auto-retry 3 lần; `order-queue` thiết lập delayed job 15 phút tự động hủy đơn PayOS chưa thanh toán và nhả tồn kho).
  3. **Loại bỏ Outbox Pattern**: Không triển khai bảng `outbox_events` trong CSDL.
- **Lý do kỹ thuật**: Hệ thống là Monolith khép kín cho 1 nông trại, không phải Microservices đa CSDL. Việc không dùng Outbox giúp loại bỏ cơ chế polling gây nghẽn I/O CSDL, giữ CSDL chuẩn 16 bảng và đưa độ trễ API đăng ký/đặt hàng về mức dưới 30ms.

---

---

## Quyết định 12 - Kiến Trúc Phiên Đăng Nhập Bền Vững: Lưu Refresh Token Trên PostgreSQL và Sổ Địa Chỉ Khách Hàng (Q25)

- **Vấn đề**:
  1. Rủi ro mất phiên đăng nhập (User bị ép logout hàng loạt) hoặc lỗ hổng bảo mật (fail-open) khi Redis restart/sập hoặc bị lệnh `FLUSHDB`/`FLUSHALL` từ BullMQ.
  2. Lỗ hổng thiếu địa chỉ giao hàng của gói định kỳ (`subscriptions`) khiến Cron Job 04:00 sáng không thể tự sinh đơn giao hàng nếu chỉ dựa vào chuỗi nhập tay của đơn lẻ.
  3. Số điện thoại tại Việt Nam chưa có giải pháp OTP SMS/Zalo ZNS miễn phí để xác minh trong khuôn khổ đồ án sinh viên.
- **Lựa chọn đã chốt**:
  1. **Lưu Refresh Token trên PostgreSQL (`refresh_tokens`)**: Mọi thao tác xoay vòng token (Token Rotation) thực hiện bằng câu lệnh nguyên tử `DELETE FROM refresh_tokens WHERE token = $1 RETURNING ...`. Khi người dùng đổi mật khẩu hoặc bị vô hiệu hóa tài khoản, toàn bộ refresh token bị xóa sạch trong cùng một Database Transaction với bảng `users`.
  2. **Thêm bảng Sổ địa chỉ (`user_addresses`)**: Khách hàng lưu nhiều địa chỉ nhận hàng (kèm tọa độ để tính khoảng cách Haversine). Bảng `subscriptions` liên kết `user_address_id` và sao lưu bản chụp bất biến `shipping_address` để bảo đảm Cron Job tự động giao đúng địa chỉ.
  3. **Xác thực Email làm kênh Auth chính thức**: Bảng `users` bổ sung `email_verified`, `verification_token`, `verification_expires_at`, `reset_password_token`, `reset_password_expires_at`. Số điện thoại (`phone`) đóng vai trò thông tin liên hệ nhận hàng của Shipper, không yêu cầu mã OTP SMS.
  4. **Cơ cấu CSDL chuẩn**: Nâng tổng số thực thể CSDL lên **18 bảng** (16 bảng gốc + `user_addresses` + `refresh_tokens`).
- **Lý do kỹ thuật**: Đảm bảo tính toàn vẹn ACID, độc lập hoàn toàn trạng thái phiên khỏi sự biến động của Redis cache/queue, và hoàn thiện trọn vẹn nghiệp vụ giao hàng định kỳ.

---

## Quyết định 13 - Tiêu Chuẩn Mật Mã Học: Hash Mật Khẩu Bằng `scrypt` Native và Hash Token Bằng `SHA-256` (Q26)

- **Vấn đề**:
  1. Lựa chọn thuật toán băm mật khẩu đảm bảo tiêu chuẩn OWASP mà không bị trói buộc chết vào runtime (`vendor lock-in` với `Bun.password`), đồng thời tránh các rủi ro bảo mật về blast radius từ các runtime mới nổi.
  2. Lựa chọn thuật toán băm và lưu trữ các loại token nhạy cảm (`refresh_tokens`, `verification_token`, `reset_password_token`).
- **Lựa chọn đã chốt**:
  1. **Băm mật khẩu bằng `node:crypto` `scrypt` (Zero Dependency, Runtime-Agnostic)**:
     - Sử dụng thư viện chuẩn `node:crypto` tích hợp sẵn trong Node.js/Bun (ủy thác thẳng xuống lõi OpenSSL 25 năm kiểm định). Không dùng API độc quyền `Bun.password` để giữ Backend trung lập, dễ dàng chuyển đổi sang Node.js tiêu chuẩn bất cứ lúc nào nếu Bun gặp sự cố bảo mật.
     - **Tham số chuẩn OWASP**: Áp dụng cấu hình sản xuất `{ N: 16384, r: 8, p: 5 }` (chiếm 16 MiB RAM, đạt chuẩn OWASP Password Storage Cheat Sheet) và salt ngẫu nhiên 16 bytes (`randomBytes(16)`). Trong môi trường kiểm thử (`NODE_ENV === "test"`), hạ xuống `{ N: 128, r: 1, p: 1 }` để test suite chạy trong vài microsecond.
     - **Định dạng băm có tiền tố phiên bản (Versioned Hash Format)**: Lưu theo format `s1$<salt_hex>$<derived_key_hex>` (với `s1` đại diện cho phiên bản scrypt v1: $N=16384, r=8, p=5$). Tiền tố này cho phép hệ thống nhận biết phiên bản thuật toán khi user đăng nhập, hỗ trợ nâng cấp cost hoặc thuật toán mới (Re-hashing on login) trong tương lai mà không làm hỏng mật khẩu cũ.
     - **Xác thực so khớp an toàn**: Sử dụng `timingSafeEqual` để triệt tiêu hoàn toàn rủi ro tấn công phân tích thời gian (Timing Attacks).
  2. **Băm Token bằng `SHA-256`**:
     - Sinh chuỗi ngẫu nhiên 256-bit (`randomBytes(32).toString("hex")`) gửi cho Client.
     - Server chỉ lưu bản băm `sha256(token)` một chiều xuống PostgreSQL, đánh `Unique Index` để truy vấn $O(1) < 1$ms. Khi rò rỉ cơ sở dữ liệu, kẻ tấn công không thể đảo ngược để mạo danh phiên đăng nhập.
- **Lý do kỹ thuật**: Đạt chuẩn công nghiệp OWASP, bảo vệ an toàn dữ liệu người dùng, loại bỏ hoàn toàn nguy cơ lỗi biên dịch C-binding (`node-gyp`), và giữ tính linh hoạt tối đa cho kiến trúc backend.

---

## Quyết định 14 - Kiến Trúc `apps/api`: Drizzle v1 RC.5, Cloud-Ready (Neon & Redis Cloud), Soft Delete Chọn Lọc, Per-App Env & Message Catalog (Q1–Q13)

- **Vấn đề**: Đồng bộ khung `apps/api` từ `open-genset/backend` sang bài toán GreenRoots Farm sao cho vừa chạy ổn định trên Neon PostgreSQL / Redis Cloud Free, vừa không thừa tính năng B2B hoặc vướng lỗi runtime/index.
- **Lựa chọn đã chốt**:
  1. **Drizzle ORM v1 RC.5 & Toàn vẹn Schema**: Khóa đúng phiên bản `drizzle-orm@^1.0.0-rc.5-169397b` và `drizzle-kit@^1.0.0-rc.5-ab785fc` (`snakeCase.table`, `defineRelations`). Giữ `numeric`/`decimal` trả về `string` để bảo toàn độ chính xác cân nặng/tọa độ, riêng `payments.order_code` dùng `bigint({ mode: "number" })` cho PayOS SDK; gắn đầy đủ `CHECK` constraints ở tầng DB (`batches`, `order_items`, `batch_allocations`, `waste_logs`, `orders`, `subscriptions`, `payments`).
  2. **Hỗ trợ Cloud (Neon PostgreSQL & Redis Cloud Free)**:
     - `normalizeDatabaseUrl()` dùng chung cho cả runtime lẫn `drizzle.config.ts` (`sslmode=verify-full`, tự cắt `-pooler.` khi không có `DB_DIRECT_URL`, `pg.Pool` `max` cấu hình qua `DB_POOL_MAX`).
     - `parseRedisOptions()` hỗ trợ `rediss://` TLS + `servername`, bật `enableOfflineQueue: true` chống lỗi TLS cold-start và dùng chung connection/prefix `gr:` dưới trần 30 connections của Redis Cloud Free.
  3. **Cắt gọn hạ tầng thừa**: Bỏ `nestjs-i18n`, `@sentry/nestjs`, `eslint` (chỉ dùng `oxlint --type-aware` + `oxfmt`), `redlock` (dùng PostgreSQL `SELECT ... FOR UPDATE`), `outbox`, `exceljs`, `telegram`, và các module B2B (`dealer-tiers`, `quotes`, `leads`, `carts`).
  4. **Biên dịch `@greenroots/shared`**: Bỏ `noEmit` ở `packages/shared`, build ra `dist/*.js + *.d.ts` để `apps/api` import runtime Enum/Constants an toàn trên cả Bun, `node dist/main.js` và `drizzle-kit`.
  5. **Soft Delete có chọn lọc (`deleted_at`)**: Chỉ áp dụng `deleted_at` cho **5 bảng Master Data có FK `RESTRICT`** (`users`, `categories`, `products`, `subscription_plans`, `plots`) kèm **Partial Unique Index `WHERE deleted_at IS NULL`** trên `email`, `slug`, `name`, `plot_code`. Tuyệt đối không gắn `deleted_at` lên các bảng sổ cái/bất biến (`farming_logs`, `orders`, `order_items`, `batch_allocations`, `payments`, `waste_logs`, `complaints`, `subscriptions`, `batches`, `seasons`).
  6. **Migration Trigger & 3-Tier Seeder**: Cài `trg_immutable_farming_logs` qua custom SQL migration; Seeder 3 tiers idempotent tính ngày động theo múi giờ `Asia/Ho_Chi_Minh` (`UTC+7`) cho `batches` Flash Sale/FEFO.
  7. **Quản lý ngôn ngữ tập trung**: Thay `nestjs-i18n` bằng từ điển TypeScript tập trung `src/common/constants/messages.constant.ts` (`API_MESSAGES` + Domain Error Codes) cho 100% thông báo tiếng Việt, kiểm lỗi ngay lúc compile.
  8. **Biến môi trường Per-App & Doppler Dual-Mode**: Tách `.env.example` về từng app (`apps/api/.env.example`, kèm `apps/api/doppler.yaml`; Root chỉ giữ 3 biến Docker infra nếu cần). Nhóm script chuẩn dùng `.env` của app (Node thêm `--env-file-if-exists=.env`); nhóm script `doppler:*` chạy `doppler run -- ...` không dùng `--preserve-env="true"` để tránh local `.env` đè secret thật của Doppler.
- **Lý do kỹ thuật**: Loại bỏ lệch phiên bản Drizzle, chặn lỗi trùng khóa sau xóa mềm, bảo toàn tính bất biến kế toán/VietGAP, và giữ code nhẹ tối đa cho tiến độ 3 tuần.

---

## Quyết định 15 - Kiến Trúc Auth, JWT & Thu Hồi Quyền Tức Thì (Q14–Q16)

- **Vấn đề**: Thiết kế luồng xác thực xuyên suốt 2 Frontend (`Next.js 16` Storefront và `Vite SPA` Backoffice) với `apps/api`, đồng thời khắc phục khe hở 15 phút khi khóa tài khoản nhân viên và loại bỏ 4 lỗi copy từ `open-genset`.
- **Lựa chọn đã chốt**:
  1. **Kênh truyền Token (Q14-A)**: Trả `{ accessToken, refreshToken }` qua **JSON Body** (Frontend giữ `accessToken` trong RAM `zustand`, dùng single-flight refresh lock khi 401), giúp tách domain deploy dễ dàng và test trực tiếp qua Swagger/Scalar/Apidog không vướng third-party cookie.
  2. **Refresh Token dạng Opaque 256-bit (KHÔNG dùng JWT)**: `refreshToken` sinh bằng `randomBytes(32).toString("hex")` và lưu bản băm `sha256(token)` trong PostgreSQL (`refresh_tokens`). Vì mọi thao tác làm mới/đăng xuất đều phải tra DB để xoay vòng và thu hồi, dùng JWT sẽ dư thừa payload, rò rỉ claim cũ và xác thực chữ ký thừa thãi.
  3. **Thu hồi Access Token tức thì qua Redis (Q15-A, Fail-Open)**: `JwtAuthGuard` mặc định không chạm PostgreSQL; chỉ khi SuperAdmin khóa/xóa mềm/đổi role hoặc user đổi/reset mật khẩu thì ghi key Redis `auth:revoked:<userId> = <epoch_ms>` (TTL = `15m`). `JwtAuthGuard` kiểm `iat * 1000 < revokedBefore` để chặn ngay token cũ; nếu Redis gặp sự cố kết nối thì **log warning và cho qua (fail-open)** nhằm tránh sập toàn bộ API.
  4. **Khắc phục 4 lỗi từ `open-genset` & Cấp tài khoản Nhân sự (Q16)**:
     - Loại bỏ dead field `isRevoked` vì cơ chế xoay vòng dùng `DELETE ... RETURNING`.
     - Bọc `refreshToken()` và `verifyEmail()` trong `db.transaction` kèm điều kiện `isNull(users.deletedAt)` trên mọi query Auth.
     - Trả HTTP `401 Unauthorized` khi sai mật khẩu (thay vì `400 Bad Request`).
     - Chỉ gọi `mailQueue.add(...)` **sau khi** `db.transaction` đã commit (tránh gửi email link ma khi DB rollback).
     - `/auth/register` khóa cứng `role = 'customer'`; `POST /admin/users` của SuperAdmin tạo tài khoản nhân sự (`admin`, `sales`, `farm_staff`) với `email_verified = true` và `initialPassword` tùy chọn (nếu bỏ trống thì gửi email link đặt mật khẩu).
- **Lý do kỹ thuật**: Cân bằng giữa tốc độ stateless JWT, khả năng thu hồi quyền tức thì cho RBAC nội bộ, độ an toàn ACID của phiên đăng nhập, và tính khả thi demo trong 3 tuần.

---

## Quyết định 16 - Chuẩn Hóa Response (RFC 9457), Scalar `/api/docs` và Kiến Trúc Đồng Bộ Type Monorepo (Q17–Q21)

- **Vấn đề**: Đồng bộ toàn bộ chuẩn HTTP response, validation, tài liệu API và xác lập kiến trúc đồng bộ kiểu dữ liệu (Type Sync) chuẩn Monorepo thay vì dùng script kéo mạng kiểu Polyrepo.
- **Lựa chọn đã chốt**:
  1. **Khóa bảo vệ toàn cục (Q17)**: Đăng ký `JwtAuthGuard` và `RolesGuard` làm `APP_GUARD` mặc định toàn cục; mở route công khai bằng `@Public()`; siết `@Throttle` cho toàn bộ nhóm `/auth/*`; dùng biến môi trường chuẩn `JWT_ACCESS_SECRET`.
  2. **Envelope thành công tường minh (Q18-A)**: Sử dụng hàm helper `apiSuccess(data, meta?)` và `buildPaginationMeta()` trực tiếp ở Controller, giữ chữ ký kiểu trả về của method khớp 100% với JSON thực tế, tránh rủi ro interceptor bọc nhầm Webhook PayOS hoặc binary stream.
  3. **Chuẩn lỗi RFC 9457 Problem Details (Q19-A)**: Trả về `application/problem+json` theo định dạng `{ type, title, status, detail, instance, code, invalidParams, timestamp }`. Khắc phục Host Header Injection bằng URN tĩnh `/errors/<slug>`; bắt lỗi PostgreSQL `P0001` (`RAISE EXCEPTION` từ Trigger `farming_logs`) trả về `403 Forbidden` (`FARMING_LOG_IMMUTABLE`) và `23503` (FK violation) trả về `409 Conflict`.
  4. **Validation và kiểm soát Response (Q20)**: `ZodValidationPipe` chuẩn hóa lỗi input tiếng Việt kèm path field form vào `invalidParams`. `ZodResponseValidationInterceptor` tự động kiểm tra tính toàn vẹn của dữ liệu trả về trong môi trường `development` và `test` (tắt ở production).
  5. **Tài liệu API Scalar tại `/api/docs` (Q21)**: Triển khai giao diện Scalar hiện đại tại đường dẫn `/api/docs`, đồng thời xuất đặc tả JSON tại `/openapi.json`.
  6. **Kiến trúc đồng bộ Type chuẩn Monorepo (Hybrid Architecture)**:
     - **Tầng Domain & Form (`packages/shared`)**: Chia sẻ trực tiếp Enums, Business Constants, và Zod Schemas dùng chung cho React Hook Form ở Frontend và `nestjs-zod` DTO ở Backend.
     - **Tầng Transport & Wire (`openapi-typescript` + `openapi-fetch`)**: Loại bỏ hoàn toàn script `pull-openapi-types` kéo qua mạng `http://localhost:3000` kiểu Polyrepo. Thay bằng script offline cục bộ trong Monorepo: `apps/api` khởi tạo in-memory xuất file `openapi.json`, và `openapi-typescript` đọc trực tiếp file cục bộ để sinh type an toàn, triệt tiêu lỗi lệch kiểu dữ liệu JSON (như `Date` biến thành `string`) mà không kéo dependency của NestJS vào bundle Web.
- **Lý do kỹ thuật**: Đạt chuẩn công nghiệp RFC 9457, loại bỏ lỗi runtime ở Frontend, tối ưu hóa trải nghiệm kiểm thử API, và tận dụng tối đa lợi thế Monorepo offline.

---

## Quyết định 17 - Cơ Chế Tính Phí Vận Chuyển Động và Hệ Số Khúc Quanh Haversine (Q22–Q24)

- **Vấn đề**: Xác định ranh giới tính cước vận chuyển nông sản tươi sống giữa đơn lẻ và gói định kỳ, đồng thời định nghĩa vai trò của thuật toán Haversine và môi trường áp dụng.
- **Lựa chọn đã chốt**:
  1. **Vai trò Haversine và Môi trường áp dụng (Q22)**: Trong môi trường production, geocoding chạy trực tuyến qua Google Maps hoặc OpenStreetMap. Driver nội suy Haversine (`MockHaversineDriver`) thuần túy đóng vai trò test fixture phục vụ Unit Test, E2E Testing, và chạy offline cục bộ khi không có API key.
  2. **Hệ số khúc quanh (Detour Factor = 1.30)**: Khoảng cách đường bộ thực tế được ước lượng bằng $d_{\text{road}} = d_{\text{haversine}} \times 1.30$. Hệ số $1.30$ dựa trên chỉ số Circuity Index thực nghiệm của mạng lưới giao thông đô thị dạng lưới phi đối xứng có chướng ngại vật sông ngòi (trung bình dao động $1.27 - 1.35$).
  3. **Công thức cước và giới hạn bán kính (Q23)**: Cước vận chuyển đơn hàng lẻ áp dụng công thức sàn: $15.000$đ cho $3$ km đầu tiên, cộng $5.000$đ cho mỗi kilomet tiếp theo (làm tròn lên theo block $1$ km: $\lceil\text{distance} - 3\rceil$). Chặn cứng bán kính giao hàng tươi tối đa $25$ km từ vị trí Nông trại/Kho điều phối để bảo đảm độ tươi sống.
  4. **Chính sách giao nhận gói định kỳ (Q24)**: Miễn phí vận chuyển cho khách hàng đăng ký Gói định kỳ (`subscriptions`) trong bán kính $\le 20$ km nhờ tối ưu gom chuyến cố định vào Thứ 3 và Thứ 6.
  5. **Lộ trình triển khai**: Toàn bộ quy tắc tính cước và Driver giao vận được lưu trữ vào SSOT và kích hoạt ở giai đoạn hoàn thiện Checkout/Order (không nằm trong phạm vi cài đặt hạ tầng CSDL Bước 1).
- **Lý do kỹ thuật**: Đảm bảo tính khả thi vận hành thực tế của nông sản tươi, kiểm soát chi phí logistics xe máy nội thành, và duy trì tính độc lập kiểm thử tự động.

---

## Quyết định 18 - Kiến Trúc Nền Tảng Phân Hệ Storefront Next.js 16 (Q25–Q32)

- **Vấn đề**: Định hình kiến trúc phân hệ giao diện khách hàng `apps/storefront` theo chuẩn Next.js 16 và Bun runtime, lựa chọn UI stack, chiến lược giỏ hàng, xác thực session, bảng màu tối giản và cơ chế truy xuất nguồn gốc QR.
- **Lựa chọn đã chốt**:
  1. **Quản lý ngôn ngữ Tiếng Việt (Q25 — Hybrid Pragmatic SSOT)**: Bỏ hoàn toàn `next-intl` và phân đoạn `[locale]`. Tách 2 tầng dữ liệu chữ tiếng Việt để vừa đọc JSX nhanh vừa không lệch nghiệp vụ giữa Storefront và Backoffice:
     - **Dùng chung ở `@greenroots/shared`**: `API_ERROR_DICTIONARY` (RFC 9457), `ORDER_STATUS_LABELS`, `PAYMENT_METHOD_LABELS`, `DELIVERY_DAY_LABELS`, và các hằng số vận hành trong `BUSINESS_RULES` (`HARVEST_START_HOUR`, `EXPRESS_DELIVERY_HOURS`, `COMPLAINT_WINDOW_HOURS`, `FLASH_SALE_DISCOUNT_PERCENT`, `FLASH_SALE_HOURS_THRESHOLD`, `SHIPPING.MAX_RADIUS_KM`).
     - **Riêng theo phân hệ (`apps/storefront/src/constants/`)**: `FARM_METADATA` (suy xuất từ `BUSINESS_RULES`), `HOME_SHELF_NAV`, và bộ nhãn hướng khách hàng (`BATCH_STATUS_LABELS`, `FARMING_ACTION_LABELS`, `SEASON_STATUS_LABELS`) để `apps/backoffice` tự giữ bộ nhãn vận hành riêng cho kỹ sư/Admin.
     - **Quy tắc JSX**: Copy giao diện cục bộ viết inline trong TSX; mọi con số/cam kết vận hành (`4h sáng`, `2h`, `24h`, `50%`, `25 km`) bắt buộc đọc từ `FARM_METADATA`/`BUSINESS_RULES`.
  2. **UI Stack, Workspace `packages/ui` & Design Tokens (Q26)**:
     - Khởi tạo `@greenroots/ui` (`packages/ui`) bằng Shadcn CLI (`style: base-nova`, `@base-ui/react`), dùng trực tiếp npm package `cn` (không tạo `src/lib/utils.ts` tự viết), đặt `@source "../components";` ngay trong `packages/ui/src/styles/globals.css`, và re-export `cn`, `toast` cùng các primitives từ `src/index.ts`.
     - `apps/storefront` dùng `@greenroots/ui` qua `workspace:*` + `exports` (không khai báo `tsconfig.json` `paths` `@greenroots/ui/*`), bật `cacheComponents: true`, `partialPrefetching: true`, và `<html data-scroll-behavior="smooth">`. Dùng chung phiên bản `react`, `react-dom`, `@types/react*`, `lucide-react`, `tailwindcss`, `zod`, `typescript` qua root `catalog:`.
     - Bảng màu tối giản 3 sắc độ từ `sf-01-home.html`: Trắng (`surface-warm: #FAF8F5`, `surface-card: #FFFFFF`, `border-subtle: #E5E7EB`), Xanh (`brand-forest: #15803D`, `brand-dark: #166534`, `status-fresh: #059669`), Đỏ (`status-spoiled: #DC2626`, `red-50`, `red-200`). Font duy nhất: `Be Vietnam Pro` (`font-sans`), bỏ hoàn toàn monospace.
     - **Hiển thị tồn kho trên thẻ sản phẩm (`ProductCard`)**: Hàng thường chỉ hiện `{unitLabel} · Còn {availableQuantity} {unit}`; riêng kệ `DEAL TƯƠI TRONG NGÀY` (`isRescueDeal`) mới hiển thị thanh nhiệt đỏ (`Đã xuất X% | Còn Y {unit}`) tính trên các lô cận hạn đang `IN_STOCK`.
  3. **Quản lý trạng thái giỏ hàng (Q27)**: Client-side Zustand Store với middleware `persist` (`localStorage`), hỗ trợ khách vãng lai `Guest` thao tác `[- 1 +]` tức thì trên thẻ sản phẩm. Không khóa tồn kho trước.
  4. **Cầu nối phiên đăng nhập Cookie Bridge (Q28)**: Next.js Server Actions nhận token từ NestJS API ghi vào `httpOnly`, `Secure`, `SameSite=Lax` Cookie trên domain Storefront. Server Components đọc Cookie và đính kèm `Bearer <accessToken>` khi gọi backend qua `openapi-fetch`.
  5. **Tọa độ Geocoding & Tính cước Haversine (Q29)**: Nhúng danh mục 24 quận huyện TP.HCM kèm tọa độ trung tâm vào `@greenroots/shared`. Tính cước tức thì theo công thức Quyết định 17 ($15.000$đ/3km đầu + $5.000$đ/km, Detour Factor = $1.30$, chặn tối đa 25km). Hoàn toàn ngoại tuyến, không phụ thuộc Google Maps API.
  6. **Hiệu năng trang QR truy xuất nguồn gốc `/trace/:batchCode` (Q30)**: Áp dụng React Server Component kết hợp bộ nhớ đệm máy chủ. Dữ liệu lô hàng sau thu hoạch là bất biến, xuất HTML tĩnh tải dưới 500ms khi quét QR trên di động.
  7. **Kiểm tra tồn kho tại Giỏ hàng Drawer (Q31)**: Kiểm tra ngay khi mở Drawer hoặc bấm nút "Thanh toán" thông qua endpoint `POST /orders/validate-cart`. Hiển thị nhãn cảnh báo đỏ ngay tại dòng sản phẩm nếu tồn kho không đủ.
  8. **Đồng hồ đếm ngược 15 phút VietQR PayOS (Q32)**: Chạy đồng hồ đếm ngược tại Client kết hợp cơ chế tự động thăm dò (polling mỗi 3s). Khi hết 15 phút mà chưa thanh toán, làm mờ mã QR và thông báo hết hạn.
- **Lý do kỹ thuật**: Tối ưu hóa tối đa trải nghiệm người dùng mua sắm nông sản tươi, bảo đảm tốc độ quét mã QR dưới 2 giây theo tiêu chí đồ án, và triệt tiêu mọi rủi ro lỗi mạng của các dịch vụ bên thứ ba khi báo cáo.

## Related Notes

- Bản đồ điều phối trung tâm: [[000_GreenRoots_Farm_MOC]]
- Đặc tả màn hình Storefront: [[Storefront_Screen_Specs]]
- Quy chuẩn Design Tokens: [[UI_Design_System_and_Tokens_Specification]]
- Chi tiết kỹ thuật Adapter Pattern: [[Third_Party_API_Adapter_Pattern_Strategy]]
- Kiến trúc hệ thống toàn cục: [[000_System_Structure]]
