---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Bản mẫu cấu hình `transpilePackages`, `optimizePackageImports`, tsconfig paths và tsup cho package nội bộ trong monorepo Next.js."
---

# Cấu hình Transpile cho Package Nội bộ trong Next.js

## TL;DR

- **Bản chất**: Ba mảnh cấu hình phải khớp nhau: `transpilePackages` ở `next.config.ts`, `paths` + `moduleResolution: "bundler"` ở tsconfig, và `tsup` + `exports` khi pre-build.
- **Mục đích**: Có bản mẫu copy được cho monorepo thật (dự án Hyundai E-commerce dùng đồng thời cả ba gói nội bộ) thay vì tự dò từng trường.
- **Điểm mấu chốt**: Thiếu `moduleResolution: "bundler"` thì VS Code mất autocomplete kiểu; thiếu `exports` map trỏ vào `dist/` thì pre-build không có tác dụng.

## Cấu hình `transpilePackages` và `optimizePackageImports`

Dự án Hyundai E-commerce áp dụng giải pháp JIT (`transpilePackages`) cho cả 3 gói nội bộ dùng chung, đồng thời kết hợp `optimizePackageImports` để tối ưu hóa hiệu năng build và HMR đối với các thư viện giao diện lớn:

```typescript
// apps/storefront/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bắt buộc Next.js SWC/Turbopack biên dịch mã nguồn của 3 package nội bộ này
  transpilePackages: ["@nhatnang/database", "@nhatnang/shared", "@nhatnang/ui"],

  experimental: {
    // Bỏ qua việc transpile/load toàn bộ thư viện, chỉ transpile các module thực sự được import
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "@radix-ui/react-select",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "react-hook-form",
    ],
  },
};

export default nextConfig;
```

- **Vai trò song song:** Trong khi `transpilePackages` đảm bảo _mã nguồn chưa compile_ của các gói nội bộ được biên dịch đúng cách, `optimizePackageImports` lại tối ưu bằng cách đảm bảo Next.js chỉ nạp và xử lý các hàm/component riêng lẻ được sử dụng từ các thư viện giao diện lớn (như Radix UI, Lucide) thay vì biên dịch toàn bộ thư viện đó. Điều này giúp giảm đáng kể thời gian khởi động môi trường dev và giữ bộ nhớ đệm (HMR cache) ở mức tối thiểu.

## Rules: Ba mảnh cấu hình phải khớp nhau

- `transpilePackages` phải liệt kê **mọi** package nội bộ ship raw TypeScript/JSX; thiếu một cái là build vỡ đúng ở file đó.
- `moduleResolution` phải là `"bundler"` (hoặc `"node"`), nếu không `paths` không được TypeScript và VS Code áp dụng.
- Nếu chọn pre-build, `exports` trong `package.json` phải trỏ vào `dist/`; trỏ về `src/` thì build xong vẫn không dùng bản đã biên dịch.
- `optimizePackageImports` chỉ áp cho thư viện bên thứ ba, không thay thế được `transpilePackages`.

## Cấu hình TSConfig để hỗ trợ Type-Safety

Để VS Code và trình biên dịch TypeScript hiểu và gợi ý kiểu dữ liệu (Auto-complete) cho các gói này khi chúng ta đang dev, cấu hình `moduleResolution` bắt buộc phải là `"bundler"` hoặc `"node"`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "paths": {
      "@nhatnang/database/*": ["../../packages/database/src/*"],
      "@nhatnang/shared/*": ["../../packages/shared/src/*"],
      "@nhatnang/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

## Cấu hình thay thế cho `@nhatnang/shared` (Pre-build)

Nếu chuyển sang mô hình Pre-build để tối ưu hiệu suất build của Next.js 16:

```typescript
// packages/shared/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // Tạo file khai báo kiểu dữ liệu .d.ts
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

Cấu hình xuất bản trong `packages/shared/package.json`:

```json
{
  "name": "@nhatnang/shared",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

## Related Notes

- Vì sao cần các cấu hình này và chọn JIT hay AOT: [[NextJS_Monorepo_Package_Transpilation]]
- Câu hỏi phỏng vấn và câu trả lời mẫu về chủ đề này: [[NextJS_Monorepo_Interview_QA]]
- [[000_Tech_MOC]]
- Công cụ build Monorepo: [[Turborepo]]
- Tối ưu bundle phía sau các cấu hình này: [[Tree_Shaking]]
