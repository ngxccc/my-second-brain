---
tags: [type/concept, topic/tech, framework/nextjs]
aliases: [NextJS 16 Cache Components, NextJS 16 Caching]
---

# NextJS 16 Cache Components

## TL;DR

Next.js 16 chuyển đổi cơ chế caching từ mô hình fetch-level sang mô hình component-level bằng cách sử dụng các chỉ thị như `'use cache'`, `'use cache: private'`, `'use cache: remote'` để cache dữ liệu trả về của component hoặc hàm một cách trực quan và an toàn.

## Core Concept

- **Tại sao nó tồn tại?**
  Next.js trước đây dựa vào việc ghi đè hành vi của hàm `fetch` toàn cục để lưu cache, gây khó khăn cho việc quản lý cache cấp độ hàm phức tạp (như ORM, SDK bên thứ ba, database queries trực tiếp) và dễ xảy ra xung đột khi lồng ghép cache. Mô hình mới chuyển quyền kiểm soát caching trực tiếp vào mã nguồn qua chỉ thị dạng tuyên bố.

- **Giải quyết bài toán gì?**
  - Caching kết quả truy vấn database trực tiếp (ORM, raw SQL) mà không cần qua HTTP fetch.
  - Tự động hóa việc tạo cache key dựa trên tham số truyền vào hàm.
  - Đảm bảo tính bảo mật của cache đối với dữ liệu nhạy cảm của từng người dùng (`'use cache: private'`).

- **Nó có thay thế cái gì hay không?**
  Thay thế cho hàm `unstable_cache` và các cấu hình `fetch(..., { next: { revalidate } })` trong mô hình cache cũ.

- **Cơ chế hoạt động (How it works under the hood):**
  Khi một hàm được gắn chỉ thị `'use cache'`, Next.js sẽ tự động tạo một cache boundary. Kết quả trả về của hàm sẽ được lưu cache. Các tham số truyền vào hàm tự động được serialize để tạo thành một phần của cache key.

## Practical Implementation

### Trade-offs

- Các tham số truyền vào hàm `'use cache'` phải serialize được (JSON-serializable). Không thể truyền các hàm callback hoặc các lớp phức tạp.
- Yêu cầu cấu hình compiler chi tiết thông qua flag `cacheComponents` trong `next.config.js` trong giai đoạn chuyển giao.

### Code Snippets

#### 1. Caching tĩnh (Ví dụ: Danh mục sản phẩm)

```typescript
import { cacheLife } from "next/navigation";

export async function getCategories() {
  "use cache";
  cacheLife("hours"); // Cache trong 1 giờ

  return await db.select().from(categories);
}
```

#### 2. Caching theo thẻ (Tag-based Revalidation)

```typescript
import { cacheLife, cacheTag } from "next/navigation";

export async function getProductCatalogMetadata() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog-metadata");

  return await db.select().from(products);
}

// Revalidate khi cập nhật sản phẩm ở Admin Action
import { revalidateTag } from "next/cache";

export async function updateProductAdminAction() {
  "use server";
  // Logic cập nhật database...
  revalidateTag("catalog-metadata");
}
```

---

**Related Notes:**

- [[React_Server_Components]]
- [[NextJS_Server_Actions]]
