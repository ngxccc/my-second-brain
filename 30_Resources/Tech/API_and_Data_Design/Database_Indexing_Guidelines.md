---
tags: [type/concept, topic/tech, api-data-design]
date: 2026-06-08
aliases:
  [Quy tắc thiết lập Index, Database Indexing Guidelines, Khi nào dùng Index]
---

# Database Indexing Guidelines

## TL;DR

Quy tắc lựa chọn và thiết lập chỉ mục (Index) hiệu quả cho cơ sở dữ liệu quan hệ dựa trên tính chất chọn lọc (Selectivity), lực lượng (Cardinality) và tần suất truy vấn. Ưu tiên **Composite Index** (tuân thủ Left-Prefix) cho sắp xếp đa chiều, **Partial Index** cho dữ liệu động (loại bỏ các trạng thái tĩnh phổ biến), và hạn chế index các cột có độ trùng lặp cao như status, role.

---

## Core Concepts & Decision Matrix

### 1. Chỉ số quyết định: Cardinality & Selectivity

- **Cardinality (Lực lượng):** Số lượng giá trị duy nhất (unique values) của một cột.
  - _Cardinality cao:_ UUID, Email, Phone, Slug, CreatedAt.
  - _Cardinality thấp:_ Boolean, Enum (status), Role (admin/user).
- **Selectivity (Độ chọn lọc):** Tỷ lệ phần trăm số dòng được trả về so với tổng số dòng của bảng.
  - Chỉ nên index khi câu lệnh query lọc ra **dưới 10-15%** tổng số dòng. Nếu vượt quá, database engine sẽ bỏ qua index để quét tuần tự (`Seq Scan`) vì quét tuần tự trực tiếp trên bộ nhớ đệm nhanh hơn.

### 2. Các loại Index & Nguyên tắc thiết lập

#### Normal Index (Index đơn cột) & Chiều sắp xếp (ASC/DESC)

- Mặc định, khi khai báo index đơn giản, database (B-Tree) sẽ tự động tổ chức và sắp xếp các giá trị theo chiều **Tăng dần (ASC)**.
- Cấu trúc cây chỉ mục (B-Tree) có các liên kết hai chiều ở các nút lá (doubly linked list), cho phép database có thể đọc index từ trái qua phải (Tăng dần) hoặc ngược lại (Giảm dần) với tốc độ tương đương:
  - Truy vấn `ORDER BY score ASC` $\rightarrow$ Database chạy **Index Scan** (quét xuôi).
  - Truy vấn `ORDER BY score DESC` $\rightarrow$ Database chạy **Backward Index Scan** (quét ngược).
- **Kết luận:** Với index trên một cột đơn lẻ, việc định nghĩa chiều sắp xếp ASC hay DESC không quan trọng, database đều tối ưu được cho cả hai chiều sắp xếp.

#### Composite Index (Index hỗn hợp)

- **Khi nào sử dụng:** Khi cần lọc đồng thời nhiều cột (`WHERE col1 = ? AND col2 = ?`) hoặc lọc một cột và sắp xếp theo cột khác (`WHERE col1 = ? ORDER BY col2 DESC`).
- **Nguyên tắc Left-Prefix (Tiền tố bên trái):** PostgreSQL cho phép dùng chung composite index `(col1, col2)` cho các truy vấn chỉ lọc theo `col1`. Do đó, nếu đã có composite index, hãy loại bỏ index đơn lẻ trên `col1` để tránh dư thừa.
- **Quy tắc hướng sắp xếp (ASC/DESC):** Chiều sắp xếp cực kỳ quan trọng đối với Composite Index khi bạn muốn sắp xếp đa chiều khác hướng (ví dụ: `ORDER BY status ASC, created_at DESC`). Nếu bạn chỉ tạo index mặc định `(status, created_at)`, database sẽ lưu dạng `(status ASC, created_at ASC)` và không thể quét tuần tự mà buộc phải thực hiện sắp xếp lại trong RAM (Filesort).
- **Giải pháp:** Bạn phải định nghĩa chính xác chiều sắp xếp trong Composite Index:

  ```typescript
  // Drizzle ORM syntax
  index("idx_name").on(table.status.asc(), table.createdAt.desc());
  ```

#### Partial Index (Index một phần)

- **Khi nào sử dụng:** Khi chỉ truy vấn trên một tập con dữ liệu (ví dụ: chỉ tính toán doanh thu trên các đơn hàng không bị hủy `status != 'cancelled'`).
- **Ưu điểm:** Tiết kiệm dung lượng đĩa, tăng hiệu năng ghi (`INSERT`/`UPDATE`) vì database không cần cập nhật cây chỉ mục cho các trạng thái không được quét tới.

---

## Concrete Examples & Case Studies

### 1. Case Study: Sales Cache vs Stock Cache

- **Sales Cache (`totalSalesCache`):** Cần được index vì người dùng thường xuyên có nhu cầu sắp xếp sản phẩm theo lượng bán ra (`ORDER BY totalSalesCache DESC LIMIT 10`) để hiển thị "Top bán chạy".
- **Stock Cache (`totalStockCache`):** KHÔNG nên index. Truy vấn lọc hàng tồn kho (`WHERE totalStockCache > 0`) có độ chọn lọc cực kỳ thấp vì 95% sản phẩm hiển thị đều còn hàng. Chúng ta cũng hầu như không bao giờ có nhu cầu sắp xếp sản phẩm theo lượng tồn kho tăng/giảm dần.

### 2. Mẫu thiết lập tối ưu cho bảng Orders (Drizzle ORM)

```typescript
export const orders = snakeCase.table("order", {
  id: uuid().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  status: orderStatusEnum().notNull().default("pending"),
  createdAt: timestamp().defaultNow().notNull(),
});

// Thiết lập Index tối ưu:
export const ordersIndexes = (table) => [
  // Composite Index: Dùng cho cả (userId), (userId, status), hoặc phân trang theo createdAt
  index("order_user_status_created_idx").on(
    table.userId,
    table.status,
    table.createdAt,
  ),

  // Partial Index: Tối ưu cho dashboard analytics tính toán doanh thu (loại bỏ đơn hủy)
  index("order_active_metrics_idx")
    .on(table.createdAt)
    .where(sql`${table.status} != 'cancelled'`),
];
```

---

## Related Notes

- Nguyên lý Left-Prefix: [[Left_Prefix_Index_Postgres]]
- Phân biệt dấu nháy đơn và kép trong SQL: [[SQL_Quotes]]
- Bản đồ điều hướng trung tâm: [[000_Tech_MOC]]
