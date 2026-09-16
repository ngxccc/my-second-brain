---
noteId: 1783153909380
---

Trong V8 Engine, hành vi nào của lập trình viên sẽ ép một Object bị rơi khỏi sự tối ưu của Hidden Classes (Shapes) và chuyển sang chế độ chậm Dictionary Mode?

---

Hành vi **xóa thuộc tính (`delete obj.prop`)** hoặc **thêm/bớt liên tục các thuộc tính động** sau khi object đã được khởi tạo.

Khi đó, V8 từ bỏ việc quản lý offset bộ nhớ tĩnh qua cây Hidden Class và chuyển Object sang lưu trữ dưới dạng một bảng băm thông thường (**Dictionary Mode / Slow Mode**).

---

Extra: Thay vì dùng toán tử `delete`, hãy gán giá trị về `null` hoặc `undefined` (`obj.prop = undefined`) để giữ nguyên cấu trúc Hidden Class của Object trong bộ nhớ.
