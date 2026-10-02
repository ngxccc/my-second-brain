---
noteId: 1790738820515
---

So sánh 3 chiến lược merge Pull Request trên GitHub: Squash and Merge, Rebase and Merge, và Merge Commit?

---

- **Squash and Merge:** Nén toàn bộ commit thành 1 commit duy nhất trên nhánh đích. Ưu điểm: Lịch sử `main` tuyến tính, sạch sẽ; Nhược điểm: Mất lịch sử commit chi tiết của nhánh con.
- **Rebase and Merge:** Đặt từng commit của nhánh con lên đầu nhánh đích. Ưu điểm: Giữ nguyên từng commit mà không tạo merge commit; Nhược điểm: Dễ xung đột từng commit nếu có branch trôi dạt.
- **Create a Merge Commit:** Tạo 1 merge commit có 2 parent. Ưu điểm: Bảo toàn toàn bộ hình thái đồ thị DAG; Nhược điểm: Lịch sử rối nếu team merge thường xuyên.

---

Extra: Quy tắc thực chiến chuẩn: Developer dùng `git pull --rebase` ở local để giải quyết xung đột với `main`, sau đó GitHub áp dụng `Squash and Merge` khi duyệt PR.
