tại sao dùng drizzle thay vì prisma?
	- nhẹ hơn, serverless
	- có thể viết sql để hiểu sâu về db hơn

what is 3NF?

#### 1. 📝 Luồng Đàm phán Báo giá B2B (The B2B Quote Negotiation Flow)

- **Map với:** `US-M02` & `US-M03`
    
- **Các Actor/System tham gia:** Client (User) -> Next.js Server Actions -> Neon Postgres -> Admin Client -> Email Service (Nodemailer/Resend).
    
- **Tại sao phải vẽ:** Đây là luồng Asynchronous (Bất đồng bộ về mặt con người). User request hôm nay, nhưng ngày mai Admin mới chốt giá. Phải vẽ để thấy rõ lúc nào state đổi thành `PENDING_REVIEW`, lúc nào Admin chèn `shipping_bids`, và lúc nào DB chạy Transaction để chốt sang `PRICE_UPDATED` rồi nã Email cho khách.
    

#### 2. 💳 Luồng Thanh toán VNPay & Khóa Tồn kho (Payment & Concurrency Lock Flow)

- **Map với:** `US-M04` & `US-M07`
    
- **Các Actor/System tham gia:** Client -> Next.js API -> VNPay Gateway -> VNPay Webhook -> Database (Row-level Lock).
    
- **Tại sao phải vẽ:** HR cực kỳ khoái hỏi cái này! Bro phải vẽ để thể hiện rõ quá trình: Next.js tạo Payment URL -> Client bị redirect sang VNPay -> Client thanh toán xong bị đá về trang `Return URL` (chỉ để hiện UI) -> Đồng thời lúc đó VNPay bắn `IPN Webhook` ngầm về Server để trừ tồn kho và update `status = FULL_PAID`.
    

#### 3. 🤖 Luồng RAG Chatbot Phân luồng Ý định (AI DAG Chatbot Flow)

- **Map với:** `US-S01`
    
- **Các Actor/System tham gia:** Client -> Next.js Route Handler -> LangGraph (Intention Router) -> Neon Postgres (`pgvector`) -> OpenAI -> Client (HTTP Streaming).
    
- **Tại sao phải vẽ:** RAG không phải là gọi API 1 phát ăn luôn. Vẽ để show cho sếp thấy cách LangGraph nhận prompt, quyết định xem có cần gọi `Tool` chọc vào DB hay không, sau đó trộn data với prompt gốc rồi mới stream Text chunk về UI cho user đọc (không bị Vercel chém Timeout).
    

tính năng tìm kiếm gần đúng

#### 4. 🧹 Luồng Dọn dẹp Báo giá Hết hạn (Expired Quote Cronjob Flow)

- **Map với:** `US-S03`
    
- **Các Actor/System tham gia:** Vercel Cron (hoặc Inngest) -> Next.js Background Worker -> Neon Postgres -> Email Service.
    
- **Tại sao phải vẽ:** Để chứng minh bro biết cách xử lý các tác vụ nền (Background Processing) trong môi trường Serverless. Vẽ luồng Cronjob quét DB định kỳ mỗi 1 tiếng, tìm các đơn `PRICE_UPDATED` quá 48h, update thành `EXPIRED` và gửi mail thông báo.

