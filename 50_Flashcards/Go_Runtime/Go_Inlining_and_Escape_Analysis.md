---
noteId: 1789871405583
---

Hai thông điệp tối ưu hóa `can inline` và `moved to heap: x` của Go Compiler thể hiện cơ chế gì?

---

- **Function Inlining (`can inline`)**: Chèn trực tiếp thân hàm vào nơi gọi, triệt tiêu chi phí tạo Stack Frame và lệnh nhảy `CALL/RET`.
- **Escape Analysis (`moved to heap`)**: Phát hiện biến vượt ra ngoài phạm vi hàm để cấp phát lên Heap, tránh lỗi Dangling Pointer.

---

Extra: Nếu hàm chỉ trả về giá trị thuần túy (`return x`), CPU chỉ copy qua thanh ghi và biến ở lại hoàn toàn trên Stack.
