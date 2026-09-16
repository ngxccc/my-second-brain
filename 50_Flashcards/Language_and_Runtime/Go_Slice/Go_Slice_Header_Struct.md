---
noteId: 1786627528703
---

Cấu trúc bộ nhớ `SliceHeader` trong Go gồm những trường gì và chiếm tổng cộng bao nhiêu bytes RAM trên kiến trúc 64-bit?

---

Gồm **3 trường** chiếm tổng cộng **24 bytes**:

1. `Data uintptr`: Con trỏ trỏ tới phần tử đầu tiên của mảng ngầm (_Underlying Array_) $\rightarrow$ **8 bytes**.
2. `Len int`: Số lượng phần tử hiện tại của Slice $\rightarrow$ **8 bytes**.
3. `Cap int`: Sức chứa tối đa của mảng ngầm tính từ con trỏ `Data` $\rightarrow$ **8 bytes**.

---

Extra: Khi truyền Slice vào tham số hàm, Go luôn copy bản sao 24 bytes của `SliceHeader` này (**Pass-by-value**), nhưng cả 2 header đều trỏ chung vào cùng một mảng dữ liệu ngầm.
