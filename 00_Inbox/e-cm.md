Storefront: Next.js (App Router) + Tailwind CSS.

Backend Services: Express.js.

Database: PostgreSQL (Strict ACID compliance for orders/payments).

1. **Giao diện Quản trị (Admin Panel / CMS):**
    
    - Khác với WordPress có sẵn trang /wp-admin, với Express & Postgres, bạn không có chỗ để nhân viên đăng bài, thêm sản phẩm.
        
    - Giải pháp: Bạn phải build thêm một trang Frontend cho Admin (dùng React/Next.js). Hoặc để tiết kiệm thời gian code Admin, bạn có thể dùng các framework xây dựng Admin panel nhanh như **Refine** (rất hợp với NextJS/NodeJS) hoặc sử dụng **Payload CMS** (một Headless CMS cực xịn viết bằng Node.js + Postgres).
        
2. **ORM (Object-Relational Mapping):**
    
    - Để Express.js nói chuyện với PostgreSQL một cách mượt mà và an toàn, đừng viết raw SQL (dễ bị lỗi bảo mật SQL Injection và khó maintain).
        
    - Giải pháp khuyên dùng: **Prisma** hoặc **Drizzle ORM**. Prisma hiện tại đang là combo hoàn hảo khi đi cùng Next.js và Node.js.
        
3. **Hệ thống Caching (Tăng tốc Database):**
    
    - Trang web của bạn có rất nhiều danh mục và bộ lọc (công suất, pha, giá). Mỗi lần khách lọc mà query thẳng vào PostgreSQL thì server sẽ mệt mỏi.
        
    - Giải pháp: Tích hợp thêm **Redis** vào Backend. Lưu các kết quả tìm kiếm/lọc phổ biến vào Redis. Phản hồi sẽ tính bằng mili-giây.
        
4. **Quản lý Hình ảnh:**
    
    - Tránh lưu ảnh trực tiếp trên server chạy Express.
        
    - Giải pháp: Sử dụng **AWS S3** hoặc **Cloudinary** để lưu trữ và tự động tối ưu hóa kích thước ảnh (WebP) đẩy qua CDN.

làm tính năng **"Sticky CTA on Mobile"**. Nghĩa là khi xem web trên điện thoại, khách hàng lướt xuống dưới cùng để đọc thông số kỹ thuật, thì cái nút **"REQUEST A QUOTE"** vẫn luôn ghim cố định ở sát mép dưới màn hình.

**Automation (Tự động hóa bằng Backend Express.js) - BƯỚC ĂN TIỀN:**  
Khi khách hàng bấm Submit cái form này, Backend Express.js của bạn sẽ làm 3 việc cùng lúc:

- Lưu Data vào PostgreSQL.
    
- Gửi 1 Email xác nhận tự động (kèm số Reference Number) cho khách.
    
- **Bắn 1 tin nhắn tự động (Webhook) vào Group Zalo của team Sales nội bộ:** "🚨 Có khách hàng [Tên doanh nghiệp] vừa yêu cầu báo giá máy [500kVA] ở[TP.HCM]. Số điện thoại: 09... Anh em sale vào nhận lead!"