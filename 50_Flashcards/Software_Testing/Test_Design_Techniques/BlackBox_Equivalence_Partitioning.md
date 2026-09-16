---
noteId: 1783427319820
---

Kỹ thuật Phân vùng Tương đương (Equivalence Partitioning - EP) là gì và sự khác nhau giữa Phân vùng Hợp lệ và Bất hợp lệ?

---

**Equivalence Partitioning (EP)** chia tập dữ liệu đầu vào thành các nhóm (phân vùng) mà hệ thống được kỳ vọng sẽ **xử lý theo cùng một cách thức như nhau**. Chỉ cần chọn **1 giá trị đại diện** từ mỗi phân vùng để kiểm thử là đủ:

- **Valid Partition (Phân vùng hợp lệ)**: Tập hợp các giá trị được hệ thống chấp nhận xử lý thành công.
- **Invalid Partition (Phân vùng bất hợp lệ)**: Tập hợp các giá trị bị hệ thống từ chối hoặc trả về thông báo lỗi.

---

Extra: Nguyên lý đằng sau EP là giả định rằng nếu 1 giá trị trong phân vùng phát hiện ra lỗi, thì mọi giá trị khác trong cùng phân vùng đó cũng sẽ gây ra lỗi tương tự.
