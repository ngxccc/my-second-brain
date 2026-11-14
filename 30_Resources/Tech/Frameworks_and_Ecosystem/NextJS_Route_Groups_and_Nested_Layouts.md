---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Bản chất của Route Groups, cơ chế kế thừa layout lồng nhau, và cách cô lập logic động để bảo vệ Static HTML trong Next.js App Router."
---

# Next.js Route Groups & Nested Layouts Inheritance

## TL;DR

- **Bản chất**: Thư mục `(group)` gom route để chia sẻ layout mà không làm thay đổi URL.
- **Mục đích**: Tách giao diện theo phân khu, và cô lập code dynamic (`headers()`, `cookies()`, auth) vào layout con để root layout vẫn tĩnh được.
- **Điểm mấu chốt**: Đặt một hàm dynamic vào root layout là mất SSG cho toàn site và sinh lỗi `DYNAMIC_SERVER_USAGE`; route group là cách khoanh vùng thiệt hại.

---

## Core Concept

### 1. Bản chất của Route Groups

Next.js App Router ánh xạ trực tiếp cấu trúc thư mục thành URL (File-based Routing). Nhưng nếu tên thư mục được bọc trong ngoặc đơn `(tên)`, trình biên dịch sẽ bỏ qua tên đó khi tạo URL segment.

```text
app/(shop)/checkout/page.tsx   ->  URL: /checkout   (không có /(shop))
```

### 2. Cơ chế kế thừa Layout

Layout lồng nhau (Nested Layouts) xếp theo dạng vỏ hành:

1. **Root Layout (`app/layout.tsx`):** chứa cấu hình toàn cục bắt buộc như `<html>`, `<body>` và các Provider (React Context, Theme).
2. **Sub-Layouts:** layout định nghĩa bên trong Route Groups.

Khi điều hướng giữa các trang trong cùng một Route Group (ví dụ `/portal/debt` sang `/portal/profile` trong nhóm `(portal)`):

- **State Preservation:** Next.js chỉ re-render `page.tsx` thay đổi, giữ nguyên state và DOM của Sub-Layout (không re-mount). Sidebar hay bộ lọc không mất trạng thái cuộn hay dữ liệu đang nhập.
- **Tối ưu hóa:** tránh re-render toàn trang, cho trải nghiệm chuyển trang nhanh tương đương SPA.

### 3. Cô lập Logic động để bảo vệ Static HTML

- **Lỗi `DYNAMIC_SERVER_USAGE` trên Vercel:** nếu kiểm tra phiên đăng nhập bằng `headers()` hoặc `cookies()` ngay tại Root Layout, Next.js biến **tất cả** trang trong dự án thành Dynamic. Khi deploy lên Vercel, các trang tĩnh (404, Login, Landing) cố build tĩnh nhưng thất bại do xung đột môi trường build Serverless.
- **Giải pháp với Route Groups:** tách biệt hoàn toàn — trang công cộng nằm ngoài hoặc ở Route Group tĩnh; trang nội bộ cần bảo mật gom vào Route Group `(protected)` với `layout.tsx` riêng để check session. Kết quả: trang public vẫn build thành HTML tĩnh, chỉ trang dashboard xử lý động.

## Cấu trúc thư mục thực tế (Hyundai Ecommerce)

```
apps/storefront/app/[locale]/
│
├── layout.tsx                <-- Root Layout (Chỉ chứa Providers, i18n, HTML/Body tĩnh)
│
├── (shop)/                   <-- Route Group dành cho trang mua sắm công cộng
│   ├── layout.tsx            <-- Layout chứa Header/Footer bán hàng
│   ├── page.tsx              <-- Trang chủ bán hàng (Tĩnh - SSG)
│   └── products/[slug]/      <-- Trang chi tiết sản phẩm
│
└── (portal)/portal/          <-- Route Group dành cho Đại lý quản lý công nợ (Bảo mật)
    ├── layout.tsx            <-- Layout chứa Sidebar Navigation và check B2B Session
    ├── debt/page.tsx         <-- Trang quản lý công nợ (Động - Dynamic)
    └── profile/page.tsx      <-- Trang thông tin cá nhân (Động - Dynamic)
```

Root Layout không gọi `headers()` hay check Auth; logic động nằm gọn trong Layout của `(portal)`:

```typescript
// apps/storefront/app/[locale]/(portal)/portal/layout.tsx
import { redirect } from "@/shared/lib/session";
import { getCachedSession } from "@/shared/lib/session";
import PortalSidebar from "@/features/portal/components/portal-sidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check auth session an toàn trên server, chỉ ảnh hưởng đến các trang trong /portal
  const session = await getCachedSession();
  if (!session) {
    redirect("/auth/login"); // Điều hướng về login nếu chưa xác thực
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar user={session.user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

## Related Notes

- Câu hỏi phỏng vấn và câu trả lời mẫu: [[NextJS_Route_Groups_Interview_QA]]
- [[000_Tech_MOC]]
- Cơ chế Dynamic Opt-out: [[NextJS_Dynamic_Opt_Out_Connection]]
- Ranh giới Client-Server: [[React_Server_Components]]
