---
tags: [type/pattern, topic/security, topic/frontend, lang/typescript]
status: seeding
created_at: Thursday, January 29th 2026, 8:12:38 pm +07:00
updated_at: Thursday, January 29th 2026, 8:13:04 pm +07:00
aliases: [AES Encryption, Secure Local Storage]
---

# Client-Side Encryption (Data at Rest)

## 💡 TL;DR
Kỹ thuật mã hóa dữ liệu trước khi lưu xuống bộ nhớ trình duyệt (LocalStorage/IndexedDB) và giải mã khi lấy ra sử dụng, nhằm ngăn chặn việc đọc trộm dữ liệu nhạy cảm thông qua DevTools hoặc XSS cơ bản.

---

## 🧠 Why use it? (Tại sao dùng?)
- **Problem:** IndexedDB và LocalStorage lưu dữ liệu dưới dạng Plain Text. Bất kỳ ai có quyền truy cập vật lý vào máy hoặc script độc hại (XSS) đều có thể đọc được nội dung nhạy cảm (Draft tin nhắn, Offline Queue chứa password...).
- **Solution:** Biến dữ liệu thành một chuỗi ký tự vô nghĩa (Ciphertext) bằng thuật toán AES trước khi lưu.
- **vs Alternative:** So với việc không mã hóa, cách này thêm một lớp bảo vệ (Defense in Depth). Tuy nhiên, không bảo mật tuyệt đối nếu kẻ tấn công lấy được cả "Chìa khóa" (Key).

## 🔍 Deep Dive (Cơ chế hoạt động)

1.  **Algorithm:** Sử dụng **AES (Advanced Encryption Standard)** - tiêu chuẩn mã hóa đối xứng (Symmetric), nhanh và đủ mạnh cho client.
2.  **Key Management (Vấn đề hóc búa):** Chìa khóa để ở đâu?
    * *Cách 1 (Đơn giản):* Lưu Key trong biến môi trường (`NEXT_PUBLIC_ENCRYPTION_KEY`). -> Chống tò mò, không chống được Hacker pro (vì key lộ trong source code).
    * *Cách 2 (An toàn hơn):* Sinh Key ngẫu nhiên mỗi phiên làm việc hoặc lấy từ Token đăng nhập của user.

---

## 💻 Code Snippet / Implementation
*(Sử dụng thư viện quốc dân `crypto-js`)*

```typescript
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_APP_SECRET || 'my-secret-key';

// Helper: Mã hóa Object -> Chuỗi bí ẩn
export const encryptData = (data: any): string => {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Helper: Giải mã Chuỗi bí ẩn -> Object
export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Decryption failed! Dữ liệu có thể đã bị can thiệp.');
    return null;
  }
};

// 👉 Áp dụng vào Offline Queue
// Lúc lưu vào DB
await db.mutation_queue.add({
  url: '/api/change-password',
  body: encryptData({ oldPass: '123', newPass: '456' }), // 🔒 Đã mã hóa
  createdAt: Date.now()
});

// Lúc lấy ra gửi đi (Flush)
const task = await db.mutation_queue.get(1);
const body = decryptData(task.body); // 🔓 Giải mã để gửi lên Server
```

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

- ❌ **Don't:** Lưu `SECRET_KEY` cứng trong code và push lên GitHub public.
- ❌ **Don't:** Tin tưởng tuyệt đối. Nếu Hacker cài được Keylogger hoặc có quyền kiểm soát trình duyệt (Extension độc hại), họ vẫn có thể đánh cắp Key hoặc dữ liệu ngay lúc bạn vừa giải mã (Memory Dump).
- ✅ **Do:** Coi đây là biện pháp "Obfuscation" (Làm rối) để ngăn chặn tò mò, chứ không thay thế được HTTPS và Server-side Security.

---

## 🔗 Connections (Mạng lưới)

### Internal (Trong não)
- [[Offline_Sync_Queue]]
- [[Environment_Variables]]

### External (Nguồn tham khảo)
- [CryptoJS Documentation](https://github.com/brix/crypto-js)
- [OWASP Client-Side Storage Risks](https://owasp.org/www-project-top-ten/)