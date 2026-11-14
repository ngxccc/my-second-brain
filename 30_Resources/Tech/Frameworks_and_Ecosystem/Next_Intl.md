---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Thư viện i18n hỗ trợ strict type-safety, Server Components, và tối ưu URL đa ngôn ngữ cho SEO."
---

# Next-Intl & Internationalization

## TL;DR

- **Bản chất**: next-intl dịch và nạp message ngay trong React Server Components, định tuyến theo `[locale]/` và middleware chuyển hướng theo `Accept-Language` hoặc cookie.
- **Mục đích**: Làm i18n mà không đẩy bundle bản dịch xuống client, đồng thời giữ type-safety cho translation key.
- **Điểm mấu chốt**: Vì dịch ở server nên client chỉ nhận HTML đã dịch; đây là lý do bundle size không tăng theo số ngôn ngữ.

---

## Core Concept

### 1. Cơ chế hoạt động dưới nền tảng

- **Routing & Middleware Interception:** middleware của Next.js chặn các request. Nếu URL thiếu locale (ví dụ `/portal`), middleware phân tích header `Accept-Language` hoặc cookie ngôn ngữ để chuyển hướng tự động sang URL tương ứng (ví dụ `/en/portal`).
- **Server-Side Translation:** khi dùng `useTranslations` trong một Server Component, next-intl đọc file JSON ngôn ngữ trực tiếp từ ổ đĩa máy chủ ở thời điểm render. Mã nguồn tệp dịch JSON hoàn toàn **không bị gửi về client**, giúp giảm bundle size của trình duyệt và tối ưu Core Web Vitals.
- **Cấu hình Request (`getRequestConfig`):** next-intl yêu cầu một file `request.ts` làm cầu nối để tải tệp ngôn ngữ bất đồng bộ dựa trên segment locale hiện tại trên URL, đồng thời tích hợp logic kiểm duyệt đầu vào để tránh người dùng khai thác URL sai locale.

### 2. Tối ưu hóa SEO với `localePrefix: "as-needed"`

Trong file `routing.ts`, cấu hình `localePrefix: "as-needed"` giúp tối ưu cấu trúc URL:

- Đường dẫn ngôn ngữ mặc định (ví dụ tiếng Việt `vi`) hiển thị phẳng dưới dạng gốc (`/portal` thay vì `/vi/portal`).
- Chỉ khi người dùng chuyển sang ngôn ngữ phụ (ví dụ tiếng Anh `en`), prefix mới được chèn vào URL (`/en/portal`).
- Việc này giữ nguyên cấu trúc URL tối ưu cho SEO tại thị trường nội địa chính của doanh nghiệp.

### 3. Strict Type-Safety với Translation Keys

Next-intl cho phép liên kết TypeScript trực tiếp với tệp ngôn ngữ JSON mặc định:

```typescript
// next.config.ts
experimental: {
  createMessagesDeclaration: "./messages/vi.json";
}
```

- Trình biên dịch tự kiểm tra key dịch thuật (ví dụ `t("auth.loginError")`) có tồn tại và đúng cấu trúc trong file JSON hay không; gõ sai chính tả key là TypeScript báo lỗi biên dịch ngay.

## Related Notes

- Nạp tệp ngôn ngữ an toàn, custom Link và API đồng bộ/bất đồng bộ: [[Next_Intl_Implementation]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[Next_Intl_Interview_QA]]
- [[000_Tech_MOC]]
- Cơ chế Dynamic Rendering: [[NextJS_Dynamic_Opt_Out_Connection]]
- React Server Components: [[React_Server_Components]]
