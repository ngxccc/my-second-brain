---
tags: [type/project, status/active]
date: 2026-11-11
description: "Đặc tả kỹ thuật xử lý các trường hợp biên, xung đột đồng thời và kiểm soát gian lận trong hệ thống nông sản sạch."
---

# Operations and Edge Cases RFC

## TL;DR

- **Bản chất**: Tài liệu giải pháp kỹ thuật giải quyết các tình huống lỗi biên, tranh chấp dữ liệu đồng thời và rủi ro gian lận khi vận hành.
- **Mục đích**: Bảo vệ tính toàn vẹn của dữ liệu kho hàng và đảm bảo trải nghiệm khách hàng không bị đổ vỡ trước biến động mùa vụ thực tế.
- **Điểm mấu chốt**: Ngăn chặn bán khống bằng Atomic Conditional Update và kiểm soát hụt hàng subscription bằng cơ chế thay thế định trước.

---

## Xử lý Thiếu hụt Hàng hóa trong Subscription (Q11)

Quy trình ứng phó khi sản lượng thu hoạch thực tế không đáp ứng đủ nhu cầu giao định kỳ:

- **Bối cảnh rủi ro**: Nông nghiệp chịu tác động thời tiết, sâu bệnh dẫn đến sản lượng thực tế thấp hơn dự kiến khi đến ngày giao giỏ rau Subscription.
- **Cơ chế phối hợp 2 tầng**:
  - _Tầng 1 (Cảnh báo sớm 24 giờ)_: Scheduler quét trước ngày giao hàng 24 tiếng (sáng Thứ 2 cho lịch giao Thứ 3). Hệ thống đối chiếu lượng rau cần đóng gói với sản lượng dự kiến trong Batch. Nếu thiếu hụt, hệ thống gửi cảnh báo khẩn cấp lên Dashboard của Sales.
  - _Tầng 2 (Rau thay thế thông minh - Smart Substitution)_: Cấu hình danh mục mặt hàng thay thế tương đương (ví dụ: thiếu Xà lách Romaine tự động đổi sang Xà lách Mỡ có cùng giá trị dinh dưỡng). Đơn hàng tự động cập nhật mặt hàng thay thế kèm email giải thích rõ ràng cho khách hàng.

---

## Kiểm soát Tranh chấp Đồng thời khi Trừ kho Lô (Q12)

Giải pháp kỹ thuật ngăn chặn hiện tượng bán khống (Overselling) trong PostgreSQL và Drizzle ORM:

- **Bản chất vấn đề**: Khi nhiều nhân viên Sales xác nhận đơn hàng hoặc nhiều luồng thanh toán cùng trừ kho một Lô tại một thời điểm, hiện tượng Race Condition sẽ làm số lượng tồn kho khả dụng bị âm.
- **Phương án Atomic Conditional Update (Ưu tiên cho đơn hàng lẻ)**:

```sql
UPDATE batches
SET available_quantity = available_quantity - $requested_qty
WHERE id = $batch_id AND available_quantity >= $requested_qty;
```

Nếu số dòng cập nhật thành công (`rowCount`) bằng 0, hệ thống xác định Lô hàng đã hết và tiến hành chuyển sang Lô tiếp theo theo thứ tự FEFO.

- **Phương án Pessimistic Locking (Áp dụng cho đơn hàng gộp nhiều Lô)**:
  Khi một đơn hàng cần phân bổ vào nhiều Lô, toàn bộ thao tác được bọc trong một Database Transaction sử dụng `SELECT ... FOR UPDATE`:

```typescript
await db.transaction(async (tx) => {
  // Sắp xếp ID tăng dần để ngăn ngừa hiện tượng Deadlock
  const batches = await tx
    .select()
    .from(batchesTable)
    .where(inArray(batchesTable.id, sortedBatchIds))
    .orderBy(asc(batchesTable.id))
    .for("update");

  // Thực hiện phân bổ số lượng và trừ kho theo thuật toán FEFO
});
```

---

## Cấp độ Định danh và Đóng gói Mã QR Truy xuất (Q13)

Xác lập vị trí in ấn và mức độ chi tiết của mã phản hồi nhanh trên bao bì:

- **Lựa chọn áp dụng**: Định danh ở cấp độ Lô hàng bao bì (Batch-Level Packaging).
- **Quy trình thực tế tại nông trại**:
  - Sau khi thu hoạch tại một luống đất, nông sản được đưa vào khu sơ chế và tạo bản ghi Lô (Batch) trên hệ thống.
  - Farm Staff in hàng loạt tem nhãn chứa mã QR của Lô đó (mỗi túi rau 300g - 500g được dán 1 tem nhãn).
  - Khách hàng quét mã trên túi sản phẩm nào sẽ được chuyển hướng thẳng đến URL công khai `/trace/{batchCode}` của Lô đất và mùa vụ tương ứng.
- **Lợi ích**: Tối ưu chi phí in ấn nhãn mác, loại bỏ sự phức tạp khi dán mã trên từng đơn hàng tổng hợp, và đảm bảo tính chính xác tuyệt đối cho từng mặt hàng.

---

## Quy trình Tiếp nhận Khiếu nại và Chống Gian lận (Q14)

Rào cản nghiệp vụ bảo vệ nông trại trước các khiếu nại trục lợi:

- **Đặc thù hàng tươi sống**: Nông sản dễ héo nếu khách hàng bảo quản sai cách sau khi nhận hàng.
- **Cơ chế kiểm soát 3 bước**:
  - _Bước 1 (Giới hạn cửa sổ thời gian)_: Khách hàng chỉ được gửi yêu cầu khiếu nại trong vòng **24 giờ** kể từ thời điểm đối tác vận chuyển cập nhật trạng thái `Giao hàng thành công` (Delivered). Nút khiếu nại sẽ tự động khóa lại sau mốc thời gian này.
  - _Bước 2 (Bắt buộc bằng chứng đa phương tiện)_: Bắt buộc đính kèm từ 1 đến 5 hình ảnh chụp rõ tem nhãn QR trên bao bì và phần dập nát (`proof_image_urls`). Cho phép đính kèm tùy chọn 1 video quay cận cảnh (`proof_video_url`, giới hạn tối đa 15 giây và dung lượng $\le 15\text{MB}$ để tránh tràn quota Cloudinary).
  - _Bước 3 (Kiểm duyệt bán tự động)_: Nhân viên Sales đối chiếu thời gian nhận hàng và hình ảnh hư hại trước khi bấm phê duyệt hoàn tiền qua PayOS hoặc phát hành voucher bù vào tài khoản.

---

## Máy Trạng thái Đơn hàng và Thu hồi Kho Tự động (Q15)

Kiểm soát luân chuyển trạng thái đơn hàng qua Finite State Machine (FSM):

- **Ma trận chuyển trạng thái hợp lệ**:
  `PENDING_PAYMENT` -> `PAID` -> `CONFIRMED` -> `PACKING` -> `SHIPPING` -> `DELIVERED` -> `COMPLETED`.
- **Điểm kích hoạt trừ kho**: Tại mốc `CONFIRMED`, hệ thống chạy thuật toán FEFO để trừ tồn kho trên các Batch và tạo các bản ghi `batch_allocations`.
- **Quy định hủy đơn và hoàn kho (Rollback)**:
  - Khách chỉ được tự hủy đơn khi đơn ở trạng thái `PENDING_PAYMENT` hoặc `PAID`.
  - Khi đơn đã sang `CONFIRMED`, thao tác hủy bắt buộc do Sales thực hiện.
  - Trạng thái `CANCELLED` tự động kích hoạt transaction hoàn trả số lượng khả dụng vào đúng các Batch đã phân bổ.
- **Tự động hủy đơn quá hạn qua BullMQ Delayed Job**:
  - Khi đơn hàng tạo với phương thức PayOS, hệ thống đẩy một delayed job vào hàng đợi `order-queue` của BullMQ với thời gian trễ 15 phút (`delay: 900000`).
  - Worker kích hoạt sau 15 phút: Nếu đơn hàng vẫn ở trạng thái `PENDING_PAYMENT`, hệ thống tự động cập nhật sang `CANCELLED` và giải phóng lượng tồn kho giữ chỗ.

---

## Cơ chế Phân mục Xả hàng Nông sản Cận hạn (Q16)

Xử lý xung đột giá bán giữa lô hàng mới và lô hàng cận hạn:

- **Nguyên tắc phân tách**: Không áp dụng giảm giá trực tiếp lên sản phẩm chính nhằm tránh làm mất giá trị lô mới thu hoạch.
- **Giải pháp Góc Xả Hàng (Rescue Food Section)**:
  - Khi một Batch có số ngày sử dụng còn lại dưới ngưỡng cảnh báo (ví dụ dưới 48 giờ), hệ thống gửi đề xuất lên Dashboard của Sales.
  - Khi được phê duyệt, hệ thống tự động đưa lô hàng vào danh mục xả hàng riêng biệt trên Storefront với nhãn giảm giá và số lượng giới hạn.
  - Đơn hàng mua từ danh mục này được gắn cứng trực tiếp vào mã Batch cận hạn thay vì chạy thuật toán phân bổ thông thường.

---

## Bảo mật Tải lên Tệp Đa phương tiện qua Signed Upload (Q17)

Ngăn chặn hành vi khai thác cạn kiệt tài nguyên lưu trữ Cloudinary:

- **Lỗ hổng từ Unsigned Upload**: Cho phép người dùng tùy ý tải lên tệp rác gây quá tải hạn mức gói lưu trữ miễn phí.
- **Quy trình Signed Upload có xác thực**:
  - Client gửi yêu cầu cấp chữ ký tải lên đến NestJS Backend kèm định danh người dùng.
  - NestJS kiểm tra quyền hạn, tạo chữ ký số (Signature) kèm ràng buộc: kích thước ảnh tối đa 5MB, video tối đa 15MB, định dạng cho phép (`jpg`, `png`, `mp4`).
  - Frontend sử dụng chữ ký để tải file trực tiếp lên Cloudinary mà không làm nghẽn băng thông server.

---

## Phân quyền 6 Roles và Thu hồi Phiên Đăng nhập tức thì qua Redis (Q18)

Quản lý phiên đăng nhập và thu hồi quyền hạn ngay lập tức khi có biến động nhân sự:

- **Phân cấp 6 Roles nghiệp vụ**:
  - `Guest`: Người dùng vãng lai chưa đăng nhập.
  - `Customer`: Khách hàng mua lẻ, đăng ký subscription, khiếu nại.
  - `Farm Staff`: Kỹ sư canh tác quản lý mùa vụ, lô hàng, nhật ký canh tác.
  - `Sales`: Nhân viên kinh doanh điều phối đơn hàng, khiếu nại, duyệt xả hàng.
  - `Admin`: Quản lý nông trại vận hành hàng ngày, theo dõi báo cáo và điều phối nhân sự.
  - `SuperAdmin`: Chủ sở hữu hệ thống nắm quyền tối cao, cấu hình tham số cốt lõi và quản lý tài khoản quản trị.
- **Cơ chế thu hồi phiên tức thì qua Redis (Token Invalidation)**:
  - Access Token JWT có thời hạn ngắn (15 phút), chứa trường `tokenVersion`.
  - Redis lưu trữ giá trị `tokenVersion` hiện tại của từng người dùng.
  - Khi SuperAdmin hoặc Admin khóa tài khoản hoặc thay đổi role của nhân viên, hệ thống tăng `tokenVersion` trên Redis thêm 1 đơn vị.
  - NestJS `JwtAuthGuard` đối chiếu `tokenVersion` trong token với Redis ở mỗi request; nếu lệch lập tức trả về mã lỗi `401 Unauthorized`.

---

## Động cơ Phân bổ Lô và Bảng Trung gian Batch Allocation (Q19)

Giải quyết bài toán 1 dòng đơn hàng lấy từ nhiều Lô theo FEFO:

- **Vấn đề cấu trúc**: Khách đặt 5kg cà chua, nhưng Lô A chỉ còn 2kg và Lô B còn 10kg. Bảng `order_items` không thể lưu trực tiếp `batch_id` vì vi phạm chuẩn hóa quan hệ 1-N.
- **Giải pháp bảng trung gian `batch_allocations`**:
  - Bảng `order_items`: Lưu góc nhìn thương mại (`id`, `order_id`, `product_id`, `quantity = 5`, `price`).
  - Bảng `batch_allocations`: Lưu góc nhìn kho vận thực tế (`id`, `order_item_id`, `batch_id`, `allocated_quantity`, `allocated_at`).
  - Kết quả: Đơn hàng trên có 1 bản ghi `order_items` (5kg) nhưng sinh ra 2 bản ghi `batch_allocations` (2kg cho Lô A và 3kg cho Lô B).

---

## Tính Toàn vẹn Lịch sử và Audit Trail của Nhật ký Canh tác (Q20)

Ngăn ngừa hành vi sửa xóa dữ liệu che giấu vi phạm canh tác:

- **Mô hình Dữ liệu Bất biến (Append-Only Log)**: Nhật ký canh tác chỉ được phép thêm mới (`INSERT`). SQL Trigger `trg_immutable_farming_logs` chặn cứng cả `UPDATE` lẫn `DELETE` (`P0001` $\to$ HTTP `403`).
- **Cơ chế Đính chính (Correction Record)**: Khi cần đính chính sai sót, nhân sự được cấp quyền tạo thêm bản ghi mới với `action_type = 'correction'` tham chiếu lại thông tin cần sửa để bảo toàn 100% lịch sử gốc.

---

## Chiến lược Caching Redis và Nhất quán Tồn kho Tươi sống (Q21)

Phân tách ranh giới dữ liệu cache để triệt tiêu hiện tượng bán hàng ảo:

- **Dữ liệu được phép cache trên Redis (TTL 1 giờ)**: Danh mục sản phẩm, bài viết câu chuyện nông trại, thông tin nông sản tĩnh, nhật ký canh tác của các mùa vụ đã thu hoạch.
- **Dữ liệu cấm cache (Truy vấn PostgreSQL trực tiếp)**: Số lượng tồn kho khả dụng (`available_quantity`).
- **Hiệu năng truy vấn**: Tận dụng B-Tree Index trên `batches(product_id, expiration_date)` trong PostgreSQL để truy vấn tồn kho thực tế dưới 2ms, đảm bảo nhất quán dữ liệu 100%.

---

## Quy trình Đề xuất và Phê duyệt Xuất Hủy Hao Hụt Kho (Q22)

Kiểm soát nội bộ ngăn chặn thất thoát tài sản nông sản tươi:

- **Bước 1 (Lập phiếu đề xuất)**: Nhân viên `Farm Staff` hoặc `Sales` phát hiện rau dập nát tạo phiếu đề xuất trên Dashboard, chọn Batch, nhập số kg hao hụt và tải lên ảnh thực tế. Phiếu mang trạng thái `PENDING_APPROVAL`.
- **Bước 2 (Kiểm duyệt)**: `Admin` hoặc `SuperAdmin` kiểm tra bằng chứng hình ảnh và phê duyệt phiếu.
- **Bước 3 (Thực thi Transaction)**: Hệ thống trừ `available_quantity`, cộng `discarded_quantity` trên Batch, và tự động ghi nhận vào báo cáo tổn thất tài chính.

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Phân tích mô hình kinh tế: [[Business_Model_and_Domain_Analysis]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
