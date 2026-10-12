---
noteId: 1791469635260
---

Mục đích cốt lõi của việc áp dụng DTO (Data Transfer Object) giữa Controller và Action/Service trong ứng dụng Laravel là gì?

---

- **Chuẩn hóa & Bất biến:** Đóng gói dữ liệu đầu vào thành một đối tượng có kiểu dữ liệu tường minh (Strongly Typed), bất biến (`readonly`), loại bỏ mảng thô không định kiểu.
- **Tách biệt tầng Web:** Ngăn ngừa việc truyền trực tiếp đối tượng HTTP Request vào sâu trong Business Logic, giúp mã nguồn dễ bảo trì và Unit Test.

---

Extra: Thường triển khai bằng cú pháp PHP 8.2+: `readonly class ProductData { public function __construct(public string $name, public float $price) {} }`.
