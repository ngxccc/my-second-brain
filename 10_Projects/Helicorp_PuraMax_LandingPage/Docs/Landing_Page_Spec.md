---
tags: [type/guide, topic/pet-tech, platform/neon, platform/doppler]
date: 2026-06-29
aliases:
  [Đặc tả Landing Page PETKIT Pura Max, PETKIT Pura Max Landing Page Spec]
---

# Đặc tả Tính năng: Landing Page PETKIT Pura Max

## TL;DR

Tài liệu đặc tả chi tiết giao diện, các phần tính năng cốt lõi, kịch bản scrollytelling, tính năng thương mại điện tử mini, chatbot tư vấn và kế hoạch tối ưu hiệu năng cho dự án Landing Page PETKIT Pura Max của HeLiCorp.

---

## I. Đề xuất Sản phẩm: Máy dọn phân mèo thông minh PETKIT Pura Max

PETKIT Pura Max là thiết bị công nghệ thú cưng cao cấp và được cộng đồng nuôi mèo tại Việt Nam biết đến nhiều nhất. Sản phẩm này có kết cấu cơ học, hệ thống cảm biến phức tạp và hệ sinh thái phụ kiện đa dạng – cực kỳ lý tưởng để thiết kế một Landing Page cao cấp và hiện thực hóa các tính năng nâng cao.

### Cấu trúc các Section bắt buộc

1. **Hero Section:** Hình ảnh PETKIT Pura Max sắc nét, phối cảnh hiện đại cùng chú mèo. Tiêu đề nổi bật làm bật lên lối sống "chăm mèo nhàn tênh thời đại công nghệ".
2. **Section Tính năng nổi bật (Features):** Tập trung vào 3 điểm cốt lõi: Hệ thống dọn phân tự động không kẹt, Khử mùi thông minh, và Hệ thống an toàn xSecure.
3. **Section Thông số kỹ thuật (Specifications):** Thiết kế dạng lưới (grid) hiện đại, trực quan hiển thị kích thước, thể tích bình chứa, loại cát hỗ trợ, và kết nối Wifi.
4. **Form đăng ký:** "Đăng ký nhận tư vấn và ưu đãi trải nghiệm 7 ngày miễn phí tại nhà".

---

## II. Chiến lược hiện thực hóa 100% ĐIỂM CỘNG (Bonus Points)

### 1. Cuộn trang kể chuyện (Scrollytelling) & Hiệu ứng Parallax (GSAP + ScrollTrigger)

PETKIT Pura Max rất phù hợp với kỹ thuật Scrollytelling:

- **Hiệu ứng tách lớp (Exploded View):** Khi người dùng cuộn đến phần tính năng, trang web sẽ ghim (pin) lồng máy lại. Khi cuộn tiếp, lớp vỏ ngoài sẽ mờ dần và tách ra, để lộ: Lồng quay bên trong, lưới lọc cát dẻo, khay chứa rác 7L bên dưới, và bình xịt khử mùi tự động.
- **Mô phỏng chu trình dọn:** Tạo một hiệu ứng cuộn trang làm quay lồng nhẫn (cylinder) theo chiều kim đồng hồ để mô phỏng cách cát sạch được giữ lại và chất thải rơi xuống khay chứa rác.
- **Parallax Background:** Các hạt cát mèo hoặc biểu tượng ion khử mùi bay lơ lửng ở các layer phía sau, di chuyển với tốc độ khác nhau tạo chiều sâu 3D cho website.

### 2. Hệ thống an toàn xSecure (Điểm nhấn tương tác micro-interaction)

Hệ thống xSecure của Pura Max gồm nhiều cảm biến cực kỳ quan trọng. Bạn có thể thiết kế một phần tương tác:

- Khi cuộn trang hoặc hover chuột vào các điểm cảm biến trên thân máy:
  - **Cảm biến hồng ngoại:** Phát ra một vùng quét radar mờ.
  - **Cảm biến trọng lượng:** Hiển thị cân nặng thay đổi của mèo trên màn hình LED ảo.
  - **Cảm biến nhiệt độ:** Hiển thị biểu đồ nhiệt phát hiện vật nuôi đến gần.

### 3. Mini E-commerce (Giỏ hàng, Yêu thích, Sản phẩm đã xem)

- **Trang chọn mua sản phẩm:** Người dùng chọn mua Pura Max bản tiêu chuẩn hoặc bản kèm bộ phụ kiện.
- **Sản phẩm mua kèm (Cross-sell):** Thiết kế mục chọn mua thêm các sản phẩm tiêu hao chính hãng do HeLiCorp phân phối:
  - Nước xịt khử mùi PETKIT.
  - Cuộn túi đựng rác chuyên dụng.
  - Cát đất sét pha gỗ thông PETKIT.
- **Chức năng Cart & Wishlist:** Lưu trực tiếp vào `localStorage`. Khi nhấn "Thêm vào giỏ", một giỏ hàng dạng Drawer (trượt từ cạnh phải) hiện ra cập nhật tổng tiền cực kỳ mượt mà.
- **Đã xem gần đây (Recently Viewed):** Hiển thị các sản phẩm khác thuộc hệ sinh thái HeLiCorp (như Máy cho ăn camera PETKIT YumShare, Máy lọc nước Eversweet 3) để kích thích hành vi xem thêm.

### 4. Chatbot trực tuyến hỗ trợ tư vấn (Tích hợp AI Gemini)

- **Tên Chatbot:** HeLiBot - Trợ lý chăm sóc Thú cưng AI.
- **Nhiệm vụ:** Đóng vai trò chuyên gia giải đáp thắc mắc về PETKIT Pura Max:
  - _"Mèo nhà mình nặng 8kg có dùng vừa Pura Max không?"_ (AI sẽ trả lời: Vừa, vì máy hỗ trợ mèo từ 1.5kg - 10kg).
  - _"Máy có dùng được cát đậu nành không?"_
  - _"Làm sao để tập cho mèo quen dùng máy dọn phân tự động?"_
- **Bảo mật:** Tạo một API Route trung gian trên Next.js để gọi sang Google Gemini API nhằm bảo mật API Key tuyệt đối.

### 5. Webhook dữ liệu & Theo dõi hành vi người dùng (Behavior Tracking)

Đây là phần ghi điểm cực mạnh về tư duy lập trình thực tế:

- **Form Validation:** Validate dữ liệu đăng ký nhận ưu đãi (Tên, Số điện thoại, Email, Số lượng mèo) bằng Zod hoặc Regex chuẩn chỉnh.
- **Webhook thực tế:** Khi submit form, gọi API chuyển tiếp dữ liệu đến Make.com (miễn phí) để lưu vào Google Sheet và bắn thông báo về Discord/Slack cá nhân.
- **Hành vi người dùng (Click & Scroll):** Lắng nghe sự kiện click nút hoặc cuộn trang.
  - **Hiển thị trực quan:** Đề bài yêu cầu _"hiển thị thông báo khi theo dõi hành vi"_. Thiết kế một khung Live Log hoặc Toast Notification nhỏ dưới góc màn hình. Khi người dùng cuộn đến phần cảm biến, toast sẽ báo: `[Tracking] Người dùng đang tìm hiểu Hệ thống cảm biến xSecure`. Khi người dùng click chọn bản màu xám: `[Tracking] Ghi nhận hành vi: Chọn màu sắc Space Gray`. Điều này giúp người chấm bài thấy ngay logic tracking hoạt động mà không cần mở tab Console F12.

### 6. Phát triển chế độ giao diện tối (Dark Mode)

- **Phối màu cho Dark Mode theo phong cách Ultra-premium / Cyberpunk nhẹ:** Tông màu tối chủ đạo (Space Black, Slate) làm nổi bật lên các dải đèn LED cảm biến (màu xanh lá của PETKIT hoặc cam neon).
- **Phối màu Light Mode theo phong cách Clean & Cozy:** Màu trắng sữa, xám nhạt và xanh pastel lá cây (màu thương hiệu PETKIT).

### 7. Tích hợp Backend (Neon Postgres)

- Sử dụng cơ sở dữ liệu **Neon (Postgres)** thay cho Supabase để lưu trực tiếp thông tin khách hàng từ Form đăng ký nhận tư vấn trải nghiệm của người dùng lên Cloud Database, kết nối qua Prisma/Drizzle ORM.

---

## III. Kế hoạch Tối ưu hiệu năng đạt Google PageSpeed Insights Mobile >= 85

Điểm số PageSpeed di động là thử thách lớn khi trang web có nhiều hình ảnh và animation phức tạp.

1. **Sử dụng WebP/AVIF:** Convert toàn bộ ảnh máy dọn phân, mèo, phụ kiện sang WebP.
2. **CSS/SVG Animations:** Ưu tiên dùng CSS keyframes hoặc SVG cho các hiệu ứng quét cảm biến, chuyển động lặp lại để hạn chế gánh nặng JavaScript.
3. **Lazy loading Chatbot & GSAP:** Chỉ load widget Chatbot AI sau khi sự kiện LCP hoàn tất hoặc khi người dùng hover/click vào biểu tượng chat.
4. **Preload Fonts:** Thiết lập preload cho font chữ thương hiệu và sử dụng `font-display: swap` để tránh lỗi CLS (Cumulative Layout Shift).

---

## IV. Đề xuất Tech Stack cập nhật

Để triển khai nhanh nhất trong vài ngày và đạt hiệu năng tối ưu:

- **Frontend:** Next.js (React) - Hỗ trợ SEO tốt nhất, quản lý API Route làm backend cực nhàn.
- **Styling:** Tailwind CSS + CSS Variables (cho Dark Mode mượt mà).
- **Animation:** GSAP (GreenSock) & ScrollTrigger (cho Parallax & Scrollytelling).
- **Database:** Neon Serverless Postgres (kết nối qua Prisma/Drizzle ORM).
- **Environment Management:** Doppler (Quản lý biến môi trường an toàn, đồng bộ hóa trực tiếp lên Vercel).
- **Deployment:** Vercel (Đảm bảo tốc độ tải trang nhanh nhất nhờ hệ thống Edge Network).

---

## Related Notes

- Dashboard dự án chính: [[000_Helicorp_PuraMax_MOC.md|Helicorp Pura Max MOC]]
- Đặc tả Kiến trúc Hệ thống: [[Architecture_and_Spec.md|Architecture and Spec]]
