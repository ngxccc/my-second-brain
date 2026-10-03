---
noteId: 1790159214130
---

Tại sao phép toán `counter++` trên biến chia sẻ giữa nhiều luồng lại gây ra Race Condition ở tầng phần cứng CPU?

---

- **3 chỉ thị máy Read-Modify-Write**: `counter++` gồm đọc vào register, tăng giá trị, ghi lại RAM; các core CPU xen kẽ nhau sẽ ghi đè và làm triệt tiêu lượt tăng.

---

Extra: Cờ `-race` dùng ThreadSanitizer làm chậm nhẹ Goroutine để phơi bày xung đột. Dùng `atomic.AddInt64` với lệnh CPU `LOCK XADD` để an toàn mà không cần Mutex.
