---
tags: [type/concept, topic/frontend, topic/i18n, nextjs]
date: 2026-01-29
aliases: [Next.js Internationalization, next-intl]
---
# Next-Intl (App Router)

## TL;DR

Thư viện đa ngôn ngữ (i18n) tối ưu nhất cho Next.js App Router hiện tại. Khác biệt cốt lõi là nó tận dụng React Server Components (RSC) để dịch thuật trực tiếp trên server, đẩy về client một cục HTML tĩnh (zero client-side JS) và tự động quản lý Routing/Redirect.

## Core Concept (Lý thuyết)

- **Middleware Interception (Chặn cổng):** Middleware chạy ở Edge sẽ chặn mọi request. Nếu URL thiếu locale (ví dụ: `/about`), nó sẽ phân tích header `Accept-Language` của trình duyệt hoặc Cookie để tự động redirect về URL chuẩn (ví dụ: `/vi/about`).
- **Server-Side Translation:** Hook `useTranslations` đọc file JSON ngôn ngữ từ File System ngay lúc server đang render component. Mã nguồn thư viện và file JSON hoàn toàn KHÔNG bị bundle (đóng gói) xuống trình duyệt, giúp tối ưu tuyệt đối Web Vitals.
- **Strict Type-Safety:** Thông qua file `global.d.ts`, TypeScript sẽ ánh xạ (map) toàn bộ cấu trúc file JSON thành Type. Nếu gõ sai một chữ cái của translation key, trình biên dịch báo lỗi ngay lập tức (Compile-time error).

## Practical Implementation (Thực chiến)

- **Tử huyệt Routing (`Link` Component):** Tuyệt đối cấm dùng `import Link from 'next/link'` gốc của Next.js. Nếu dùng, nó sẽ làm rớt tiền tố locale trên URL $\rightarrow$ request bay lên server $\rightarrow$ Middleware phát hiện thiếu URL $\rightarrow$ Thực hiện vòng lặp Redirect $\rightarrow$ Tốn thêm một round-trip mạng, UX giật lag. Bắt buộc phải wrap và sử dụng custom `Link` từ `next-intl/navigation`.
- **Tử huyệt Performance (Middleware Matcher):** File `middleware.ts` bắt buộc phải có regex loại trừ `/api`, `_next`, và static files. Nếu viết regex sai, middleware sẽ chặn và xử lý cả hàng ngàn file ảnh, làm sập performance của server.
- **Code Snippet (Cơ chế đồng bộ vs bất đồng bộ):**

```typescript
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// 1. Dùng trong UI (RSC) -> Hook Đồng bộ (Sync)
export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}

// 2. Dùng trong Metadata (SEO) -> Hàm Bất đồng bộ (Async)
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('title') };
}
```

---
**Related Notes:**

- Nền tảng render hỗ trợ next-intl: [[React_Server_Components]]
- Cấu trúc thư mục tương thích: [[Modular_Monolith_Architecture]]
