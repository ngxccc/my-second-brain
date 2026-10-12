---
noteId: 1791469636236
---

Đối với trường Username bắt đầu bằng chữ cái và không có ký tự đặc biệt, kỹ thuật EP chia thành các phân hoạch nào?

---

- **Phân hoạch hợp lệ**: Bắt đầu bằng chữ cái (a-z, A-Z), chỉ chứa chữ/số (`caothang01`) và chưa tồn tại trong hệ thống.
- **Phân hoạch không hợp lệ**: Bắt đầu bằng số (`1user`), bắt đầu bằng ký tự đặc biệt (`@user`), chứa ký tự đặc biệt ở giữa (`u#ser`), để trống hoặc đã tồn tại.

---

Extra: Trong bài toán thiết kế form đăng ký, mỗi phân hoạch không hợp lệ phải được ánh xạ thành một test case độc lập tương ứng với một thông báo lỗi cụ thể.
