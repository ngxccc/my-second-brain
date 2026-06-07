---
tags: [type/concept, topic/tech, api-data-design]
date: 2026-06-07
aliases:
  [Quy tắc thiết lập Index, Database Indexing Guidelines, Khi nào dùng Index]
---

# Database Indexing Guidelines

## TL;DR

Quy tắc lựa chọn và thiết lập chỉ mục (Index) hiệu quả cho cơ sở dữ liệu quan hệ: Chọn **Index thường** cho truy vấn cột đơn, **Composite Index** cho lọc/sắp xếp đa cột (tuân thủ Left-Prefix), và **Partial Index** khi chỉ quan tâm đến một tập con dữ liệu tĩnh.

## Index Types & Decision Matrix

### 1. Normal Index (Index đơn cột)

- **Khi nào sử dụng**:
  - Cột thường xuyên xuất hiện trong mệnh đề `WHERE` dưới dạng lọc đơn (ví dụ: `email = ?`).
  - Cột dùng để liên kết bảng (`JOIN`) như khóa ngoại (ví dụ: `customer_id`).
  - Cột dùng để sắp xếp kết quả (`ORDER BY`).
- **Lưu ý**: Tránh index các cột có độ chọn lọc (selectivity) quá thấp (như giới tính `gender` chỉ có Nam/Nữ).

### 2. Composite Index (Index hỗn hợp)

- **Khi nào sử dụng**:
  - Truy vấn lọc đồng thời nhiều cột bằng toán tử `AND` (ví dụ: `WHERE user_id = ? AND status = ?`).
  - Truy vấn lọc một cột và sắp xếp theo một cột khác (ví dụ: `WHERE customer_id = ? ORDER BY created_at DESC`).
- **Quy tắc xếp thứ tự cột (Left-Prefix)**:
  - Đưa cột lọc chính xác (`=`) lên trước các cột lọc phạm vi (`>`, `<`, `LIKE`).
  - Đưa cột có độ chọn lọc cao nhất (chứa nhiều giá trị phân biệt nhất) lên đầu tiên bên trái.

### 3. Partial Index (Index một phần)

- **Khi nào sử dụng**:
  - Chỉ truy vấn trên một tập con dữ liệu xác định bởi điều kiện tĩnh (ví dụ: chỉ lọc các đơn hàng chưa thanh toán `status = 'pending'`).
  - Tránh lập chỉ mục cho các dòng dữ liệu không bao giờ được quét tới (ví dụ: các bản ghi đã bị xóa mềm `is_deleted = true`).
- **Ưu điểm**: Giảm đáng kể dung lượng đĩa, tăng tốc độ ghi (`INSERT`/`UPDATE`) vì không cần cập nhật index cho toàn bộ bảng.

---

## Related Notes

- Nguyên lý Left-Prefix: [[Left_Prefix_Index_Postgres]]
- Placeholder Partial Index: [[Partial_Index]]
- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
