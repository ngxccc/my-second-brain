---
noteId: 1783427319770
---

Thiết kế bộ test case BVA 2 giá trị cho một trường nhập liệu chỉ chấp nhận số lượng hàng từ 1 đến 100 (số nguyên bao gồm cả hai đầu mút)?

---

Xác định 2 điểm biên là **1** và **100**. Áp dụng kỹ thuật 2-value BVA:

- **Tại biên dưới (1)**:
  - `1` (biên hợp lệ)
  - `0` (láng giềng bất hợp lệ)
- **Tại biên trên (100)**:
  - `100` (biên hợp lệ)
  - `101` (láng giềng bất hợp lệ)

$\Rightarrow$ **Tập hợp test case tối thiểu cần chạy**: `{0, 1, 100, 101}`.

---

Extra: `0` và `101` kiểm tra xem hệ thống có chặn đúng giá trị ngoài vùng không; `1` và `100` kiểm tra xem hệ thống có bị lỗi gõ nhầm toán tử so sánh ngặt (`>` thay vì `>=`) hay không.
