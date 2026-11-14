---
tags: [type/concept, status/permanent]
date: 2026-06-07
description: "Giải quyết quan hệ Nhiều-Nhiều bằng bảng liên kết và khóa chính phức hợp."
---

# Junction Table & Composite Primary Keys

## TL;DR

- **Bản chất**: Quan hệ nhiều-nhiều được giải bằng một bảng đứng giữa chứa hai foreign key, với composite primary key `(warehouse_id, product_id)`.
- **Mục đích**: Liên kết hai bảng chính, lưu thuộc tính riêng của quan hệ (`quantity`), và chặn dữ liệu trùng ở mức vật lý.
- **Điểm mấu chốt**: Composite primary key thay cho cột `id` tự tăng mới là thứ chống duplicate; thêm cột `id` riêng sẽ mở đường cho hai dòng cùng cặp khóa.

## Core Concept

1. **Junction Table (Bảng liên kết)**:
   - Bản chất: Giải quyết mối quan hệ N-N. Ví dụ, một sản phẩm có thể ở nhiều nhà kho, một nhà kho có thể chứa nhiều sản phẩm. Ta tạo ra bảng ở giữa: `warehouse_stocks`.
   - Nhiệm vụ: Liên kết `product_id` và `warehouse_id`, đồng thời lưu trữ thông tin đi kèm (ví dụ: `quantity` tồn kho).

2. **Composite Primary Key (Khóa chính phức hợp)**:
   - Cách thiết lập: Không dùng UUID hay cột tự tăng (`id`) riêng lẻ. Thay vào đó, gộp chung hai khóa ngoại `(warehouse_id, product_id)` làm khóa chính.
   - Lợi ích: Ràng buộc tính duy nhất ở mức vật lý của DB. Không bao giờ cho phép xuất hiện hai hàng trùng lặp cặp khóa ngoại đó, chống Duplicate Data tuyệt đối.

## Concrete Example

```sql
CREATE TABLE warehouse_stocks (
    warehouse_id INT REFERENCES warehouses(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 0,
    PRIMARY KEY (warehouse_id, product_id) -- Khóa chính phức hợp
);
```

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
- Quy tắc đặt tên DB: [[DB_Naming]]
