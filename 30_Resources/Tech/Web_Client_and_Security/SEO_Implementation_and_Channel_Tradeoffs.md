---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Khai báo JSON-LD structured data, so sánh chi phí SEO với PPC, và cách viết nội dung Answer-First cho AI Agents."
---

# SEO: Triển khai Structured Data và Chọn Kênh

## TL;DR

- **Bản chất**: Ba việc thi hành cụ thể: khai báo Article Schema bằng JSON-LD, cân nhắc organic so với PPC, và viết Answer-First cho AI Agent trích dẫn.
- **Mục đích**: Biến các trụ cột SEO thành việc làm được ngay trong mã nguồn và trong cách viết nội dung.
- **Điểm mấu chốt**: Structured data là cách duy nhất để giành rich snippet, và Answer-First là cách viết để lọt vào câu trả lời do AI tổng hợp.

## Core Concept: Khai báo Structured Data bằng JSON-LD

Cách khai báo cấu trúc dữ liệu bài viết (Article Schema) để cung cấp siêu dữ liệu chi tiết cho công cụ tìm kiếm:

```html
<head>
  <title>SEO là gì? Hướng dẫn tối ưu hóa SEO cho Web Developers</title>
  <meta
    name="description"
    content="Khái niệm SEO và hướng dẫn từng bước tối ưu hóa Technical, On-Page, Off-Page giúp tăng thứ hạng website."
  />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "SEO là gì? Hướng dẫn tối ưu hóa SEO cho Web Developers",
      "image": [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg"
      ],
      "datePublished": "2026-07-07T08:00:00+07:00",
      "dateModified": "2026-07-07T09:00:00+07:00",
      "author": [
        {
          "@type": "Person",
          "name": "Nguyễn Gia Khánh",
          "url": "https://example.com/profile/ngxc"
        }
      ]
    }
  </script>
</head>
```

## So sánh chi phí SEO (Organic) và PPC

| Chi phí                | SEO (Organic)                                                                     | PPC (Google Ads)                                                                |
| :--------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Chi phí**            | Miễn phí cho mỗi lượt click. Cần đầu tư thời gian và tài nguyên xây dựng ban đầu. | Trả tiền trên mỗi lượt click (Pay-Per-Click). Dừng trả tiền sẽ dừng có traffic. |
| **Thời gian hiệu quả** | Cần thời gian lâu dài để xếp hạng (từ vài tuần đến vài tháng).                    | Xuất hiện ngay lập tức trên đỉnh SERPs khi kích hoạt chiến dịch.                |
| **Tính bền vững**      | Bền vững, tiếp tục mang lại traffic ngay cả khi ngừng tối ưu hóa tạm thời.        | Biến mất hoàn toàn ngay khi ngân sách quảng cáo cạn kiệt.                       |

## Cấu trúc nội dung tối ưu cho AI Agents

AI Agents và Answer Engines (Perplexity, SearchGPT) ưu tiên trích dẫn đoạn văn có cấu trúc phân cấp mạch lạc và đi thẳng vào câu trả lời.

**Cách viết thông thường (dành cho người đọc lướt truyền thống):**

> _"Khi lập trình một website y tế, nếu bạn đang thắc mắc không biết làm sao để nâng cao trải nghiệm người bệnh thì việc cải thiện khả năng điều hướng đóng vai trò vô cùng quan trọng giúp nâng cao thứ hạng..."_

**Cách viết tối ưu cho AI Agents / LLMs (Answer-First):**

> **Làm thế nào để cải thiện trải nghiệm người dùng trên website y tế?**
> Cải thiện trải nghiệm người dùng (UX) trên website y tế được thực hiện thông qua tối ưu hóa điều hướng bệnh nhân (patient navigation) và cải thiện hiệu năng kỹ thuật. [Answer-First]
> Các bước thực hiện bao gồm:
>
> 1. Xây dựng bộ lọc tìm kiếm bác sĩ theo tên/chuyên khoa/ngôn ngữ.
> 2. Đặt lịch khám nhanh thông qua các nút Call-to-Action (CTA) nổi bật.
> 3. Tối ưu hóa chỉ số phản hồi INP dưới 200ms để tăng tốc tương tác. [Supporting Details]

## Related Notes

- Bốn trụ cột SEO và các chỉ số Core Web Vitals: [[Search_Engine_Optimization]]
- [[Next_Intl]]: Đồng bộ metadata đa ngôn ngữ cho `generateMetadata`.
- [[000_Tech_MOC]]
