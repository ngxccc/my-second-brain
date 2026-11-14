---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Cấu hình next-intl trong dự án thật: validate locale trong request.ts, custom Link chống vòng lặp redirect, và API đồng bộ/bất đồng bộ."
---

# Next-Intl: Cấu hình và Áp dụng

## TL;DR

- **Bản chất**: Ba miếng cấu hình bắt buộc: `request.ts` validate locale, `routing.ts` sinh custom `Link`, và chọn đúng API đồng bộ hay bất đồng bộ theo ngữ cảnh.
- **Mục đích**: Tránh ba lỗi hay gặp khi làm i18n: đọc file sai đường dẫn, vòng lặp redirect 307, và gọi hook đồng bộ trong hàm async.
- **Điểm mấu chốt**: Không dùng `next/link` gốc — nó không biết prefix locale và sẽ khiến middleware redirect lại một lần nữa.

## Core Concept: Nạp tệp ngôn ngữ và Validate an toàn

Trong dự án Hyundai Ecommerce, file nạp cấu hình ngôn ngữ được viết chặt chẽ nhằm tránh người dùng nhập locale bậy lên URL gây lỗi ứng dụng:

```typescript
// apps/storefront/src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Locale } from "next-intl";

const isValidLocale = (locale: unknown): locale is Locale => {
  return (
    typeof locale === "string" && routing.locales.includes(locale as Locale)
  );
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  // Fallback an toàn nếu người dùng cố tình hack/gõ URL sai locale
  const locale = isValidLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (
      (await import(`../../messages/${locale}.json`)) as {
        default: Record<string, string>;
      }
    ).default,
  };
});
```

## Tránh vòng lặp Redirect bằng Custom Link

- **Nguyên tắc:** tuyệt đối không dùng `Link` mặc định từ `next/link`.
- **Lý do:** `next/link` gốc không tự nhận biết prefix locale. Đang ở `/en/portal` mà bấm `<Link href="/profile">` thì request đi tới `/profile` thiếu prefix → middleware chặn và trả Redirect 307 về `/en/profile` → sinh **vòng lặp redirect**, tốn thêm RTT và làm UX giật lag.
- **Giải pháp:** dùng custom `Link` sinh ra từ `createNavigation(routing)`:

```typescript
// apps/storefront/src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
  localeDetection: false,
});

// Sinh ra Link, redirect, useRouter thông minh tự nhận biết locale segment
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

## Đồng bộ vs Bất đồng bộ trong Dịch thuật

- **Đồng bộ (`useTranslations`):** dùng trực tiếp trong phần render UI của RSC hoặc Client Component.
- **Bất đồng bộ (`getTranslations`):** bắt buộc dùng ở hàm bất đồng bộ ngoài phần render UI như `generateMetadata` hoặc Route Handlers (API).

```typescript
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

// 1. Dùng trong UI (RSC) -> Hook Đồng bộ (Sync)
export default function HomePage() {
  const t = useTranslations("HomePage");
  return <h1>{t("title")}</h1>;
}

// 2. Dùng trong cấu hình SEO -> Gọi Async
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title") };
}
```

## Related Notes

- Cơ chế middleware, `localePrefix` và type-safety: [[Next_Intl]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[Next_Intl_Interview_QA]]
- SEO đa ngôn ngữ cho metadata: [[SEO_Implementation_and_Channel_Tradeoffs]]
- [[000_Tech_MOC]]
