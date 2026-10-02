---
noteId: 1789871405583
---

Trong Go, hai cơ chế tối ưu hóa Compile-time nào được thể hiện qua output: `can inline` và `moved to heap: x` khi chạy `go build -gcflags="-m"`?

---

1. **Function Inlining (Nội hàm hóa):** Compiler bê nguyên thân hàm ngắn dán thẳng vào nơi gọi hàm, triệt tiêu hoàn toàn chi phí tạo Stack Frame, nhảy địa chỉ lệnh và trả về (`CALL/RET`).
2. **Escape Analysis (Phân tích thoát):** Compiler xác định vòng đời biến. Nếu biến được lấy địa chỉ (`&x`) và trả ra ngoài scope hàm, nó buộc phải thoát lên **Heap** (`runtime.newobject`) để tránh con trỏ rác khi Stack Frame bị hủy.

---

Extra: Nếu hàm chỉ trả về giá trị thuần túy (`return x`), CPU chỉ cần copy giá trị vào thanh ghi `RAX` và biến `x` ở lại trên Stack 100%.
