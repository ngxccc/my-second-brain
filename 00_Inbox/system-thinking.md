# Tư duy Hệ thống: Vũ khí out trình AI trong môi trường Doanh nghiệp

## 1. Core Concept (Luật Sinh Tồn)
- AI (Copilot, Cursor) gen code cực nhanh, nhưng nó mù tịt về **Ngữ cảnh kinh doanh (Business Context)**.
- Doanh nghiệp không trả tiền cho "thợ gõ phím" (code API CRUD). Họ trả tiền cho người có khả năng lắp ráp các mảnh ghép công nghệ để giải quyết bài toán kinh doanh dưới sức ép cực đại của Ràng buộc (thời gian, tiền bạc, tài nguyên server).

## 2. Hệ quy chiếu 9 Thành phần Hệ thống vs. AI
Khi nhìn vào một project, tuyệt đối không lao vào code ngay. Phải quét qua 9 lăng kính:
1. **Purpose (Mục đích):** App này sinh ra để làm gì? Kiếm tiền ở đâu?
2. **Input / Output:** Data đi vào thế nào? User muốn thấy gì?
3. **Elements / Links:** Các thành phần nội bộ (AI có thể làm tốt phần gen ra các function và nối chúng lại).
4. **Interface / Boundary:** Điểm giao tiếp với thế giới bên ngoài (API Gateway) và giới hạn trách nhiệm của từng service.
5. **Environment:** Môi trường deploy (AWS/GCP, k8s, hay con VPS ghẻ 2GB RAM?).
6. **Constraints (CHÍ MẠNG):** Yếu tố quyết định lương thưởng. Giới hạn ngân sách, giới hạn RAM/CPU, giới hạn thời gian release, luật bảo mật dữ liệu.

## 3. Case Study Thực Chiến: Hệ thống X/Twitter Clone
- **Tình huống:** Bùng nổ traffic do một sự kiện viral. 
- **Cách AI giải quyết:** Gen ra `POST /tweets`, query insert thẳng vào MongoDB. **Kết quả:** Quá tải Connection Pool, sập Database, sập toàn bộ hệ thống. AI thất bại vì bỏ qua yếu tố *Environment* (High concurrent users) và *Constraints* (Giới hạn I/O của DB).
- **Cách System Thinker giải quyết:** - Đặt một **Message Queue** (RabbitMQ/Kafka) ở giữa làm buffer hấp thụ Request.
  - Trả về `202 Accepted` ngay lập tức cho user (Cải thiện UX/Interface).
  - Background Worker thong thả kéo data từ Queue ném vào DB theo batch.
  - Tương thêm **Redis** vào để cache dữ liệu News Feed đọc nhiều nhất.
  -> Hệ thống sống sót, chi phí server không đội lên quá cao, doanh nghiệp chốt lời.

## 4. Action Items (3 Năm Tới)
- Ngừng học thuộc lòng cú pháp framework (Bun, React mới).
- Tập trung cày nát Database Design, Caching, Queueing và System Design.
- Mọi dòng code viết ra phải trả lời được: Nó phục vụ *Purpose* gì và bị *Constraints* gì cản trở?