**INVEST** (Independent, Negotiable, Valuable, Estimable, Small, Testable). Nó gồm 2 phần:

- **Cốt truyện (Narrative):** Định danh người dùng, hành động và giá trị mang lại.
    
- **Tiêu chí nghiệm thu (Acceptance Criteria - AC):** Dùng định dạng BDD (Behavior-Driven Development) với cấu trúc `Given - When - Then` để bao phủ các Edge Cases (trường hợp biên).

best promt:
**Tao đang code Monorepo Next.js 16 + Neon Postgres Serverless. Mày hãy đóng vai Senior BA, viết cho tao 5 User Stories tập trung vào các Edge Cases khó nhất của việc Filter specs máy phát điện (dùng JSONB) và Tích hợp Webhook VNPay. Yêu cầu viết theo chuẩn Given-When-Then.**

#### 🛒 Epic 1: Product Discovery (Tìm kiếm & Lọc Tã Điền)

_Mấy cái này sẽ chọc thẳng vào cột `specs` dạng JSONB mà hôm trước tui xúi bro setup đấy!_

- **US1.1 (Lọc sâu JSONB):** "Là _chủ xưởng sản xuất_ (User), tôi muốn lọc danh sách máy phát điện theo công suất (VD: > 500 kVA), số pha (3 pha) và loại nhiên liệu (Diesel), để tìm chính xác con máy gánh được hệ thống máy lạnh trung tâm của xưởng."
    
- **US1.2 (So sánh kỹ thuật):** "Là _nhà thầu công trình_ (User), tôi muốn chọn 2-3 model máy phát điện và xem bảng so sánh chi tiết cạnh nhau (độ ồn, mức tiêu hao nhiên liệu/giờ), để dễ dàng chốt phương án trình lên chủ đầu tư."
    
- **US1.3 (Tài liệu đính kèm):** "Là _kỹ sư bảo trì_ (User), tôi muốn tải được file PDF (Manual/Datasheet) ngay trong trang chi tiết sản phẩm, để check trước kích thước bệ đỡ trước khi mua."
    

#### 💳 Epic 2: Checkout & Heavy Logistics (Thanh Toán & Vận Chuyển Khét Lẹt)

_Quên vụ tính phí ship theo cân nặng bình thường đi!_

- **US2.1 (Báo giá thủ công / Request Quote):** "Là _khách hàng doanh nghiệp_ (User), đối với các dòng máy công nghiệp > 1 tỷ VNĐ, tôi muốn có nút 'Yêu cầu báo giá chi tiết' thay vì 'Thêm vào giỏ hàng', để nhận được báo giá gồm cả chi phí cẩu trục và lắp đặt tận nơi."
    
- **US2.2 (Thanh toán cọc VNPay):** "Là _người mua cá nhân_ (User), với máy phát điện dân dụng (20-50 triệu), tôi muốn có thể thanh toán cọc trước 30% qua VNPay, để giữ hàng trong lúc chờ bên kho sắp xếp xe bán tải đi giao."
    
- **US2.3 (Webhook xử lý đơn):** "Là _Hệ thống/Admin_ (System), khi VNPay bắn Webhook xác nhận đã nhận tiền, tôi muốn đơn hàng tự động chuyển status sang 'Đã cọc' và trigger (kích hoạt) logic trừ tồn kho (Row-level lock) trong Neon Postgres để tránh bán lố hàng."
    

#### 🤖 Epic 3: AI DAG Chatbot (Vũ khí Hạng Nặng Phase 4)

_Kết hợp LangGraph để AI có khả năng 'hành động' thay vì chỉ 'nói nhảm'._

- **US3.1 (Intention Routing - Rẽ nhánh ý định):** "Là _khách hàng mù mờ công nghệ_ (User), khi tôi chat 'Xưởng tôi dùng 3 máy lạnh 2 ngựa thì mua máy nào?', tôi muốn Chatbot tự động phân tích ý định, tính toán tổng công suất tiêu thụ và gọi API (Tool Calling) vào Database để query ra 3 model máy phát phù hợp nhất."
    
- **US3.2 (Streaming Response):** "Là _người dùng web_ (User), tôi muốn thấy câu trả lời của AI hiện ra từng chữ một (Text Streaming) ngay lập tức, để không có cảm giác hệ thống bị đơ khi LangGraph đang bận chọc vào Database tìm hàng."
    

#### 👑 Epic 4: CMS Admin (Quản trị Hệ Thống)

- **US4.1 (Quản lý Data Linh Hoạt):** "Là _Admin cửa hàng_ (Admin), tôi muốn có một form nhập liệu động (Dynamic Form) để khi có một dòng máy phát điện chạy năng lượng mặt trời mới ra mắt, tôi có thể tự thêm các thuộc tính mới (như Diện tích tấm pin) vào Database mà không cần gọi Dev sửa code."

- **US (Xử lý Race Condition kho hàng):** _"Là hệ thống (System), khi một báo giá chuyển sang trạng thái PRICE_UPDATED, tôi KHÔNG khóa (lock) số lượng tồn kho của máy phát điện đó. Chỉ khi User thực hiện thành công thanh toán cọc (DEPOSIT_PAID) qua cổng VNPay, tôi mới thực thi Row-level lock trên DB để trừ tồn kho, nhằm tối ưu hóa vòng quay hàng hóa."_
    
- **US (Xử lý Expired Quote - Cron Job):** _"Là hệ thống (System), tôi muốn có một Background Worker (Cron Job) chạy mỗi giờ một lần, tự động quét các đơn báo giá ở trạng thái PRICE_UPDATED đã tồn tại quá 48 tiếng và chuyển chúng sang EXPIRED, đồng thời gửi email thông báo hủy báo giá cho khách hàng để tránh rủi ro biến động giá nguyên vật liệu."_
    
- **US (Split Payment - Thanh toán chia đợt):** _"Là kế toán xưởng (User), đối với báo giá đã được duyệt, tôi muốn thanh toán trước 30% giá trị hợp đồng bằng Credit Card, và hệ thống vẫn giữ đơn hàng ở trạng thái chờ thanh toán phần còn lại (Pending Final Payment) trước khi xuất kho."_

template

**# 📍 User Story: Thanh toán đồng thời (Concurrency Checkout) máy phát điện Clearance Sale  
  
**Tiêu đề:** Xử lý trừ kho an toàn khi thanh toán VNPay  
**Epic:** Order & Payment Management  
  
**Narrative (Cốt truyện):**  
> **As a (Là):** Khách hàng doanh nghiệp.  
> **I want to (Tôi muốn):** Mua thành công chiếc máy phát điện công nghiệp model X đang được xả kho giảm giá sâu (chỉ còn 1 chiếc cuối cùng).  
> **So that (Để):** Đảm bảo tôi không bị trừ tiền oan qua VNPay nếu như có một người khác đã nhanh tay thanh toán mua mất chiếc máy đó trước tôi vài giây.  
  
**✅ Acceptance Criteria (Tiêu chí nghiệm thu - Định dạng BDD):**  
* **Scenario 1: Happy Path - Thanh toán thành công**  
    * **Given:** Trong Database, số lượng tồn kho (stock) của máy phát điện X là `1`.  
    * **When:** Khách hàng A gọi API tạo URL thanh toán VNPay.  
    * **Then:** Hệ thống tạo một bản ghi order trạng thái `pending`, đồng thời lock (khóa) tồn kho tạm thời trong 15 phút (Dùng Redis/DB lock).  
* **Scenario 2: Edge Case - Tranh chấp tài nguyên (Race Condition)**  
    * **Given:** Tồn kho là `1`. Khách A đã bấm thanh toán và đang ở trang nhập thẻ của VNPay (kho đã bị lock).  
    * **When:** Cùng lúc đó, Khách B cũng ấn nút "Mua ngay" chiếc máy X đó.  
    * **Then:** Hệ thống (Backend) phải check trạng thái lock, lập tức trả về lỗi HTTP 409 Conflict và hiển thị UI cho Khách B: *"Máy đang được người khác giao dịch, vui lòng thử lại sau 15 phút"*.**

phương pháp **MoSCoW** (Must have, Should have, Could have, Won't have) để phân thứ tự ưu tiên.

#### 🔴 M - MUST HAVE (Móng Nhà - Không có là dẹp tiệm)

_Đây là MVP (Minimum Viable Product). Team chỉ được phép ngủ khi code xong đống này._

- **US-M01 (Core Catalog):** "Là _Khách truy cập_, tôi muốn xem danh sách máy phát điện và lọc được theo 3 thông số tử huyệt (Công suất kVA, Số pha, Động cơ) ngay trên giao diện, để tìm đúng loại máy xưởng tôi cần." _(Tech: Drizzle query chọc vào cột JSONB)._
    
- **US-M02 (Request Quote Flow):** "Là _Khách hàng doanh nghiệp_, tôi muốn ấn nút 'Yêu cầu báo giá' cho con máy 2 tỷ, điền form thông tin công ty, để hệ thống ghi nhận nhu cầu thay vì bắt tôi thanh toán ngay qua web."
    
- **US-M03 (FSM Admin Core):** "Là _Admin_, tôi muốn đổi trạng thái của cái Báo giá (từ `PENDING_REVIEW` sang `PRICE_UPDATED`) và tự tay nhập thêm phí cẩu trục/phí vận chuyển vào tổng tiền, để chốt giá cuối cùng với khách."
    
- **US-M04 (Concurrency Lock):** "Là _Hệ thống_, khi Admin xác nhận Bán thành công một đơn, tôi muốn thực thi khóa dòng (Row-level lock) trong PostgreSQL để trừ đúng 1 cái máy trong tồn kho, ngăn chặn 2 đại lý mua trùng 1 con máy cuối cùng."
    
- **US-M05 (Auth B2B):** "Là _Đại lý mua sỉ_, tôi muốn có tài khoản đăng nhập để theo dõi trạng thái các tờ trình báo giá của mình."
    

#### 🟡 S - SHOULD HAVE (Lên Đồ - Đắp vào Release 2)

_Hệ thống đã chạy được, giờ đắp mấy cái này vào để tự động hóa, đỡ tốn cơm._

- **US-S01 (AI Chatbot Triage):** "Là _Khách hàng_, tôi muốn chat với AI Assistant (LangGraph), nhập vào 'Xưởng tôi 500m2 dùng 10 máy lạnh' để AI tự gọi Tool quét Database và gợi ý 3 mẫu máy phát điện phù hợp nhất."
    
- **US-S02 (Deposit Gateway):** "Là _Khách hàng_, tôi muốn nhận được một Link Thanh Toán Động có thời hạn 48h để quẹt thẻ/chuyển khoản cọc 30% qua VNPay/Stripe, để giữ chỗ con máy đang hot."
    
- **US-S03 (Compare & Datasheet):** "Là _Kỹ sư vận hành_, tôi muốn chọn 3 con máy để so sánh thông số side-by-side và tải file PDF Datasheet về máy để trình sếp duyệt."
    
- **US-S04 (Cronjob Expire):** "Là _Hệ thống_, tôi muốn chạy Background Job mỗi giờ để tự động hủy (EXPIRED) các báo giá đã tồn tại quá 48 tiếng mà khách chưa thanh toán cọc."
    

#### 🔵 C - COULD HAVE (Đồ Chơi "Flexing" - Trống task thì làm)

_Làm mấy cái này tốn tài nguyên thiết kế dữ liệu, suy nghĩ kỹ trước khi đâm đầu vào._

- **US-C01 (Dynamic Heavy Logistics):** "Là _Hệ thống_, tôi muốn tự động tính toán sơ bộ phí vận chuyển dựa trên trọng lượng máy (từ DB) và khoảng cách địa lý (Google Maps API) thay vì đợi Admin nhập bằng tay."
    
- **US-C02 (Split Payments Dashboard):** "Là _Kế toán mua hàng_, tôi muốn có một giao diện chia đợt thanh toán (Thanh toán lần 1: 30%, Lần 2: 50%, Lần 3: 20% sau khi lắp đặt xong) ngay trên web."
    
- **US-C03 (AI PDF Generator):** "Là _Admin_, khi tôi chốt giá xong, tôi muốn hệ thống tự động sinh ra một file PDF Báo Giá chuẩn format công ty (có mộc đỏ, chữ ký số) và gửi thẳng vào email khách hàng."
    

#### ⚫ W - WON'T HAVE (Cấm Đụng Vào - Bảo vệ Scope)

_Ghi rõ ra để sếp hay PM có lỡ "nảy số" thì lấy cái này ra đập lại._

- **US-W01:** KHÔNG LÀM Sàn giao dịch C2C (Không cho phép user tự đăng bán máy phát điện cũ của họ lên web).
    
- **US-W02:** KHÔNG LÀM Mobile App (React Native/Flutter). Dự án B2B siêu trọng, khách toàn dùng màn hình máy tính bự để soi thông số, làm App là đốt tiền vô ích.
    
- **US-W03:** KHÔNG LÀM Thanh toán bằng Crypto/Bitcoin. Pháp lý rườm rà, tập trung luồng Fiat (VNĐ/USD) trước.