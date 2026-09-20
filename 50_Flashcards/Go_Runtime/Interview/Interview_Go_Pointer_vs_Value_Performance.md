---
noteId: 1789871405683
---

[Phỏng vấn Go/Backend]: "Tại sao truyền một Struct lớn bằng Con trỏ (`*User`) không phải lúc nào cũng nhanh hơn truyền bằng Giá trị (`User`)? Khi nào việc lạm dụng con trỏ lại làm giảm hiệu năng?"

---

- **Lầm tưởng phổ biến:** Tưởng rằng truyền con trỏ chỉ tốn 8 byte (địa chỉ) nên lúc nào cũng nhanh hơn copy Struct 100 byte.
- **Thực tế phần cứng:**
  1. **Escape Analysis & GC Pressure:** Truyền con trỏ thường khiến Struct bị **thoát lên Heap**. Heap tốn chi phí cấp phát và tăng gánh nặng cho Garbage Collector (Stop-The-World latency).
  2. **CPU Cache Locality & Pointer Chasing:** Dữ liệu trên Heap nằm phân tán, CPU phải giải mã con trỏ (Dereference) gây **CPU Cache Miss**. Ngược lại, Struct nhỏ nằm trên Stack liên tục, nạp thẳng vào **L1/L2 Cache** (truy cập ~1ns), tốc độ copy 100 byte trên CPU thanh ghi đôi khi nhanh hơn nhiều so với việc tra cứu một địa chỉ RAM ngẫu nhiên.

---

Extra: Quy tắc Senior: Chỉ truyền con trỏ khi (1) Cần sửa đổi dữ liệu gốc (Mutate state), hoặc (2) Struct có kích thước quá lớn (> vài trăm bytes) và đã được chứng minh qua `go test -benchmem`.
