---
noteId: 1789871405683
---

Tại sao truyền Struct lớn bằng Con trỏ (`*User`) trong Go không phải lúc nào cũng nhanh hơn truyền bằng Giá trị (`User`)?

---

- **Escape Analysis & GC**: Truyền con trỏ thường đẩy Struct lên Heap, tăng chi phí cấp phát và độ trễ Stop-The-World của Garbage Collector.
- **Cache Locality**: Struct truyền bằng giá trị nằm gọn trên Stack nạp thẳng vào L1/L2 Cache; con trỏ trên Heap gây Pointer Chasing và Cache Miss.

---

Extra: Chỉ truyền con trỏ khi cần thay đổi trạng thái gốc (Mutate) hoặc Struct quá lớn (> vài trăm bytes) và đã kiểm chứng qua `go test -benchmem`.
