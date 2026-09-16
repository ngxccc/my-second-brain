---
tags:
  [type/roadmap, topic/interview-prep, topic/hyundai-ecommerce, career/intern]
date: 2026-09-12
aliases:
  [
    Intern Interview Prep,
    Lo trinh On Phong Van Intern Thuc Chien,
    Backend Interview Mastery,
  ]
status: active
---

# Lộ Trình Ôn Phỏng Vấn Backend Intern (Dự Án Hyundai E-Commerce)

Tập trung vào ba luồng nghiệp vụ thực tế trong mã nguồn, mười câu hỏi nền tảng và phương pháp trả lời khi gặp câu hỏi ngoài kịch bản.

---

## Mô Hình Chuẩn Bị 3 Phần

```
           /\
          /  \    Phần 3 (5%): Xử lý câu hỏi chưa nắm rõ
         /----\
        /      \   Phần 2 (25%): 10 câu hỏi nền tảng Web và Database
       /--------\
      /          \  Phần 1 (70%): Ba luồng nghiệp vụ thực tế từ mã nguồn
     --------------
```

- Phần 1: Nắm chắc ba luồng mã nguồn trong repo. Theo dõi luồng dữ liệu chạy qua từng tầng và luyện trình bày tóm tắt trong 90 giây.
- Phần 2: Nắm vững câu trả lời ngắn gọn cho 10 câu hỏi nền tảng thường gặp.
- Phần 3: Nắm phương pháp xử lý khi gặp công nghệ hoặc câu hỏi chưa từng tiếp cận.

Tài liệu tra cứu bản chất chuyên sâu: [[Technical_First_Principles_Deep_Dive]]

---

## Kế Hoạch 4 Tuần

- Tuần 1: Luồng nghiệp vụ Báo giá B2B, máy trạng thái FSM và buồng lái đàm phán giá.
- Tuần 2: Transactional Outbox Pattern và cơ chế lấy dữ liệu bằng `SKIP LOCKED`.
- Tuần 3: Zod Single Source of Truth và đồng bộ hợp đồng API với `openapi-fetch`.
- Tuần 4: Luyện tập 10 câu hỏi nền tảng và thực hành trả lời phản biện.

---

## PHẦN 1: BA LUỒNG NGHIỆP VỤ THỰC TẾ TRONG MÃ NGUỒN

---

### Luồng 1: Vòng Đời Báo Giá B2B, Máy Trạng Thái FSM và Đàm Phán Giá

#### Tệp mã nguồn liên quan:

- Kênh tiếp nhận RFQ trên Storefront: `storefront/src/features/quote/components/quote-request-view.tsx` và `storefront/src/features/quote/actions/quote.action.ts` (gọi `POST /api/v1/quotes`).
- Xử lý nghiệp vụ tại Backend: `backend/src/modules/quotes/quotes.service.ts`:
  - Hàm `createRfq`: Tiếp nhận yêu cầu báo giá, khởi tạo mã số `BG-YYYYMM-XXXX`, gắn trạng thái `SUBMITTED`.
  - Hàm `updateStatus`: Thực thi máy trạng thái FSM (`DRAFT`, `SUBMITTED`, `NEGOTIATING`, `APPROVED`, `REJECTED`, `EXPIRED`).
  - Hàm `updateItemPrice`: Nhập giá thỏa thuận từng dòng thiết bị, tính lại `subtotalPrice`, `vatAmount` (10%) và `totalQuotedPrice` trong `db.transaction()`.
- Giao diện đàm phán trên Admin CMS:
  - `admin/src/features/quotes/components/quote-pricing-cockpit.tsx`: Bảng so sánh giá niêm yết, giá khách yêu cầu và ô nhập giá thỏa thuận (`agreedUnitPrice`).
  - `admin/src/features/quotes/components/quote-header.tsx`: Các nút hành động chuyển trạng thái và xuất bản in A4.
- Quy tắc bất biến nghiệp vụ:
  - `INV-QUOTE-1`: Chỉ cho phép chuyển trạng thái sang `APPROVED` khi toàn bộ dòng sản phẩm đã có giá thỏa thuận (`agreedUnitPrice > 0`).
  - `INV-QUOTE-4`: Khóa chỉnh sửa đơn giá khi báo giá ở trạng thái `APPROVED`, `REJECTED`, hoặc `EXPIRED`.

#### Các bước kiểm tra thực tế:

1. Chạy Backend (`bun run dev:backend`), Storefront (`bun run dev:storefront`) và Admin (`bun run dev:admin`).
2. Truy cập `http://localhost:3001/vi/products`, chọn một sản phẩm máy phát điện và chuyển sang `/quote`.
3. Nhập thông tin doanh nghiệp (tên công ty, mã số thuế, người liên hệ, số điện thoại) và gửi yêu cầu.
4. Mở Admin CMS `http://localhost:3002/vi/quotes` để kiểm tra bản ghi mới ở trạng thái `SUBMITTED`.
5. Vào chi tiết báo giá, mở `QuotePricingCockpit`, nhập đơn giá thỏa thuận và kiểm tra tổng tiền được tính lại.

#### Kịch bản trình bày 90 giây:

- Bối cảnh: "Trong dự án này, em phụ trách thiết kế luồng đàm phán báo giá cho thiết bị máy công nghiệp B2B giá trị cao. Ngành hàng này không bán lẻ qua giỏ hàng thông thường mà vận hành qua quy trình tiếp nhận RFQ và đàm phán thương mại giữa doanh nghiệp với nhân viên kinh doanh."
- Vấn đề: "Đơn giá thiết bị thay đổi theo số lượng đặt hàng, chiết khấu đại lý và điều khoản bảo hành. Khi khách hàng gửi giá kỳ vọng, nhân viên kinh doanh cần công cụ đối chiếu giá niêm yết, nhập giá thỏa thuận, tự động tính thuế VAT 10% và ràng buộc các điều khoản giao nhận trước khi chốt báo giá."
- Giải pháp: "Em xây dựng máy trạng thái FSM 6 trạng thái tại `quotes.service.ts` để kiểm soát chặt chẽ quá trình chuyển từ SUBMITTED qua NEGOTIATING tới APPROVED. Tại Admin CMS, em thiết lập giao diện `QuotePricingCockpit` tính toán lại tổng tiền trong database transaction mỗi khi cập nhật đơn giá thỏa thuận. Hệ thống cài đặt các điều kiện chặn việc duyệt báo giá khi chưa chốt giá toàn bộ sản phẩm và khóa chỉnh sửa đơn giá khi báo giá đã duyệt."
- Kết quả: "Quy trình xử lý nhất quán từ khi tiếp nhận RFQ đến khi xuất bản in A4 và tệp Excel kế toán phục vụ ký kết hợp đồng, tránh sai sót trong tính toán giá."

---

### Luồng 2: Transactional Outbox Pattern và Cơ Chế Quét Bằng `SKIP LOCKED`

#### Tệp mã nguồn liên quan:

- Định nghĩa bảng và dịch vụ: `backend/src/modules/outbox/outbox.service.ts` và `backend/src/database/schemas/outbox.schema.ts`.
- Ghi dữ liệu đồng thời: Bảng `outbox_events` được chèn dữ liệu trong cùng khối `db.transaction()` với thao tác tạo báo giá (`quote.submitted`) hoặc duyệt báo giá (`quote.approved`).
- Cơ chế lấy dữ liệu không nghẽn: Câu lệnh truy vấn:
  ```ts
  .for("update", { skipLocked: true })
  ```

#### Cơ chế vận hành:

- Vấn đề Dual-Write: Khi báo giá được tạo hoặc duyệt, hệ thống cần gửi email thông báo và thông tin điều phối cho nhân viên kinh doanh. Nếu ghi cơ sở dữ liệu xong mới gọi dịch vụ gửi email qua mạng, sự cố mạng sẽ khiến sự kiện bị thất thoát. Nếu gọi gửi email trước mà transaction cơ sở dữ liệu bị rollback, hệ thống sẽ phát đi thông báo sai lệch.
- Giải pháp Outbox: Lưu bản ghi sự kiện vào bảng `outbox_events` trong cùng transaction với nghiệp vụ báo giá. Cả hai thao tác cùng commit hoặc cùng rollback.
- Cơ chế `SKIP LOCKED`: Khi nhiều tiến trình worker cùng quét bảng `outbox_events`, câu lệnh `SKIP LOCKED` giúp worker sau tự động bỏ qua các bản ghi đang bị worker trước khóa và xử lý tiếp các bản ghi tự do, tránh tình trạng nghẽn luồng và tránh xử lý trùng bản ghi.

#### Kịch bản trình bày 90 giây:

- Bối cảnh: "Khi khách hàng gửi yêu cầu báo giá hoặc khi quản trị viên duyệt giá chốt đơn, hệ thống cần phát tín hiệu cho các tác vụ nền gửi email xác nhận và thông báo điều phối."
- Vấn đề: "Vấn đề gặp phải là Dual-Write: nếu gọi gửi email hoặc đẩy message sang hàng đợi ngay sau khi ghi cơ sở dữ liệu, sự cố mạng chập chờn sẽ khiến dữ liệu giữa hai hệ thống bị lệch pha, dẫn đến mất mát sự kiện."
- Giải pháp: "Em áp dụng Transactional Outbox Pattern: bản ghi nghiệp vụ và bản ghi sự kiện tại `outbox_events` được lưu đồng thời trong một ACID transaction duy nhất. Một tiến trình nền định kỳ quét các sự kiện chưa xử lý bằng câu lệnh `SELECT ... FOR UPDATE SKIP LOCKED` để gửi đi. Dữ liệu chấp nhận độ trễ vài trăm mili-giây nhưng đảm bảo độ tin cậy chuyển giao sự kiện mà không cần thiết lập giao thức 2PC phức tạp."
- Kết quả: "Toàn bộ sự kiện nghiệp vụ báo giá đều được chuyển giao an toàn kể cả khi dịch vụ gửi thư bên thứ ba gặp sự cố gián đoạn tạm thời."

---

### Luồng 3: Zod Single Source of Truth và Tầng Giao Vận `openapi-fetch`

#### Tệp mã nguồn liên quan:

- Định nghĩa Schema ở Backend: `backend/src/modules/quotes/dto/create-quote.dto.ts` và `quote-response.dto.ts` (sử dụng `createZodDto`).
- Xuất bản tài liệu: `backend/openapi.json`.
- Tác vụ đồng bộ Frontend: `package.json` -> `"types:sync": "bun run types:backend && bun run types:pull"`.
- Sử dụng kiểu dữ liệu ở Frontend: `storefront/src/types/api-schema.d.ts`, `admin/src/types/api-schema.d.ts` và `api-client.ts`.

#### Cơ chế vận hành:

- Trước đây: Backend thay đổi cấu trúc trường nhưng Frontend không được cập nhật kịp thời, dẫn đến lỗi truy cập thuộc tính không tồn tại trên môi trường production (Contract Drift).
- Thiết kế hiện tại: Zod schema ở Backend vừa đảm nhiệm việc xác thực dữ liệu đầu vào, vừa tự động sinh tệp mô tả chuẩn OpenAPI 3.1. Frontend dùng công cụ `openapi-typescript` tạo tệp định kiểu tĩnh `api-schema.d.ts` kết hợp với `openapi-fetch` để gọi API.
- Khi có sự thay đổi sai lệch về trường dữ liệu, lệnh `bun run check-types` sẽ phát hiện ngay ở bước biên dịch.

#### Kịch bản trình bày 90 giây:

- Bối cảnh: "Dự án được phân tách độc lập giữa Backend NestJS và hai ứng dụng Frontend Next.js (Storefront và Admin) theo cấu trúc độc lập đa ứng dụng."
- Vấn đề: "Thách thức thường gặp trong các hệ thống phân tách là hiện tượng lệch pha hợp đồng API (Contract Drift): Backend điều chỉnh cấu trúc phản hồi hoặc DTO mà Frontend không nắm được, dẫn đến lỗi giao diện khi chạy thực tế."
- Giải pháp: "Em dùng Zod làm Single Source of Truth tại Backend. Schema của Zod vừa xác thực dữ liệu vào bằng `createZodDto`, vừa sinh tệp đặc tả chuẩn OpenAPI 3.1. Phía Frontend dùng `openapi-typescript` để kéo contract về tạo type tĩnh và gọi dữ liệu qua `openapi-fetch`. Khi Backend có thay đổi về API, lỗi gọi sai trường được phát hiện ngay ở thời điểm compile-time."
- Kết quả: "Rút ngắn thời gian gỡ lỗi giữa hai phía, toàn bộ hệ thống kiểm tra kiểu dữ liệu thành công mà không phải viết lại thủ công các interface."

---

## PHẦN 2: 10 CÂU HỎI NỀN TẢNG

### 1. `GET` khác `POST` thế nào? Khi nào dùng `PUT` vs `PATCH`?

- `GET` dùng để truy vấn dữ liệu, mang tính an toàn (không làm thay đổi trạng thái hệ thống) và Idempotent (gọi nhiều lần cho kết quả như nhau), không mang body. `POST` dùng để tạo mới tài nguyên hoặc kích hoạt tác vụ, không có tính Idempotent.
- `PUT` dùng để thay thế toàn bộ nội dung của tài nguyên bằng dữ liệu mới. `PATCH` dùng để cập nhật một phần, chỉ áp dụng thay đổi cho các trường được gửi lên.

### 2. Mã lỗi `401` khác `403` thế nào? `400` khác `422`?

- `401 Unauthorized` chỉ ra việc chưa xác thực danh tính (chưa đăng nhập hoặc token không hợp lệ). `403 Forbidden` chỉ ra rằng danh tính đã được xác thực nhưng tài khoản không có quyền thực hiện hành động.
- `400 Bad Request` chỉ ra lỗi cú pháp của yêu cầu (như định dạng JSON không hợp lệ). `422 Unprocessable Entity` chỉ ra rằng cú pháp yêu cầu đúng nhưng vi phạm điều kiện nghiệp vụ hoặc xác thực logic.

### 3. Middleware khác Guard và Interceptor trong NestJS thế nào?

Thứ tự thực thi theo vòng đời yêu cầu:

1. Middleware: Chạy đầu tiên ở tầng HTTP, tiếp nhận yêu cầu trước khi chạm đến cơ chế định tuyến (dùng cho ghi log, CORS, phân tích gói tin).
2. Guard: Chạy tiếp theo, kiểm tra quyền truy cập dựa trên thông tin xác thực và vai trò người dùng (Authentication và RBAC).
3. Interceptor: Bọc quanh quá trình thực thi hàm xử lý, can thiệp trước và sau khi hàm chạy (dùng để biến đổi dữ liệu trả về, đo thời gian thực thi hoặc bắt lỗi).

### 4. Tại sao không nên lưu Access Token trong `localStorage`? Lưu ở đâu phù hợp?

Lưu token trong `localStorage` dễ bị tấn công đánh cắp qua lỗ hổng XSS (mã độc JavaScript có thể đọc được dữ liệu này).
Giải pháp phù hợp là lưu Access Token trong bộ nhớ tạm (Memory), và lưu Refresh Token trong Cookie có cấu hình `HttpOnly` (chặn JavaScript truy cập), `Secure` (chỉ truyền qua kết nối mã hóa HTTPS) và `SameSite` (giảm thiểu tấn công CSRF).

### 5. Giao dịch Database (ACID Transaction) là gì?

Bốn tính chất của ACID:

- Atomicity: Tính nguyên tử, toàn bộ các thao tác trong giao dịch cùng thành công hoặc cùng bị hủy bỏ khi có lỗi.
- Consistency: Tính nhất quán, dữ liệu chuyển từ trạng thái hợp lệ này sang trạng thái hợp lệ khác, tuân thủ mọi ràng buộc.
- Isolation: Tính cô lập, các giao dịch chạy đồng thời không làm sai lệch dữ liệu của nhau tùy theo mức cô lập cấu hình.
- Durability: Tính bền vững, dữ liệu đã commit được lưu an toàn xuống đĩa cứng và không bị mất khi hệ thống dừng đột ngột.

### 6. B-Tree Index hoạt động thế nào? Khi nào không nên đánh index?

B-Tree sắp xếp dữ liệu theo dạng cây tự cân bằng, giúp chuyển đổi phép quét toàn bộ bảng thành phép tìm kiếm theo nhánh cây với độ phức tạp $O(\log N)$.
Không nên tạo chỉ mục khi bảng có tần suất ghi rất cao nhưng ít khi đọc (vì mỗi thao tác ghi phải cập nhật lại cấu trúc cây), hoặc khi cột có độ phân tán dữ liệu thấp (như cột chỉ mang hai giá trị true/false).

### 7. Sự khác biệt giữa `Promise.all` và `Promise.allSettled` trong JavaScript?

`Promise.all` thực thi các promise đồng thời và dừng ngay khi có bất kỳ một promise nào bị từ chối (reject).
`Promise.allSettled` đợi toàn bộ các promise hoàn tất bất kể thành công hay thất bại, trả về danh sách trạng thái và kết quả của từng promise.

### 8. Cơ chế Event Loop trong Node.js phân chia Microtask và Macrotask ra sao?

Node.js sử dụng một luồng chính cho việc thực thi mã JavaScript và chuyển các tác vụ I/O xuống tầng hệ điều hành hoặc threadpool của Libuv.
Khi ngăn xếp rỗng, Event Loop ưu tiên giải phóng toàn bộ hàng đợi Microtask (`process.nextTick`, callback của Promise) trước khi lấy một tác vụ tiếp theo từ hàng đợi Macrotask (`setTimeout`, `setInterval`, I/O).

### 9. Lợi ích của Dependency Injection (DI) trong NestJS?

Dependency Injection áp dụng nguyên lý đảo ngược điều khiển (IoC), tách biệt việc khởi tạo đối tượng khỏi việc sử dụng đối tượng. Lợi ích chính là giảm mức độ phụ thuộc trực tiếp giữa các module và tạo thuận lợi cho việc viết Unit Test bằng cách thay thế các service thật bằng mock provider.

### 10. Cách tiếp cận khi xử lý một lỗi kỹ thuật phức tạp?

Khung tiếp cận 4 bước:

1. Xác định hiện tượng: Ghi nhận chính xác mã lỗi, thông báo lỗi và điều kiện tái hiện.
2. Cô lập phạm vi: Kiểm tra log, phân tích dữ liệu đầu vào và khoanh vùng đoạn mã xử lý nghi vấn.
3. Xác định nguyên nhân gốc: Phân tích cơ chế gây lỗi (như sai số dấu phẩy động, điều kiện biên hoặc race condition).
4. Áp dụng giải pháp và phòng ngừa: Sửa đoạn mã, viết test tái hiện để xác nhận lỗi không còn xuất hiện.

---

## PHẦN 3: PHƯƠNG PHÁP XỬ LÝ KHI GẶP CÂU HỎI NGOÀI KỊCH BẢN

### Tình huống 1: Hỏi về thành phần khác trong dự án chưa chuẩn bị sâu

Phương pháp liên kết nội dung:

1. Trả lời ngắn gọn bản chất ở mức tổng quan (10 giây).
2. Dẫn sang phần nghiệp vụ tương đồng đã nắm chắc (20 giây).
   Ví dụ:

- Câu hỏi: "Phần Cache Redis em cấu hình như thế nào?"
- Trả lời: "Ở phần Cache, em áp dụng mô hình Cache-Aside cho danh mục sản phẩm công khai kèm TTL để giảm tải cho PostgreSQL. Ngoài việc làm cache, em dùng Redis làm hạ tầng cho hàng đợi BullMQ để xử lý gửi email kích hoạt và báo giá bất đồng bộ với cơ chế thử lại số mũ..."

### Tình huống 2: Hỏi về công nghệ chưa từng trực tiếp triển khai

Phương pháp tư duy nguyên lý:

1. Xác nhận rõ phạm vi kinh nghiệm thực tế.
2. Phân tích bài toán dựa trên nguyên lý kỹ thuật cơ bản.
3. Thể hiện định hướng tiếp cận khi gặp bài toán thực tế.
   Ví dụ:

- Câu hỏi: "Hệ thống của em có dùng Sharding database hay Read-Replica không?"
- Trả lời: "Ở quy mô dự án hiện tại, em chưa cấu hình Sharding hay Read-Replica vì lượng dữ liệu chưa chạm ngưỡng quá tải của một node PostgreSQL đơn lẻ. Theo nguyên lý, Read-Replica phù hợp khi tỷ lệ truy vấn đọc chiếm đa số để dàn tải từ node chính, còn Sharding áp dụng khi dung lượng dữ liệu và kích thước chỉ mục vượt quá bộ nhớ của một máy chủ vật lý. Khi hệ sinh thái thực tế chạm ngưỡng tải này, em hoàn toàn có thể tìm hiểu tài liệu và triển khai cấu hình tương ứng."

---

## Danh Mục Rà Soát Thực Hành

- [ ] Ngày 1: Mở `quotes.service.ts` và `quote-pricing-cockpit.tsx`, tạo một RFQ từ `/quote`, mở Admin CMS nhập giá thỏa thuận và kiểm tra tính toán tổng tiền. Luyện trình bày Luồng 1.
- [ ] Ngày 2: Mở `outbox.service.ts`, phân tích câu lệnh `SKIP LOCKED` trong việc điều phối sự kiện. Luyện trình bày Luồng 2.
- [ ] Ngày 3: Chạy lệnh `bun run types:sync`, kiểm tra tệp `api-schema.d.ts` và cách `openapi-fetch` tương tác với endpoint. Luyện trình bày Luồng 3.
- [ ] Ngày 4: Ôn tập 5 câu hỏi đầu trong phần câu hỏi nền tảng.
- [ ] Ngày 5: Ôn tập 5 câu hỏi tiếp theo trong phần câu hỏi nền tảng.
- [ ] Ngày 6: Thực hành phương pháp trả lời khi gặp câu hỏi ngoài kịch bản.
- [ ] Ngày 7: Ghi âm tự trình bày tổng quan trong 15 phút để điều chỉnh nhịp nói.
