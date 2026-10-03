---
noteId: 1789914103675
---

Về mặt cấu trúc vật lý trong `.git/`, đối tượng Branch thực chất được lưu trữ như thế nào?

---

- **Tập tin tham chiếu 41 bytes**: Branch chỉ là một file text tại `.git/refs/heads/<name>` chứa đúng 40 ký tự SHA trỏ vào commit đỉnh của nhánh.
- **Chi phí tạo nhánh bằng 0**: Tạo nhánh chỉ ghi 40 ký tự SHA vào file text mới, không sao chép bất kỳ dữ liệu mã nguồn nào.

---

Extra: Con trỏ `HEAD` cũng chỉ là một file text tại `.git/HEAD` chứa tham chiếu đến nhánh hiện hành (ví dụ: `ref: refs/heads/main`).
