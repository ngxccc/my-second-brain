---
tags: [type/library, topic/frontend, topic/i18n, lang/typescript]
status: seeding
created_at: Thursday, January 29th 2026, 8:25:17 pm +07:00
updated_at: Thursday, January 29th 2026, 8:49:44 pm +07:00
aliases: [Next.js Internationalization, Multilingual Support]
---

# Next-Intl (Next.js i18n)

## 💡 TL;DR

Thư viện i18n "chuẩn chỉ" nhất cho Next.js App Router hiện tại.
* **Điểm ăn tiền:** Hỗ trợ **Server Components** 100% (Zero Client-side JS cho text tĩnh), Type-safe tận răng, và tự động xử lý Routing (`/en`, `/vi`).
* **Nên dùng khi:** Làm dự án Next.js cần đa ngôn ngữ, SEO tốt, không muốn đau đầu config tay.

---

## 🧠 Why use it? (Tại sao dùng?)

- **Problem:** Tự code logic `locale` rất mệt (xử lý redirect, cookie, nested routes). Các thư viện cũ như `react-i18next` cấu hình phức tạp với Server Components.
    
- **Solution:** `next-intl` tích hợp sâu vào Next.js App Router. Nó tự động phát hiện ngôn ngữ user, load file JSON tương ứng ngay trên Server.
    
- **vs Alternative:**
    
    - vs **react-i18next:** `next-intl` nhẹ hơn, API đơn giản hơn cho App Router.
        
    - vs **Tự code:** Đừng "reinvent the wheel". `next-intl` xử lý sẵn ngày tháng, số nhiều (plural), số đếm (currency) chuẩn quốc tế.

## 🔍 Deep Dive (Cơ chế hoạt động)

1. **Middleware Routing:** Chặn mọi request. Nếu URL chưa có locale (vd: `/about`), nó tự redirect sang `/en/about` (hoặc ngôn ngữ mặc định).
    
2. **Server-side Translation:** Component dùng `useTranslations` sẽ đọc file JSON trực tiếp từ server -> Render ra HTML thuần -> Gửi về Client. Cực nhanh và tốt cho SEO.
    
3. **Type-safe JSON:** Kết hợp với TypeScript để báo lỗi ngay lập tức nếu gõ sai key trong file JSON (VD: `t('hom')` -> Lỗi đỏ lòm vì thiếu chữ 'e').

---

## 💻 Code Snippet / Implementation

### 1. Structure & Setup

Tạo cấu trúc thư mục như sau: 
```text
src/
├── messages/           # Kho chứa từ vựng
│   ├── en.json
│   └── vi.json
├── i18n.ts             # Config load file JSON (Request Scope)
├── middleware.ts       # Config Routing & Redirect
├── navigation.ts       # Wrapper cho Link/Router (Quan trọng!)
└── app/
    └── [locale]/       # Dynamic Route bọc toàn bộ App
        ├── layout.tsx
        └── page.tsx
```

### 2. Config Middleware (`src/middleware.ts`)

```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vi'],
  // Used when no locale matches
  defaultLocale: 'en',
  // Tiền tố locale (luôn hiện /en hoặc /vi)
  localePrefix: 'always' 
});

export const config = {
  // Matcher regex để bỏ qua các file không cần dịch (api, images, icons...)
  // Nếu regex sai, middleware chạy vào cả ảnh -> App chậm như rùa.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### 3. Usage in Server Component (`page.tsx`)

```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  // 'HomePage' là namespace trong file json. Giúp scope key lại cho gọn.
  const t = useTranslations('HomePage'); 

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      {/* Date formatting tự động theo locale */}
      <p>{t('created_at', { date: new Date() })}</p> 
    </main>
  );
}
```

### 4. Enable Type-safe (Global Config)

Tạo file `global.d.ts` hoặc config trong `next-env.d.ts` để TS hiểu file JSON. 

```typescript
type Messages = typeof import('./messages/en.json');
// Khai báo global interface cho next-intl hiểu structure file JSON
declare interface IntlMessages extends Messages {}
```

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

### 1. Cái bẫy chết người: `Link` Component
* ❌ **Don't:** Dùng `import Link from 'next/link'`.
    * *Hậu quả:* Link sẽ dẫn về `/about` (mất locale prefix) -> Middleware lại phải redirect -> Tốn round-trip, UX kém.
* ✅ **Do:** Dùng `Link` custom từ `next-intl`.
    * Tạo file `src/navigation.ts`:
        ```typescript
        import {createSharedPathnamesNavigation} from 'next-intl/navigation';
        export const locales = ['en', 'vi'] as const;
        export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation({locales});
        ```
    * Dùng hàng nhà làm: `import { Link } from '@/navigation'`.

### 2. Async Metadata SEO
Trong `generateMetadata`, không dùng hook `useTranslations` được (vì nó sync). Phải dùng `getTranslations` (async).

```typescript
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({params: {locale}}) {
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return {
    title: t('title'),
    description: t('description')
  };
}
```

---

## 🔗 Connections (Mạng lưới)

### Internal (Trong não)

- [[Feature_Based_Folder_Structure]] (Nơi đặt file messages)
    
- [[Server_Side_Rendering_SSR]] (Cơ chế render của next-intl)

### External (Nguồn tham khảo)

- [Next-Intl Docs (App Router)](https://next-intl-docs.vercel.app/docs/getting-started/app-router)
    
- [Next.js Internationalization Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization) 
