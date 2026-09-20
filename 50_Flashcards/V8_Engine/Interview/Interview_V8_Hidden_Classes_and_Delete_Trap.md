---
noteId: 1789871405991
---

[Phỏng vấn V8/Node.js]: "Trong Node.js/V8, tại sao việc xóa thuộc tính đối tượng bằng từ khóa `delete user.age` hoặc gán các trường lộn xộn lại làm giảm hiệu năng nghiêm trọng (De-optimization)? Cách khắc phục là gì?"

---

- **Cơ chế V8 Internals:** V8 sử dụng **Hidden Classes (Shapes)** để tối ưu hóa truy cập thuộc tính mà không cần tra cứu Hash Map. Các đối tượng khởi tạo các trường theo cùng thứ tự sẽ dùng chung một Hidden Class.
- **Hậu quả của `delete` hoặc gán lộn xộn:**
  1. Thao tác `delete` làm phá vỡ cấu trúc của Hidden Class hiện tại, biến đối tượng thành chế độ Dictionary Mode (chậm như một Hash Map thông thường).
  2. Vô hiệu hóa bộ đệm nội hàm **Inline Caching (IC)**, khiến hàm chứa đối tượng đó bị JIT Compiler de-optimize về mã bytecode thông dịch chậm chạp.
- **Cách khắc phục:**
  - Luôn khởi tạo đầy đủ các thuộc tính trong constructor theo cùng một thứ tự.
  - Thay vì `delete user.age`, hãy gán `user.age = undefined` hoặc `null` để bảo toàn Hidden Class.

---

Extra: Trong V8, giữ cho đối tượng luôn ở dạng **Monomorphic** (chỉ có 1 Shape duy nhất) là bí quyết tối thượng để đạt tốc độ xử lý nhanh nhất.
