tại sao dùng drizzle thay vì prisma?
	- nhẹ hơn, serverless
	- có thể viết sql để hiểu sâu về db hơn

what is 3NF?

Đây là **Bảng Tech Stack B2B Heavy Logistics (2026 Edition)** chuẩn không cần chỉnh:

#### 1. Core Framework & Runtime

- **Framework:** Next.js 16 (App Router). Bắt buộc để xài React Server Components & Server Actions.
    
- **Runtime / Package Manager:** Bun. (Cực nhanh, thay thế hoàn toàn npm/pnpm).
    

#### 2. Database & ORM (Data Layer)

- **Primary DB:** PostgreSQL (Neon Serverless). Cực xịn vì hỗ trợ scale tự động và branching (tạo nhánh DB như Git).
    
- **Vector DB:** Dùng luôn **`pgvector`** (Extension của Neon) để làm RAG tìm máy phát điện. Không cần Qdrant rườm rà nữa.
    
- **ORM:** Drizzle ORM. Type-safe, nhẹ, và sinh ra raw SQL cực nhanh. Rất hợp với môi trường Serverless (Edge).
    

#### 3. State Management & Frontend UI

- **Global State:** Zustand. (Như đã bàn, dùng để bắn state xuyên lục địa từ Generative UI lên Header).
    
- **Styling:** Tailwind CSS v4.
    
- **UI Components (Thiếu sót cực lớn của bro):** **Shadcn UI** (hoặc Radix Primitives). Đừng tự code lại modal, dropdown hay toast notification. Dùng Shadcn để có UI chuẩn Enterprise và Accessible.
    

#### 4. Background Jobs & Caching (Bộ Não Xử Lý Nền)

- **Job Orchestration:** **Inngest**. (ĐÂY LÀ CÁI BRO THIẾU). Vercel Cron chỉ để trigger, còn để chạy luồng Fan-out (xử lý 50k báo giá hết hạn) hay Dead Letter Queue (Gửi email lỗi) thì Inngest là Trùm Serverless hiện tại. Đánh bại hoàn toàn BullMQ vì không cần host Redis riêng cho Queue.
    
- **Cache & Rate Limiting:** **Upstash Redis** (Serverless Redis). Cực kỳ quan trọng để lưu Guest Cart (Giỏ hàng vãng lai), check Idempotency Key (chống hack thanh toán lặp), và chống Brute-force đăng nhập.
    

#### 5. AI & Integrations (Ecosystem)

- **AI Agent:** **Vercel AI SDK + LangGraph.js**. Dùng để dựng DAG phân luồng ý định và Stream React Components về Client.
    
- **Authentication:** **Auth.js (BetterAuth)**. Xử lý đăng nhập JWT/Session, tích hợp RBAC (Role-Based Access Control) cho Admin và Dealer.
    
- **Email:** **Resend** + React Email (Code template email bằng React).
    
- **Storage:** **Cloudinary** hoặc AWS S3. (Lưu ảnh máy phát điện và file PDF Datasheet).