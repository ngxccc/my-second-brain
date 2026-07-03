---
tags: [type/guide, topic/architecture, platform/neon, platform/doppler]
date: 2026-06-29
aliases:
  [
    Đặc tả Kiến trúc Landing Page PETKIT Pura Max,
    Architecture Spec for PETKIT Pura Max Landing Page,
  ]
---

# Architecture and Specification: Helicorp Pura Max Landing Page

## TL;DR

Tài liệu định nghĩa kiến trúc kỹ thuật, mô hình dữ liệu trên **Neon Postgres**, phương pháp quản lý cấu hình bảo mật bằng **Doppler**, và thiết kế các hiệu ứng Scrollytelling, Tracking Webhook cho trang Landing Page giới thiệu máy dọn phân mèo thông minh PETKIT Pura Max.

---

## Core Architecture & Technical Design

### 1. Database Configuration (Neon Postgres)

Thay vì sử dụng các cơ sở dữ liệu truyền thống hoặc Firebase/Supabase, dự án sẽ sử dụng **Neon (Serverless Postgres)** để lưu trữ thông tin đăng ký tư vấn trải nghiệm của khách hàng.

- **Lý do chọn Neon:** Tối ưu chi phí nhờ tính năng tự động scale-to-zero (ngừng hoạt động khi không có request), tốc độ kết nối cực nhanh ở môi trường Edge nhờ kết nối Serverless Driver, và hỗ trợ tạo nhanh các nhánh Database (Database Branching) tương tự Git.
- **Database Schema (Prisma ORM):**

  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }

  model Lead {
    id        String   @id @default(uuid())
    name      String
    phone     String
    email     String
    catCount  Int      @default(1)
    status    String   @default("PENDING") // PENDING, CONTACTED, COMPLETED
    createdAt DateTime @default(now())

    @@index([email])
    @@index([phone])
  }
  ```

### 2. Environment Variables & Security (Doppler)

Để quản lý biến môi trường một cách tập trung, bảo mật và tránh lộ lọt API keys (nhất là Gemini API Key và Database Connection String) khi đẩy lên GitHub, dự án tích hợp **Doppler**.

- **Doppler Setup Flow:**
  1. Tạo một dự án trên Doppler tên là `helicorp-puramax`.
  2. Cấu hình các môi trường: `Development` và `Production`.
  3. Cài đặt các biến môi trường cần thiết:
     - `DATABASE_URL` (Lấy từ Neon Connection String)
     - `GEMINI_API_KEY` (Sử dụng cho chatbot tư vấn)
     - `WEBHOOK_URL` (Webhook của Make.com)
  4. Cài đặt Doppler CLI trên máy local. Chạy lệnh:

     ```bash
     doppler run -- bun dev
     ```

     Đoạn script này sẽ tự động inject toàn bộ biến môi trường từ Doppler Cloud vào runtime Node.js/Bun mà không cần lưu file `.env` thô dưới local.

  5. Tích hợp Doppler với **Vercel**: Liên kết trực tiếp Doppler với Vercel Production. Mỗi khi cập nhật biến môi trường trên Doppler, Doppler sẽ tự động đồng bộ hóa sang biến môi trường (Environment Variables) trên Vercel.

### 3. AI Chatbot Widget (HeLiBot)

- **Backend Proxy:** API Route `/api/chat/route.ts` nhận tin nhắn từ Client, đính kèm System Prompt chỉ định làm _"Trợ lý sức khỏe và tư vấn kỹ thuật PETKIT Pura Max"_, gọi API Gemini và stream kết quả trả về Client.
- **Frontend UI:** Thiết kế một bong bóng trò chuyện nhỏ ở góc phải màn hình, có sẵn các Quick-reply chips để dẫn dắt hành vi người dùng.

### 4. Behavior Tracking & Webhook System

- **Client Behavior Tracker:**
  - Lắng nghe scroll depth bằng Intersection Observer:

    ```typescript
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerToast(`Ghi nhận hành vi: Xem phần ${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 },
    );
    ```

  - Lắng nghe click sự kiện trên các nút chọn màu, thêm giỏ hàng, và wishlist.

- **Live Toast Notification:** Khi có sự kiện tracking, hiển thị một thẻ popup nhỏ tự ẩn sau 3 giây để người đánh giá thấy trực quan.
- **Make.com Webhook Integration:** Khi người dùng điền Form tư vấn thành công:
  1. Client gửi request POST chứa data đến API Route `/api/leads`.
  2. Next.js API Route sẽ đồng thời lưu dữ liệu vào Neon DB bằng Prisma/Drizzle và trigger một request `fetch(WEBHOOK_URL, { method: 'POST', body })` gửi dữ liệu sang Make.com.
  3. Make.com tự động ghi dữ liệu vào Google Sheets và thông báo về kênh chat Discord/Slack.

---

## Implementation Details & Code Examples

### 1. Next.js API Route xử lý Lead & Webhook (`/api/leads/route.ts`)

```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, catCount } = body;

    // 1. Validate dữ liệu
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 },
      );
    }

    // 2. Lưu vào cơ sở dữ liệu Neon
    const lead = await prisma.lead.create({
      data: { name, phone, email, catCount: Number(catCount) },
    });

    // 3. Gửi dữ liệu tới Webhook của Make.com (lấy từ Doppler env)
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error("Lỗi API Route:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
```

### 2. Tải và Inject Biến môi trường với Doppler CLI

Khi phát triển cục bộ, không lưu file `.env`. Thay vào đó, chạy CLI:

```bash
# Đăng nhập và liên kết dự án
doppler login
doppler setup --project helicorp-puramax --config dev

# Chạy môi trường phát triển local
doppler run -- next dev
```

---

## Related Notes

- Dashboard dự án chính: [[000_Helicorp_PuraMax_MOC.md|Helicorp Pura Max MOC]]
- Hướng dẫn thiết lập PARA: [[000_System_Structure.md|System Structure Guide]]
