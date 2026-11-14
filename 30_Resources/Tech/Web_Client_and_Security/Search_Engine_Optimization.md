---
tags: [type/concept, status/permanent]
date: 2026-07-07
description: "Tối ưu hóa công cụ tìm kiếm (SEO) là tập hợp kỹ thuật tối ưu website để tăng thứ hạng tự nhiên trên trang kết quả tìm kiếm (SERPs), chia thành bốn trụ cột."
---

# Search Engine Optimization

## TL;DR

- **Bản chất**: SEO tối ưu ba giai đoạn crawling, indexing và ranking để tăng thứ hạng tự nhiên trên SERP.
- **Mục đích**: Thu organic traffic chất lượng cao và giảm phụ thuộc vào quảng cáo trả phí.
- **Điểm mấu chốt**: Không được index thì mọi tối ưu nội dung vô nghĩa; thứ tự ưu tiên là chặn crawl sai, sửa lỗi index, rồi mới đến nội dung và backlink.

---

## Core Concept

SEO hoạt động dựa trên cơ chế thu thập thông tin (crawling), lập chỉ mục (indexing) và xếp hạng (ranking) của các thuật toán tìm kiếm (như Google RankBrain, PageRank). Để tối ưu hóa hiệu quả và phù hợp với các bản cập nhật mới nhất, SEO được chia thành bốn trụ cột chính:

### 1. Technical SEO

Tập trung vào hạ tầng và cấu trúc kỹ thuật của website để bot tìm kiếm dễ crawl và index.

- **Crawlability & Indexability:** quản lý bằng `robots.txt` và `sitemap.xml` để bot không bị chặn hoặc lãng phí crawl budget.
- **Core Web Vitals:** tối ưu chỉ số trải nghiệm thực tế của người dùng:
  - **INP (Interaction to Next Paint):** thay thế hoàn toàn FID cũ, đo toàn bộ độ trễ tương tác trong vòng đời trang (mục tiêu: **under 200 ms**).
  - **LCP (Largest Contentful Paint):** tốc độ tải nội dung chính (mục tiêu: **under 2.0 - 2.5s**).
  - **CLS (Cumulative Layout Shift):** tính ổn định thị giác của giao diện (mục tiêu: **under 0.1**).
- **Field Data vs Lab Data:** Google ưu tiên **Field Data** (dữ liệu thực tế từ báo cáo CrUX ở phân vị thứ 75) thay vì điểm trong môi trường giả lập (Lab Data như Lighthouse).
- **HTTPS & SSL / Mobile-First Indexing:** bảo mật kết nối và tối ưu hiển thị/hiệu năng trên di động.
- **Structured Data (Schema Markup):** cung cấp siêu dữ liệu JSON-LD để hiển thị rich snippets.

### 2. On-Page SEO

Tối ưu trực tiếp nội dung và các phần tử hiển thị trên website.

- **E-E-A-T Framework:** nội dung phải thể hiện Tính trải nghiệm (Experience), Chuyên môn (Expertise), Uy tín (Authoritativeness) và Độ tin cậy (Trustworthiness) để tối ưu cho cả kết quả tìm kiếm truyền thống và công cụ tìm kiếm AI (AI Overviews / SGE).
- **Content Quality & Search Intent:** nội dung hữu ích, độc bản, đáp ứng chính xác ý định tìm kiếm thay vì nhồi từ khóa.
- **HTML Elements:** tối ưu `<title>`, `<meta name="description">`, và phân cấp tiêu đề `<h1>` đến `<h6>`.
- **Internal Linking & Friendly URL:** xây mạng liên kết nội bộ để phân phối PageRank và giữ URL ngắn gọn, rõ nghĩa.

### 3. Off-Page SEO

Xây dựng uy tín và độ tin cậy qua tín hiệu từ bên ngoài.

- **Backlink Profile:** thu hút liên kết tự nhiên, chất lượng cao từ các trang có độ uy tín lớn (domain authority).
- **Social Signals & Brand Mentions:** tần suất thương hiệu được đề cập trên mạng xã hội và truyền thông trực tuyến.

### 4. Generative Engine Optimization

Tối ưu để trang web được các mô hình ngôn ngữ lớn (LLMs) và tác nhân AI thu thập, hiểu và chọn làm nguồn trích dẫn cho câu trả lời tổng hợp (zero-click answers).

- **Conversational & Answer-First Structure:** trả lời thẳng trọng tâm câu hỏi ngay đầu đoạn để AI Agent dễ trích xuất.
- **Machine Readability:** dùng HTML ngữ nghĩa chuẩn và Schema.org (JSON-LD) chặt chẽ; hạn chế phụ thuộc JavaScript client-side (nên dùng SSR/RSC) để AI crawler dễ đọc.
- **AI Crawler Access:** cấu hình `robots.txt` cho phép các bot AI truy cập:

```text
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /
```

- **llms.txt Standard:** triển khai file `/llms.txt` dạng Markdown súc tích ở thư mục gốc để cung cấp bản đồ tóm tắt nội dung tối ưu riêng cho AI Agents.

## Related Notes

- Khai báo structured data, so chi phí với PPC và cách viết cho AI: [[SEO_Implementation_and_Channel_Tradeoffs]]
- [[000_Tech_MOC]]
