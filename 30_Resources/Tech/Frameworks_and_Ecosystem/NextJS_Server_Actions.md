---
tags: [type/concept, status/permanent]
date: 2026-06-20
description: "Kỹ thuật mutate data trực tiếp từ server bằng RPC ngầm, kèm vòng đời Action của React 19."
---

# Next.js Server Actions & React 19 Integration

## TL;DR

- **Bản chất**: Server Actions là async function chạy trên server nhưng được gọi từ client qua RPC ngầm do compiler sinh ra.
- **Mục đích**: Bỏ phần lớn REST/GraphQL thủ công cho mutation, và dùng `useActionState`/`useFormStatus` để quản lý loading cùng lỗi.
- **Điểm mấu chốt**: Cú pháp giống gọi hàm local nhưng thực chất là network call, nên mọi thứ client gửi lên vẫn phải validate và check quyền ở server.

---

## Core Concept

### 1. Bản chất bên dưới

Mặc dù cú pháp trông giống gọi một hàm local bình thường từ Client, trình biên dịch của Next.js thực chất hoạt động như sau:

```typescript
// Phía client: trông như gọi hàm local, nhưng thực chất là một HTTP POST ngầm
const result = await loginAction(formData);
```

1. **Biên dịch:** khi gặp chỉ thị `"use server"` ở đầu file hoặc đầu hàm, Next.js tự bóc tách hàm đó ra và tạo một API endpoint POST ẩn dạng HTTP RPC.
2. **Giao tiếp:** khi Client kích hoạt hành động (ví dụ bấm submit), Next.js gửi một HTTP POST request lên server với header `Next-Action: <Action-ID>` chứa ID băm của hàm đó, kèm body dạng `multipart/form-data` hoặc `application/json` chứa các tham số truyền vào.
3. **Thực thi:** server nhận request, giải nén tham số, thực thi hàm trong môi trường Node.js (nơi có thể truy cập DB trực tiếp) và trả kết quả dưới dạng serialized payload (chuỗi văn bản đặc biệt của React).

### 2. Sự tiến hóa tích hợp React 19

React 19 chính thức stable các API hỗ trợ quản lý vòng đời của Server Actions (Actions Lifecycle):

- **`useActionState` (thay thế `useFormState` cũ):** quản lý trạng thái trả về của Action (thông báo lỗi, thông báo thành công) và tự nhận diện trạng thái pending.
  `const [state, formAction, isPending] = useActionState(actionFn, initialState);`
- **`useFormStatus`:** đọc trạng thái pending của form cha gần nhất từ bất kỳ component con nằm sâu bên trong, tiện để hiển thị nút submit Loading mà không cần truyền prop.
  `const { pending, data, method, action } = useFormStatus();`
- **`useTransition` / `isPending`:** cho phép gọi Server Action thủ công (không qua form, ví dụ nút tăng lượt like) mà vẫn kiểm soát trạng thái loading để tránh treo UI.

### 3. Vấn đề Bảo mật & CSRF Protection

Do Server Actions tự động tạo endpoint POST, chúng tiềm ẩn nguy cơ bị tấn công **CSRF (Cross-Site Request Forgery)**.

- **Giải pháp mặc định của Next.js:** Next.js tích hợp sẵn cơ chế kiểm tra tiêu đề **`Origin`** và so sánh với host của server. Nếu request đến từ website lạ (ví dụ trang lừa đảo cố tình trigger action qua form), Next.js từ chối ngay lập tức.
- **Bảo vệ Token/Session:** vì chạy trên server, Server Actions kế thừa Cookies của domain gốc, giúp xác thực Session (ví dụ qua **Better Auth**) hoạt động tự động qua việc đọc headers.
- **Giới hạn của cơ chế này:** kiểm tra `Origin` chỉ chặn request từ site khác; nó không thay cho phân quyền — người dùng đã đăng nhập vẫn có thể gọi action mà họ không có quyền, nên quyền phải kiểm tra lại bên trong action.

## Related Notes

- Ví dụ action đăng nhập có validate và form phía client: [[NextJS_Server_Actions_Login_Example]]
- Câu hỏi phỏng vấn và câu trả lời mẫu: [[NextJS_Server_Actions_Interview_QA]]
- [[000_Tech_MOC]]
- Ranh giới Client-Server: [[React_Server_Components]]
