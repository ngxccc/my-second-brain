---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ví dụ dựng form cập nhật thông tin theo mô hình Server Component đọc dữ liệu và Client Component quản lý tương tác."
---

# Ví dụ: Form qua Ranh giới Server - Client

## TL;DR

- **Bản chất**: Trang `/portal/profile` là Server Component đọc dữ liệu an toàn rồi map thành DTO sạch, truyền xuống Client Component `ProfileForm` chỉ để quản lý form.
- **Mục đích**: Có mẫu tách rõ tầng đọc dữ liệu (server) và tầng tương tác (client) cho một trang CRUD thật.
- **Điểm mấu chốt**: Việc map sang DTO trước khi truyền `initialData` là bước bắt buộc, vì props qua ranh giới phải tuần tự hóa được.

## Core Concept: Cách thiết kế Form cập nhật thông tin

Trang chi tiết tài khoản (`/portal/profile`) là một **Server Component** để đọc thông tin người dùng từ cơ sở dữ liệu một cách bảo mật, sau đó map thành DTO sạch và truyền xuống **Client Component** (`ProfileForm`) để quản lý form tương tác:

```typescript
// apps/storefront/app/[locale]/(portal)/portal/profile/page.tsx (Server Component)
import { getCachedSession } from "@/shared/lib/session";
import { userService } from "@nhatnang/database/services";
import ProfileForm from "@/features/portal/components/profile-form";

export default async function ProfilePage() {
  const session = await getCachedSession();
  if (!session) return <div>Unauthorized</div>;

  // Lấy dữ liệu an toàn trên Server
  const user = await userService.getB2BProfile(session.user.id);

  // Map thành Serializable DTO trước khi truyền qua ranh giới Client-Server
  const initialData = {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    companyName: user.companyName ?? "",
  };

  return <ProfileForm initialData={initialData} />;
}
```

```typescript
// apps/storefront/src/features/portal/components/profile-form.tsx (Client Component)
'use client';

import { useForm } from "react-hook-form";

export default function ProfileForm({ initialData }: { initialData: any }) {
  // Quản lý trạng thái tương tác và submit form ở Client
  const { register, handleSubmit } = useForm({ defaultValues: initialData });

  const onSubmit = async (data: any) => {
    // Gọi Server Action để cập nhật dữ liệu
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <button type="submit">Cập nhật</button>
    </form>
  );
}
```

## Vì sao chia đúng như vậy

- **Server Component** giữ session, gọi service và che thông tin nhạy cảm; không có state nên không cần JS xuống browser.
- **Client Component** là tầng lá (leaf) chỉ chứa tương tác: `useForm`, `onSubmit`, các thẻ `<input>`.
- **DTO** ở giữa là chỗ chặn lỗi serialize: `null` được đổi thành `""` để client không phải xử lý hai dạng giá trị rỗng.

## Related Notes

- Ranh giới, quy tắc serialize và streaming: [[React_Server_Components]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[React_Server_Components_Interview_QA]]
- Next.js Server Actions: [[NextJS_Server_Actions]]
- [[000_Tech_MOC]]
