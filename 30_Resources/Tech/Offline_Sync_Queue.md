---
tags: [type/pattern, topic/architecture, topic/pwa, lang/typescript]
status: seeding
created_at: Thursday, January 29th 2026, 8:09:57 pm +07:00
updated_at: Thursday, January 29th 2026, 8:10:28 pm +07:00
aliases: [Background Sync, Outbox Pattern, Offline First]
---

# Offline Sync Queue (Outbox Pattern)

## 💡 TL;DR
Kỹ thuật lưu trữ các request (API calls) thất bại do mất mạng vào một hàng đợi (Queue) tại Local DB, và tự động gửi lại (Retry) khi thiết bị kết nối internet trở lại.

---

## 🧠 Why use it? (Tại sao dùng?)
- **Problem:** User học xong bài học trên máy bay (Offline). Nếu App cố gọi API update tiến độ -> Lỗi -> Dữ liệu học tập bị mất -> User ức chế.
- **Solution:** "Lưu trước, gửi sau" (Store forward). Đảm bảo tính toàn vẹn dữ liệu (Data Consistency) bất chấp tình trạng mạng.
- **vs Alternative:** So với *Service Worker Background Sync* (native API), cách dùng Queue ở tầng Application (Code tay) hoạt động ổn định hơn trên iOS/Safari.

## 🔍 Deep Dive (Cơ chế hoạt động)

1.  **Intercept:** Chặn hành động của User. Kiểm tra `navigator.onLine`.
2.  **Enqueue (Xếp hàng):** Nếu Offline, đóng gói request (URL, Body, Method) thành 1 cục Object, lưu vào IndexedDB.
3.  **Flush (Xả hàng):** Lắng nghe sự kiện `online`. Khi mạng về, duyệt qua hàng đợi, gửi lần lượt (FIFO - First In First Out).
4.  **Optimistic UI:** Cập nhật giao diện (Tick xanh) ngay lập tức cho user vui, dù thực tế server chưa nhận được tin.

---

## 💻 Code Snippet / Implementation

### 1. Định nghĩa Queue trong DB

```typescript
// db.ts
interface SyncTask {
  id?: number;
  url: string;
  method: 'POST' | 'PUT';
  body: any;
  createdAt: number;
}

// Thêm table 'mutation_queue'
db.version(2).stores({
  lessons: 'id, timestamp',
  mutation_queue: '++id, createdAt' // Auto increment ID
});
```

### 2. Logic Sync Manager (Quản lý đồng bộ)

```typescript
// utils/syncManager.ts
import { db } from './db';

// Hàm gửi request thông minh
export const sendData = async (url: string, body: any) => {
  // Case 1: Có mạng -> Gửi luôn
  if (navigator.onLine) {
    try {
      await fetch(url, { method: 'POST', body: JSON.stringify(body) });
      return;
    } catch (err) {
      console.log('Gửi thất bại, chuyển sang chế độ Offline...');
    }
  }

  // Case 2: Mất mạng (hoặc gửi lỗi) -> Lưu vào Queue
  await db.mutation_queue.add({
    url,
    method: 'POST',
    body,
    createdAt: Date.now()
  });
  console.log('Đã lưu vào Outbox để gửi sau 📮');
};

// Hàm xả hàng (Chạy khi có mạng lại)
export const flushQueue = async () => {
  const tasks = await db.mutation_queue.toArray();
  
  for (const task of tasks) {
    try {
      await fetch(task.url, { 
        method: task.method, 
        body: JSON.stringify(task.body) 
      });
      // Gửi xong thì xóa khỏi hàng chờ
      await db.mutation_queue.delete(task.id!);
    } catch (error) {
      console.error('Vẫn lỗi, giữ lại thử sau');
      break; // Dừng lại, đợi lần sau thử tiếp
    }
  }
};

// Lắng nghe sự kiện mạng
if (typeof window !== 'undefined') {
  window.addEventListener('online', flushQueue);
}
```

---

## ⚠️ Edge Cases / Pitfalls (Cạm bẫy)

- ❌ **Don't:** Xóa Queue khi chưa nhận được response 200 OK từ Server. Nếu Server lỗi 500, phải giữ lại để retry hoặc báo lỗi cho User.
- ✅ **Do:** Xử lý **Conflict**. Ví dụ: Offline sửa tên thành A. Online sửa tên thành B. Khi Queue chạy, cái nào thắng? (Thường lấy cái mới nhất theo timestamp - Last Write Wins).

---

## 🔗 Connections (Mạng lưới)

### Internal (Trong não)
- [[TanStack_Query]] (Hỗ trợ sẵn `mutationCache` để làm việc này dễ hơn)
- [[IndexedDB_Wrapper]]
- [[Optimistic_UI_Update]]

### External (Nguồn tham khảo)
- [Building Offline-First Apps (Google Developers)](https://web.dev/offline-fallback-page/)