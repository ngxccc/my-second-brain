---
noteId: 1790159214130
---

Tại sao phép toán `counter++` trên biến dùng chung của nhiều Thread/Goroutine lại gây ra Race Condition? Tại sao chạy không cờ `-race` có thể vẫn ra đủ số lượng nhưng có cờ `-race` lại bị mất mát dữ liệu?

---

- **Bản chất 3 bước CPU (Read-Modify-Write):** `counter++` ở tầng CPU Machine Code gồm 3 chỉ thị độc lập:
  1. `READ`: Đọc giá trị từ RAM vào thanh ghi CPU.
  2. `MODIFY`: Tăng giá trị trong thanh ghi lên 1.
  3. `WRITE`: Ghi giá trị từ thanh ghi ngược lại RAM.
- **Cơ chế mất mát dữ liệu:** Khi 2 CPU Cores cùng thực hiện 3 bước này xen kẽ tại cùng một thời điểm, cả 2 cùng đọc giá trị cũ và ghi đè cùng một giá trị mới $\rightarrow$ 1 lượt tăng bị triệt tiêu.
- **Hiện tượng Heisenbug:** Khi không có `-race`, vòng lặp ngắn chạy quá nhanh nên xác suất va chạm thấp (ảo tưởng an toàn). Cờ `-race` kích hoạt **ThreadSanitizer**, làm chậm nhẹ các Goroutine và phơi bày 100% các xung đột đọc/ghi đồng thời trên cùng ô nhớ.

---

Extra: Trong Go, để biến `counter++` trở nên an toàn tuyệt đối (Thread-safe) mà không cần Mutex, ta dùng package `sync/atomic` với hàm `atomic.AddInt64(&counter, 1)` (sử dụng chỉ thị phần cứng CPU `LOCK XADD`).
