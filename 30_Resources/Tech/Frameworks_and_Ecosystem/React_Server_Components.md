---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Cơ chế render UI trên server, gửi payload tĩnh về client, và ranh giới `'use client'` trong React Server Components."
---

# React Server Components vs. Client Components

## TL;DR

- **Bản chất**: RSC render trên server ra HTML và RSC Payload, không gửi JS của component về browser; Client Component render trước ở server rồi hydrate.
- **Mục đích**: Giảm bundle size và cho phép component truy cập trực tiếp database hoặc file system.
- **Điểm mấu chốt**: Ranh giới `'use client'` là ranh giới bundle: mọi thứ import từ đó bị đẩy xuống client, kể cả thư viện nặng.

---

## Core Concept

### 1. Phân biệt thuộc tính kỹ thuật

| Đặc tính             | Server Components (RSC)                                 | Client Components (`'use client'`)                           |
| :------------------- | :------------------------------------------------------ | :----------------------------------------------------------- |
| **Nơi thực thi**     | Chỉ chạy trên Server.                                   | Chạy trên cả Server (Pre-render) và Client (Hydrate).        |
| **JS gửi về Client** | **0 KB (Zero Bundle Size).**                            | Có (bao gồm code của component và các dependency).           |
| **State & Effects**  | Không hỗ trợ (`useState`, `useEffect` bị cấm).          | Hỗ trợ đầy đủ các React Hooks và Custom Hooks.               |
| **Browser APIs**     | Không hỗ trợ (lỗi nếu gọi `window`, `document`).        | Hỗ trợ đầy đủ (sau khi component đã hydrated ở client).      |
| **Data Fetching**    | Gọi trực tiếp Database ORM, đọc file hệ thống, gọi API. | Gọi API qua HTTP client (`fetch`, `axios`) từ trình duyệt.   |
| **Bảo mật**          | Cao (chứa API keys, DB password an toàn).               | Thấp (mọi thứ truyền xuống client đều có thể bị dịch ngược). |

### 2. Ranh giới Client-Server & Quy tắc thiết kế

#### Quy tắc 1: Không thể import Server Component vào Client Component

- **Lý do:** Client Component chạy ở môi trường trình duyệt, mà trình duyệt không thể thực thi code của Server Component (gọi cơ sở dữ liệu, đọc file).
- **Giải pháp (Pattern):** truyền Server Component dưới dạng `children` hoặc một `prop` khác từ một Server Component cha bên ngoài.

```typescript
//  SAI: Import trực tiếp Server Component vào Client Component
'use client';
import MyServerComponent from './MyServerComponent'; // LỖI biên dịch!

//  ĐÚNG: Nhận Server Component dưới dạng children
'use client';
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <div className="client-wrapper">{children}</div>;
}
```

#### Quy tắc 2: Dữ liệu truyền qua ranh giới phải tuần tự hóa được

Khi truyền dữ liệu (props) từ Server Component sang Client Component, các props bắt buộc phải **Serializable** (chuyển được thành chuỗi JSON/RSC Payload).

- **Hợp lệ:** Primitives (string, number, boolean, null, undefined), plain object và array chứa primitives.
- **Không hợp lệ:** Functions, Class Instance (ví dụ đối tượng Drizzle Model phức tạp), Database Connection, và `Date` (phải chuyển thành `.toISOString()` hoặc epoch timestamp trước khi truyền).

### 3. React 19 Streaming & `use()` Hook

Trong React 19 và Next.js 15+, một mô hình tối ưu mới được giới thiệu:

1. Server Component khởi tạo một Promise bất đồng bộ (truy vấn DB hoặc fetch API chậm).
2. Server Component truyền trực tiếp đối tượng **Promise** này làm prop cho Client Component.
3. Client Component dùng hook **`use(promise)`** của React 19 để giải nén dữ liệu ngay tại thời điểm render client, kết hợp thẻ `<Suspense>` ở ngoài để tạo skeleton loading mượt mà.

## Related Notes

- Ví dụ dựng form qua ranh giới này: [[React_Server_Client_Boundary_Examples]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[React_Server_Components_Interview_QA]]
- [[000_Tech_MOC]]
- Cơ chế Dynamic Opt-out: [[NextJS_Dynamic_Opt_Out_Connection]]
- Next.js Server Actions: [[NextJS_Server_Actions]]
