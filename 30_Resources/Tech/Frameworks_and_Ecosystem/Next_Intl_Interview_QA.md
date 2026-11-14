---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba câu hỏi phỏng vấn về next-intl: khác biệt với react-i18next, hậu quả của việc quên Custom Link, và lỗ hổng path traversal trong request.ts."
---

# Phỏng vấn: next-intl và i18n trong App Router

## TL;DR

- **Bản chất**: Ba câu hỏi về i18n trong App Router: khác gì SPA, vì sao phải dùng Custom Link, và cơ chế fallback chặn path traversal.
- **Mục đích**: Trả lời gọn bằng mốc kỹ thuật (0 KB JS dịch thuật, RTT nhân đôi, allowlist locale) thay vì mô tả thư viện.
- **Điểm mấu chốt**: Điểm ăn tiền là nêu được hậu quả đo được — redirect trung gian làm tăng RTT và Google Bot phải dò qua link trung gian.

## Core Concept: Ba mốc để trả lời

- **Kiến trúc**: RSC đọc JSON bản dịch từ đĩa ở server, client nhận HTML đã dịch → **0 KB JS dịch thuật**.
- **Hiệu năng**: mất prefix locale là mất thêm một vòng redirect 302/307, tức nhân đôi RTT.
- **Bảo mật**: `locale` từ URL là dữ liệu người dùng nhập, phải so khớp cứng với allowlist trước khi đưa vào đường dẫn import.

```typescript
// request.ts - ba mốc trên nằm gọn trong đoạn quyết định locale này
const locale = isValidLocale(requestedLocale)
  ? requestedLocale
  : routing.defaultLocale;
```

## Q1: Khác biệt lớn nhất giữa next-intl trong App Router và react-i18next trong ứng dụng SPA?

- **Trả lời:** Ở SPA truyền thống, toàn bộ tệp JSON câu dịch phải được gửi về trình duyệt để JavaScript dịch tại client, làm tăng bundle size và tốn CPU. Với next-intl kết hợp React Server Components trong App Router, tệp JSON được đọc và biên dịch trực tiếp từ ổ đĩa máy chủ; HTML trả về đã điền sẵn ngôn ngữ nên trình duyệt hiển thị ngay với **0 KB JS dịch thuật**.

## Q2: Vì sao quên dùng Custom Link của next-intl lại ảnh hưởng xấu tới hiệu năng và SEO?

- **Trả lời:** Dùng `next/link` gốc thì liên kết mất tiền tố locale (ví dụ `/en/`). Khi người dùng click, middleware phát hiện thiếu prefix và trả về chuyển hướng 302/307 để client tải lại URL đúng `/en/profile`. Vòng chuyển hướng này làm tăng gấp đôi số lần bắt tay kết nối mạng (RTT), làm chậm tốc độ tải trang, và buộc Google Bot dò quét qua link trung gian, kéo giảm thứ hạng SEO.

## Q3: Cơ chế "fallback" an toàn trong file `request.ts` giải quyết lỗi bảo mật nào?

- **Trả lời:** Nó chặn khai thác đường dẫn tệp (Path Traversal/IDOR). Nếu import trực tiếp `await import(\`../../messages/${locale}.json\`)`mà không lọc, kẻ tấn công có thể đổi`locale`trên URL thành`../../config`hoặc đường dẫn nhạy cảm khác để đọc trộm cấu hình hệ thống. Hàm`isValidLocale`so khớp cứng với mảng`routing.locales` cho phép trước, đảm bảo chỉ import đúng các file ngôn ngữ hợp lệ.

## Related Notes

- Cơ chế middleware, `localePrefix` và type-safety: [[Next_Intl]]
- Cấu hình `request.ts`, custom Link và API đồng bộ/bất đồng bộ: [[Next_Intl_Implementation]]
- [[000_Tech_MOC]]
