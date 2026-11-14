---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ví dụ Server Action đăng nhập có validate bằng Zod và form client dùng useActionState."
---

# Ví dụ: Server Action Đăng nhập với Zod

## TL;DR

- **Bản chất**: Một action đăng nhập hoàn chỉnh: parse `FormData`, validate bằng Zod ở server, gọi Better Auth kèm headers, luôn trả payload có cấu trúc.
- **Mục đích**: Có mẫu copy được cho mọi action mutate dữ liệu, kèm phía client hiển thị lỗi và trạng thái pending.
- **Điểm mấu chốt**: Không `throw` lỗi thô — luôn trả `{ success, error, fields }` để client hiển thị được thông báo cụ thể.

## Core Concept: Action phía server

```typescript
// apps/storefront/src/features/auth/actions/login.action.ts (Server Action)
"use server";

import { auth } from "@nhatnang/database/auth";
import { headers } from "next/headers";
import { LoginSchema } from "@nhatnang/shared/validators"; // Zod schema dùng chung

export async function loginAction(prevState: any, formData: FormData) {
  // 1. Phân tích dữ liệu từ FormData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 2. Validate dữ liệu bằng Zod ở Server
  const validated = LoginSchema.safeParse({ email, password });
  if (!validated.success) {
    return {
      success: false,
      error: "Dữ liệu đăng nhập không hợp lệ",
      fields: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Thực thi nghiệp vụ xác thực (gọi Better Auth)
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(), // Truyền headers để Better Auth đọc cookies/IP
    });

    return { success: true, userId: result.user.id };
  } catch (error: any) {
    // Luôn trả về payload có cấu trúc cụ thể thay vì ném lỗi thô
    return {
      success: false,
      error: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
    };
  }
}
```

## Form phía Client

```typescript
// apps/storefront/src/features/auth/components/login-form.tsx (Client Component)
'use client';

import { useActionState } from "react";
import { loginAction } from "../actions/login.action";

export default function LoginForm() {
  // useActionState của React 19 quản lý kết quả trả về và trạng thái pending
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label>Email</label>
        <input name="email" type="email" required />
      </div>
      <div>
        <label>Mật khẩu</label>
        <input name="password" type="password" required />
      </div>

      {state?.success === false && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  );
}
```

## Vì sao viết như vậy

- **Zod ở server, không phải chỉ ở client**: validate client chỉ để UX; server phải validate lại vì request có thể bị gọi trực tiếp bằng HTTP POST.
- **`headers: await headers()`**: truyền headers để Better Auth đọc được cookie và IP, thay vì tự parse trong action.
- **Trả về `fields`**: cho phép form highlight đúng trường sai thay vì chỉ hiện một dòng lỗi chung.

## Related Notes

- Cơ chế RPC, vòng đời Action và bảo mật CSRF: [[NextJS_Server_Actions]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[NextJS_Server_Actions_Interview_QA]]
- [[000_Tech_MOC]]
