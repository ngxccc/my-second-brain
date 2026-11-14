---
tags: [type/concept, status/permanent]
date: 2026-10-31
description: "Ba câu hỏi phỏng vấn về Next.js Server Actions: cơ chế HTTP POST ngầm, vì sao không ném lỗi thô, và cách chống CSRF."
---

# Phỏng vấn: Next.js Server Actions

## TL;DR

- **Bản chất**: Ba câu hỏi hay gặp: Server Action chạy dưới nền thế nào, vì sao không ném lỗi thô ở Production, và cơ chế chống CSRF.
- **Mục đích**: Trả lời gọn bằng cơ chế thật (header `Next-Action`, RSC Payload, so khớp `Origin`/`Host`) thay vì mô tả cảm tính.
- **Điểm mấu chốt**: Điểm ăn tiền là nói rõ Server Action không phải hàm local: nó là một endpoint POST công khai, nên validate và phân quyền vẫn phải làm ở server.

## Core Concept: Ba mốc để trả lời

- **Cơ chế**: compiler sinh endpoint POST, client gửi kèm header `Next-Action: <Action-ID>`.
- **Lỗi**: `throw` ở Production bị Next.js che thành thông báo chung, nên hãy trả payload có cấu trúc.
- **Bảo mật**: Next.js so `Origin` với `Host`; đây là chống CSRF, không phải phân quyền.

```typescript
// Trả lỗi có cấu trúc để client hiển thị được thông báo cụ thể
return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" };
```

## Q1: Server Actions hoạt động dưới nền tảng như thế nào?

- **Trả lời:** Khi trình duyệt kích hoạt Server Action, nó gửi một yêu cầu **HTTP POST** lên server kèm Header đặc biệt `Next-Action` chứa mã băm định danh của Action. Dữ liệu gửi đi ở dạng `multipart/form-data` (nếu dùng form gốc) hoặc `application/json`. Phản hồi của server là serialized text (React Server Component Payload) chứ không phải JSON thuần, giúp React cập nhật cây DOM ở client mà không cần reload trang.

## Q2: Tại sao không nên ném lỗi thô bên trong Server Action ở Production?

- **Trả lời:** Ở Production, để tránh rò rỉ cấu trúc hệ thống (SQL query lỗi, database password), Next.js tự động mã hóa mọi lỗi bị `throw` thành thông báo chung: _"An error occurred on the server; go to the server logs for details"_. Điều đó làm giảm trải nghiệm vì người dùng không biết cụ thể lỗi gì (trùng email, sai mật khẩu).
- _Quy tắc chuẩn:_ dùng `try/catch`, ghi log ở server, trả về đối tượng có cấu trúc `{ success: false, error: "..." }`.

## Q3: Server Actions giải quyết vấn đề bảo mật CSRF như thế nào?

- **Trả lời:** Next.js tự kiểm tra tiêu đề **`Origin`** của mọi request gọi Server Action và so với tiêu đề **`Host`** của server. Nếu hai giá trị lệch nhau (request được kích hoạt từ site giả mạo), Next.js từ chối xử lý và trả `400 Bad Request` ngay. Cơ chế này chặn các cuộc tấn công CSRF thông dụng mà không cần token CSRF thủ công — nhưng nó không thay cho việc kiểm tra quyền bên trong action.

## Related Notes

- Cơ chế RPC, vòng đời Action và bảo mật CSRF: [[NextJS_Server_Actions]]
- Ví dụ action đăng nhập có validate và form phía client: [[NextJS_Server_Actions_Login_Example]]
- [[000_Tech_MOC]]
