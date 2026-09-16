---
noteId: 1786627528758
---

Tại sao việc gọi `append` làm tăng độ dài Slice bên trong một hàm lại KHÔNG làm thay đổi biến Slice ở hàm gọi bên ngoài (Pass-by-value Trap)?

---

Vì Go truyền `SliceHeader` vào hàm dưới dạng **Bản sao giá trị (Pass-by-value)**.

Khi `append` thực thi bên trong hàm con, nó chỉ cập nhật giá trị `Len` mới trên bản sao `SliceHeader` cục bộ. `SliceHeader` ở hàm cha bên ngoài vẫn giữ nguyên giá trị `Len` cũ nên không nhìn thấy phần tử mới.

---

Extra: Để cập nhật độ dài ở hàm gọi bên ngoài, bắt buộc phải trả về Slice mới (`s = modify(s)`) hoặc truyền con trỏ trỏ tới Slice (`func modify(s *[]int)`).
