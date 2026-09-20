---
noteId: 1783153909347
---

Trong V8 Engine (Node.js/Bun), làm thế nào để tận dụng tối đa cơ chế Inline Caching (IC) khi khởi tạo và truy cập các thuộc tính của Object?

---

Khởi tạo các Object với **Stable Shape (Hình thái ổn định)** bằng cách **khai báo các thuộc tính theo cùng một thứ tự cố định**.

Khi các Object có cùng thứ tự thuộc tính, V8 gán chúng vào cùng một Hidden Class, cho phép JIT Compiler truy xuất offset bộ nhớ trực tiếp với độ phức tạp $O(1)$ thay vì tra cứu qua Hash Map.

---

Extra: Tránh việc thêm thuộc tính động ngẫu nhiên sau khi khởi tạo (`obj.b = 2` sau đó `obj.a = 1`) vì nó tạo ra các cây chuyển dịch Shape phân mảnh làm vô hiệu hóa bộ đệm Inline Cache.
