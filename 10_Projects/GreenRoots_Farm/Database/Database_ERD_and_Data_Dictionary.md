---
tags: [type/project, status/active]
date: 2026-11-11
description: "Tài liệu đặc tả thực thể, từ điển dữ liệu và sơ đồ quan hệ ERD cho hệ thống GreenRoots Farm."
---

# Database ERD and Data Dictionary

## TL;DR

- **Bản chất**: Tài liệu đặc tả 14 thực thể cơ sở dữ liệu quan hệ và từ điển dữ liệu chuẩn hóa của dự án GreenRoots Farm.
- **Mục đích**: Cung cấp tài liệu thiết kế chuẩn để thành viên BA vẽ biểu đồ ERD và đội ngũ kỹ sư triển khai Drizzle Schema.
- **Điểm mấu chốt**: Liên kết chặt chẽ giữa Lô hàng, phân bổ FEFO (batch_allocations), nhật ký canh tác bất biến và phiếu xuất hủy hai bước.

---

## 1. Sơ Đồ Quan Hệ Thực Thể

Dưới đây là sơ đồ quan hệ thực thể toàn diện bao phủ toàn bộ 14 bảng dữ liệu của hệ thống:

```mermaid
erDiagram
    FARMS ||--o{ PLOTS : "chia thanh"
    PLOTS ||--o{ SEASONS : "canh tac"
    SEASONS ||--o{ FARMING_LOGS : "ghi nhat ky"
    USERS ||--o{ FARMING_LOGS : "ky su ghi"

    CATEGORIES ||--o{ PRODUCTS : "phan loai"
    PRODUCTS ||--o{ BATCHES : "dong goi"
    SEASONS ||--o{ BATCHES : "thu hoach"

    USERS ||--o{ ORDERS : "dat hang"
    ORDERS ||--o{ ORDER_ITEMS : "gom co"
    PRODUCTS ||--o{ ORDER_ITEMS : "chua"

    ORDER_ITEMS ||--o{ BATCH_ALLOCATIONS : "phan bo"
    BATCHES ||--o{ BATCH_ALLOCATIONS : "xuat kho FEFO"

    USERS ||--o{ SUBSCRIPTIONS : "dang ky"
    ORDERS ||--o{ COMPLAINTS : "khieu nai"
    USERS ||--o{ COMPLAINTS : "khach gui"

    BATCHES ||--o{ WASTE_LOGS : "xuat huy"
    USERS ||--o{ WASTE_LOGS : "nhan vien tao"

    FARMS {
        uuid id PK
        string name
        string address
        numeric latitude
        numeric longitude
        string certification_url
    }

    PLOTS {
        uuid id PK
        uuid farm_id FK
        string plot_code
        numeric area_sqm
        string soil_test_result
        string water_test_result
    }

    SEASONS {
        uuid id PK
        uuid plot_id FK
        string season_name
        date start_date
        date expected_harvest_date
        string status
    }

    FARMING_LOGS {
        uuid id PK
        uuid season_id FK
        uuid staff_id FK
        string action_type
        text description
        string media_urls
        timestamp logged_at
    }

    CATEGORIES {
        uuid id PK
        string name
        string slug
    }

    PRODUCTS {
        uuid id PK
        uuid category_id FK
        string name
        string slug
        numeric base_price
        string unit
        boolean is_subscription_eligible
    }

    BATCHES {
        uuid id PK
        string batch_code UK
        uuid season_id FK
        uuid product_id FK
        date harvest_date
        date expiration_date
        numeric initial_quantity
        numeric available_quantity
        string qr_code_url
        string status
    }

    USERS {
        uuid id PK
        string email UK
        string phone UK
        string password_hash
        string full_name
        string role
        integer reward_points
    }

    ORDERS {
        uuid id PK
        string order_code UK
        uuid customer_id FK
        string shipping_address
        numeric shipping_distance_km
        numeric shipping_fee
        numeric total_amount
        string payment_method
        string payment_status
        string order_status
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        numeric quantity
        numeric unit_price
    }

    BATCH_ALLOCATIONS {
        uuid id PK
        uuid order_item_id FK
        uuid batch_id FK
        numeric allocated_quantity
        timestamp allocated_at
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid customer_id FK
        string plan_name
        string delivery_day
        integer total_deliveries
        integer remaining_deliveries
        numeric prepaid_amount
        string status
    }

    COMPLAINTS {
        uuid id PK
        uuid order_id FK
        uuid customer_id FK
        string reason
        string proof_image_urls
        string status
        string resolution
        uuid resolved_by FK
    }

    WASTE_LOGS {
        uuid id PK
        uuid batch_id FK
        uuid reported_by FK
        uuid approved_by FK
        numeric discarded_quantity
        string reason
        string image_proof_url
        string status
        timestamp logged_at
    }
```

---

## 2. Từ Điển Dữ Liệu Chi Tiết

Bảng đối chiếu 14 thực thể theo 4 phân vùng nghiệp vụ chính:

### Phân vùng 1: Farm Operations

| Tên Bảng       | Khóa Chính  | Khóa Ngoại                      | Các Cột Thuộc Tính Trọng Tâm                                              | Ràng Buộc Nghiệp Vụ                  |
| :------------- | :---------- | :------------------------------ | :------------------------------------------------------------------------ | :----------------------------------- |
| `farms`        | `id` (UUID) | Không                           | `name`, `address`, `latitude`, `longitude`, `certification_url`           | Tọa độ dùng để tính phí ship nội suy |
| `plots`        | `id` (UUID) | `farm_id` $\rightarrow$ `farms` | `plot_code` (Lô đất), `area_sqm`, `soil_test_result`, `water_test_result` | 1 Farm có nhiều Plot đất             |
| `seasons`      | `id` (UUID) | `plot_id` $\rightarrow$ `plots` | `season_name`, `start_date`, `expected_harvest_date`, `status`            | Quản lý vòng đời gieo trồng          |
| `farming_logs` | `id` (UUID) | `season_id`, `staff_id`         | `action_type`, `description`, `media_urls`, `logged_at`                   | **Append-only log** (Không sửa/xóa)  |

### Phân vùng 2: Catalog & Batch Inventory

| Tên Bảng     | Khóa Chính  | Khóa Ngoại                               | Các Cột Thuộc Tính Trọng Tâm                                                                                       | Ràng Buộc Nghiệp Vụ                                |
| :----------- | :---------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| `categories` | `id` (UUID) | Không                                    | `name`, `slug`                                                                                                     | Phân loại rau lá, rau củ quả, gia vị               |
| `products`   | `id` (UUID) | `category_id`                            | `name`, `slug`, `base_price`, `unit`, `is_subscription_eligible`                                                   | Sản phẩm hiển thị trên Storefront                  |
| `batches`    | `id` (UUID) | `season_id`, `product_id`                | `batch_code`, `harvest_date`, `expiration_date`, `initial_quantity`, `available_quantity`, `qr_code_url`, `status` | **Cốt lõi FEFO & QR Code**. 1 sản phẩm có nhiều Lô |
| `waste_logs` | `id` (UUID) | `batch_id`, `reported_by`, `approved_by` | `discarded_quantity`, `reason`, `image_proof_url`, `status`, `logged_at`                                           | Phiếu xuất hủy 2 bước (Staff tạo, Admin duyệt)     |

### Phân vùng 3: Users & Orders

| Tên Bảng            | Khóa Chính  | Khóa Ngoại                  | Các Cột Thuộc Tính Trọng Tâm                                                                                                                 | Ràng Buộc Nghiệp Vụ                             |
| :------------------ | :---------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| `users`             | `id` (UUID) | Không                       | `email`, `phone`, `password_hash`, `full_name`, `role`, `reward_points`                                                                      | Phân quyền 5 vai trò; tích lũy 1% điểm          |
| `orders`            | `id` (UUID) | `customer_id`               | `order_code`, `shipping_address`, `shipping_distance_km`, `shipping_fee`, `total_amount`, `payment_method`, `payment_status`, `order_status` | FSM trạng thái đơn hàng                         |
| `order_items`       | `id` (UUID) | `order_id`, `product_id`    | `quantity`, `unit_price`                                                                                                                     | Mỗi dòng sản phẩm trong đơn                     |
| `batch_allocations` | `id` (UUID) | `order_item_id`, `batch_id` | `allocated_quantity`, `allocated_at`                                                                                                         | **Phân bổ FEFO**: 1 item có thể trừ từ nhiều Lô |

### Phân vùng 4: Subscription & Complaints

| Tên Bảng        | Khóa Chính  | Khóa Ngoại                               | Các Cột Thuộc Tính Trọng Tâm                                                                        | Ràng Buộc Nghiệp Vụ                        |
| :-------------- | :---------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------- | :----------------------------------------- |
| `subscriptions` | `id` (UUID) | `customer_id`                            | `plan_name`, `delivery_day`, `total_deliveries`, `remaining_deliveries`, `prepaid_amount`, `status` | Gói rau định kỳ trả trước                  |
| `complaints`    | `id` (UUID) | `order_id`, `customer_id`, `resolved_by` | `reason`, `proof_image_urls`, `status`, `resolution`                                                | Báo rau dập nát trong 24h kèm tối đa 3 ảnh |

---

## 3. Hướng Dẫn Nhanh Cho Thành Viên Thiết Kế

1. **Công cụ khuyên dùng**: Truy cập <https://draw.io> hoặc <https://mermaid.live>.
2. **Cách vẽ tức thì trong 3 giây trên Draw.io**:
   - Mở file mới trên `draw.io`.
   - Chọn menu **Arrange** $\rightarrow$ **Insert** $\rightarrow$ **Advanced** $\rightarrow$ **Mermaid**.
   - Dán toàn bộ khối mã Mermaid ở Mục 1 vào hộp thoại $\rightarrow$ Bấm **Insert**.
   - `draw.io` sẽ tự động dựng toàn bộ 14 bảng quan hệ đẹp tăm tắp, chỉ cần kéo thả lại layout cho vừa mắt rồi xuất ảnh PNG độ nét cao đưa vào Word!

---

## Related Notes

- Bản đồ dự án: [[000_GreenRoots_Farm_MOC]]
- Báo cáo hoàn chỉnh Chương 1: [[Chapter_01_Project_Initiation_Report]]
- Quyết định kiến trúc hệ thống: [[System_Scope_and_Decision_Records]]
- Đặc tả User Stories MoSCoW: [[MoSCoW_User_Stories_Specification]]
- Lộ trình khởi tạo dự án: [[Project_Initiation_and_Execution_Roadmap]]
- Cấu trúc hệ thống toàn cục: [[000_System_Structure]]
