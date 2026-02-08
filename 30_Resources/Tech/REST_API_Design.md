---
tags: [type/concept, topic/backend, lang/typescript, pattern/api-design]
status: seeding  
created_at: Sunday, February 8th 2026, 11:23:13 am +07:00
updated_at: Sunday, February 8th 2026, 11:29:27 am +07:00
aliases: [API Pagination, REST Filtering, API Versioning, Cursor Pagination]
---

# REST API Advanced Resource Manipulation

## 💡 TL;DR

Handling large datasets gracefully by slicing data (Pagination), refining results (Filtering/Sorting), and managing API evolution (Versioning) without breaking the client contract.

---

## 🧠 Why use it?

*(Tại sao phải làm phức tạp vấn đề? Tại sao không cứ `SELECT *` cho nhanh?)*

- **Problem:**
    - **Performance Bottleneck:** Trả về 1 triệu record một lúc sẽ làm Server "toang" (Memory overflow) và Client bị lag (Network latency).
    - **Breaking Changes:** Khi sửa đổi cấu trúc dữ liệu, Client cũ sẽ bị crash nếu không có cơ chế quản lý version.
    - **Bad UX:** User không bao giờ xem hết 1000 items một lúc. Họ cần tìm kiếm (Filter) và sắp xếp (Sort).

- **Solution:**
    - **Pagination:** Chỉ trả về một tập con (subset) dữ liệu (Chunking).
    - **Query Params:** Sử dụng URL parameters chuẩn (`?sort=`, `?filter=`) để client tự do thao tác dữ liệu.
    - **Versioning:** Tạo ra các "snapshot" của API (`v1`, `v2`) để hỗ trợ Backward Compatibility.

- **vs Alternative:**
    - **vs GraphQL:** GraphQL cho phép Client define chính xác data cần lấy (flexible hơn), nhưng khó cache và setup phức tạp hơn REST.
    - **vs RPC (gRPC):** Nhanh hơn nhưng tight coupling, khó debug trên browser hơn REST.

## 🔍 Deep Dive

*(Mổ xẻ vấn đề theo phong cách Giáo sư Tom 🎓)*

1.  **Principle 1: The Cost of Offset (Offset Pagination vs. Cursor Pagination)**
    - **Offset ($O(N)$):** `OFFSET 100000 LIMIT 10`. DB vẫn phải scan qua 100,000 dòng đầu rồi mới vứt đi để lấy 10 dòng cuối. $\rightarrow$ Càng scroll sâu càng chậm.
    - **Cursor ($O(1)$ / $O(log N)$):** `WHERE id > last_seen_id LIMIT 10`. Dựa vào **Index**, DB nhảy thẳng đến record cần tìm. Performance ổn định bất kể data lớn cỡ nào.

2.  **Principle 2: Idempotency & Cacheability**
    - URL chứa đầy đủ thông tin Filter/Sort/Page (`/products?category=shoes&page=2`) giúp request này có thể được **Cache** dễ dàng ở CDN hoặc Browser.

---

## 💻 Code Snippet / Implementation

*(Implementation theo phong cách Kỹ sư Raizo 🔧 - TypeScript/Express)*

```typescript
import { Request, Response } from 'express';

// 🎓 Interfaces: Define rõ input/output
interface PaginationQuery {
  limit?: string;
  cursor?: string; // Base64 encoded ID or Timestamp
  sort?: string;   // e.g., "-created_at"
}

interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
}

// 🔧 Helper: Encode/Decode Cursor (Opaque Cursor Pattern)
const encodeCursor = (date: Date): string => Buffer.from(date.toISOString()).toString('base64');
const decodeCursor = (cursor: string): Date => new Date(Buffer.from(cursor, 'base64').toString('ascii'));

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { limit = '10', cursor, sort = '-createdAt' } = req.query as PaginationQuery;
    const parsedLimit = parseInt(limit);
    
    // 🛡️ Guard Clause: Limit max items to prevent abuse
    if (parsedLimit > 100) return res.status(400).json({ error: "Limit too high" });

    // Build Query (Pseudo-code for generic ORM/QueryBuilder)
    // First Principle: Fetch (limit + 1) to know if there is a next page
    const query = db.collection('products')
      .orderBy('createdAt', sort.startsWith('-') ? 'desc' : 'asc')
      .limit(parsedLimit + 1);

    if (cursor) {
      const lastSeenDate = decodeCursor(cursor);
      // Cursor Logic: Fetch items AFTER the last seen item
      query.where('createdAt', '<', lastSeenDate); 
    }

    const items = await query.get();

    // 🔧 Logic: Determine hasNextPage
    const hasNextPage = items.length > parsedLimit;
    const data = hasNextPage ? items.slice(0, -1) : items; // Remove the extra item
    
    // Generate next cursor for the client
    const nextCursor = (hasNextPage && data.length > 0)
      ? encodeCursor(data[data.length - 1].createdAt)
      : null;

    // Response Standard JSON:API style
    res.json({
      data: data,
      meta: {
        limit: parsedLimit,
        has_next_page: hasNextPage,
        next_cursor: nextCursor // Client just sends this back, logic is hidden
      }
    });

  } catch (error) {
    // Global Error Handler will catch this normally
    res.status(500).json({ error: "Internal Server Error" });
  }
};
```

---

## ⚠️ Edge Cases / Pitfalls

_(Những cái hố mà dev hay lọt xuống)_

### Pagination & Sorting

- ❌ **Don't:** Dùng `Offset Pagination` cho hệ thống Real-time feeds (như News Feed).
    
    - _Lý do:_ Khi user đang xem page 1, có 5 bài viết mới được đẩy lên top. Khi user bấm sang page 2, Offset sẽ bị lệch, user sẽ thấy lại các bài viết cũ của page 1 (Duplicate content).
        
- ✅ **Do:** Dùng `Cursor Pagination` (Based on unique ID or Timestamp).
    
    - _Lợi ích:_ Cursor trỏ vào một điểm cụ thể trong quá khứ, không bị ảnh hưởng bởi dữ liệu mới insert.
        
- ❌ **Don't:** Cho phép user sort theo bất kỳ field nào trong DB.
    
    - _Lý do:_ Nếu sort theo field không được **Index**, DB sẽ phải `Full Table Scan` $\rightarrow$ Server treo.
        
- ✅ **Do:** Whitelist các field được phép sort (VD: `['price', 'created_at', 'name']`).
    

---

## 🚨 Troubleshooting

_(Khi API chạy sai, check ngay mấy cái này)_

### 🔧 "The Missing Item" Mystery

- **Vấn đề:** User báo cáo là bị mất dữ liệu khi chuyển trang.
    
- **Nguyên nhân:** Thường do dùng `Cursor Pagination` dựa trên một field **không unique** (ví dụ: `created_at` trùng nhau).
    
- **Fix:** Luôn dùng `Tie-breaker` khi sort.
    
    - _Sai:_ `ORDER BY created_at`
        
    - _Đúng:_ `ORDER BY created_at, id` (ID là unique, đảm bảo thứ tự luôn determinictic).
        

### 🔧 "URL quá dài"

- **Vấn đề:** Filter quá phức tạp làm URL vượt quá giới hạn (thường là 2048 chars).
    
- **Fix:** Nếu filter quá phức tạp, cân nhắc chuyển endpoint đó sang `POST` (search body) thay vì `GET`, dù vi phạm nhẹ nguyên tắc REST nhưng thực tế (Pragmatic REST) chấp nhận được.
    

---

## 📄 Advanced Mechanics

_(Dành cho các pháp sư Backend)_

### Versioning Strategies

1. **URI Versioning (`/v1/products`)**:
    
    - _Pros:_ Rõ ràng, dễ test trên browser, Cache friendly.
        
    - _Cons:_ Vi phạm nguyên tắc "Resource Identifier" (Product v1 và Product v2 là cùng 1 resource nhưng lại có 2 URI).
        
2. **Header Versioning (`Accept: application/vnd.myapi.v1+json`)**:
    
    - _Pros:_ Giữ URI sạch (`/products`), đúng chuẩn REST (Content Negotiation).
        
    - _Cons:_ Khó test nhanh (cần tool), Cache cấu hình phức tạp hơn (Vary Header).
        
    - _Khuyên dùng:_ URI Versioning cho public API (dễ dùng), Header cho Internal Microservices.
        

---

## 🔗 Connections

### Internal

- [[REST_API_Basics]] (Các method cơ bản GET/POST...)
    
- [[Database_Indexing]] (Hiểu về Index để tối ưu Pagination)
    
- [[HTTP_Caching]] (Cách cache kết quả filter)
    

### External

- [Stripe API Pagination](https://stripe.com/docs/api/pagination) (Tiêu chuẩn vàng về API Design)
    
- [Slack API Design](https://api.slack.com/web) (Tham khảo cách xử lý Cursor)
    