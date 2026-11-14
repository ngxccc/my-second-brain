---
title: NextJS Dynamic Opt Out and connection() API
tags: [type/concept, status/permanent]
date: 2026-06-21
created: 2026-06-20
description: "Cơ chế ngắt Prerender tĩnh và chuyển đổi sang Dynamic Rendering ở Next.js 15/16."
---

# NextJS Dynamic Opt Out and connection() API

## TL;DR

- **Bản chất**: `await connection()` báo cho Next.js biết route phải chạy ở runtime, dừng prerender tĩnh mà không làm crash build.
- **Mục đích**: Bảo vệ route dùng `headers()`, `cookies()` hoặc truy vấn DB theo request khỏi bị đánh giá lúc build.
- **Điểm mấu chốt**: Đây là tín hiệu opt-out tường minh, và là nền của PPR vì cho phép tách phần tĩnh khỏi phần động trên cùng một route.

---

## Core Concept

### 1. Tại sao xảy ra lỗi Prerender khi build?

Next.js App Router mặc định tối ưu hóa tĩnh (Static Optimization). Khi chạy `next build`, trình biên dịch sẽ cố gắng chạy thử (evaluate) tất cả các Server Components và GET Route Handlers để xuất ra file HTML tĩnh nhằm giảm TTFB (Time to First Byte).

Tuy nhiên, tại thời điểm build:

- Không có request thực tế từ client (không có IP, không có URL parameters, không có headers cụ thể).
- Nếu code gọi các hàm động như `headers()`, `cookies()`, hoặc thực hiện truy vấn cơ sở dữ liệu dựa trên thông tin người dùng, Next.js sẽ ném ra lỗi hoặc treo quá trình build vì các thông tin này trống rỗng.

### 2. Sự ra đời của `connection()` trong Next.js 15/16

`connection()` là **hàm nguyên bản (primitive)** tổng quát trong Next.js 15+ để chủ động kích hoạt chế độ dynamic rendering, thay vì chỉ là một giải pháp tình thế (workaround) cho riêng hàm `headers()`.

- **Cú pháp:** `import { connection } from "next/server";`
- **Cơ chế hoạt động:** Khi prerendering engine gặp `await connection()`, nó nhận tín hiệu rằng render này bắt buộc phải là dynamic: Next.js ném ngoại lệ `NEXT_PRERENDER_INTERRUPTED`, ngắt prerender an toàn và defer phần logic phía sau tới runtime.
- **Phạm vi bao phủ:** thay thế cho mọi API động khác như `headers()`, `cookies()`, `searchParams`, `unstable_noStore()`, hoặc truy vấn cơ sở dữ liệu động/gọi API bên thứ ba.

### 3. Đánh đổi: `force-dynamic` vs `connection()`

Trước đây, chúng ta thường dùng `export const dynamic = 'force-dynamic'` để giải quyết lỗi build. Dưới đây là bảng so sánh sự khác biệt:

| Đặc tính         | `force-dynamic`                                          | `connection()`                                                     |
| :--------------- | :------------------------------------------------------- | :----------------------------------------------------------------- |
| **Cơ chế**       | Cấu hình khai báo tĩnh ở đầu file.                       | Hàm thực thi động chạy bên trong code logic.                       |
| **Phạm vi**      | Chuyển toàn bộ route/page thành dynamic.                 | Chỉ chuyển phần code chạy sau nó thành dynamic.                    |
| **Hỗ trợ PPR**   | **Không.** Vô hiệu hóa hoàn toàn static shell của trang. | **Có.** Cho phép render trước static shell và stream phần dynamic. |
| **Độ linh hoạt** | Kém linh hoạt (bắt buộc cấu hình cứng).                  | Cao (có thể gọi lồng trong các hàm helper, services).              |

---

## Practical Implementation

### 1. Ứng dụng trong việc lấy Session an toàn

Trong file `session.ts` của dự án, `getCachedSession` sử dụng `connection()` để lấy header an toàn mà không làm hỏng quá trình build tĩnh:

```typescript
import { cache } from "react";
import { auth } from "@nhatnang/database/auth";
import { headers } from "next/headers";
import { connection } from "next/server";

export const getCachedSession = cache(async () => {
  // connection() báo cho Next.js biết hàm này cần request context thực tế ở runtime.
  // Tránh việc headers() ném lỗi khi build tĩnh.
  await connection();
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.warn("Get cached session error: ", error);
    return null;
  }
});
```

### 2. Ứng dụng trong API Route Handlers

Các API route kiểm tra trạng thái thanh toán hoặc generate link thanh toán (GET) bắt buộc phải dùng `connection()` ở dòng đầu tiên:

```typescript
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { paymentService } from "@nhatnang/database/services";

export async function GET(request: Request) {
  // Ngắt prerender tĩnh ngay lập tức để lấy query params thực tế ở runtime
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    const status = await paymentService.verifyStatus(orderId);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

---

## Interview Prep

### Q1: Lỗi `NEXT_PRERENDER_INTERRUPTED` trong Next.js App Router nghĩa là gì và cách xử lý?

- **Trả lời:** Đây là ngoại lệ Next.js ném ra khi cố static prerender một trang/API nhưng gặp hàm động (`headers()`, `cookies()` hoặc `connection()`), rồi bắt lại để chuyển trang sang Dynamic rendering. Để hết lỗi crash build, hãy gọi hàm động đúng vị trí hoặc dùng `await connection()` để báo rõ cho trình biên dịch.

### Q2: Tại sao Next.js 15+ lại khuyên dùng `connection()` thay vì `export const dynamic = 'force-dynamic'`?

- **Trả lời:** Vì `force-dynamic` là cấu hình thô bạo làm mất hoàn toàn khả năng render tĩnh của trang; `connection()` hỗ trợ **Partial Prerendering (PPR)**: Next.js vẫn tạo static HTML shell (Layout, Header, Footer) và chỉ hoãn phần dynamic (giỏ hàng, thông tin user), cải thiện FCP/TTFB.

---

## Related Notes

- [[000_Tech_MOC]]
- Next.js 16 Caching: [[NextJS_16_Cache_Components]]
- Nền tảng PPR Cloud: [[NextJS_PPR_Platform_Support]]
