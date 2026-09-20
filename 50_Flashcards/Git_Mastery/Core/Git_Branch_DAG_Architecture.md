---
noteId: 1789566005002
---

Về mặt kiến trúc hệ thống, đối tượng Branch trong Git thực chất được lưu trữ như thế nào bên trong thư mục `.git/`? Tại sao việc tạo nhánh trong Git lại gần như có chi phí bằng $0$?

---

- **Bản chất lưu trữ:** Một Branch trong Git **không phải là một bản sao chép thư mục**. Nó thực chất chỉ là một tập tin văn bản dung lượng **41 bytes** nằm tại `.git/refs/heads/<tên-nhánh>`.
- **Nội dung:** Tập tin này chỉ chứa đúng một chuỗi mã băm SHA (40 ký tự hexa) trỏ trực tiếp vào commit đỉnh của nhánh đó trên đồ thị có hướng (DAG).
- **Chi phí bằng 0:** Thao tác `git branch <name>` chỉ đơn thuần là tạo một file text nhỏ ghi 40 ký tự SHA của commit hiện tại. Không có bất kỳ dữ liệu mã nguồn nào bị sao chép.

---

Extra: Con trỏ `HEAD` cũng chỉ là một file text đặc biệt tại `.git/HEAD` chứa chuỗi tham chiếu đến branch hiện hành (ví dụ: `ref: refs/heads/main`).
