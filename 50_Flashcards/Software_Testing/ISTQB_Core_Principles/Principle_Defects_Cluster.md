---
noteId: 1783427319986
---

Nguyên lý "Lỗi thường tụ tập thành cụm" (Defects cluster together) phản ánh điều gì về sự phân bổ bug trong hệ thống phần mềm?

---

Phản ánh **Quy tắc Pareto (Nguyên lý 80/20)** trong phân bố lỗi:

Đa số các lỗi (khoảng 80% bugs) thường chỉ tập trung nằm ở một số lượng nhỏ các module cốt lõi (khoảng 20% codebase) — thường là những module có độ phức tạp cao, nhiều luồng xử lý đồng thời, hoặc thường xuyên bị sửa đổi.

---

Extra: Nếu bạn tìm thấy nhiều lỗi ở một module cụ thể, hãy tiếp tục đào sâu kiểm thử module đó vì khả năng rất cao vẫn còn nhiều con bug khác đang ẩn náu ở đó.
