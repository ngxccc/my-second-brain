---
noteId: 1783427320069
---

Hiện tượng "Nghịch lý Thuốc trừ sâu" (Pesticide paradox) trong kiểm thử phần mềm là gì và làm thế nào để vượt qua nó?

---

Nếu bạn **chỉ lặp đi lặp lại cùng một bộ test case cũ**, thì sau một thời gian, bộ test đó sẽ mất dần khả năng tìm ra những con bug mới (giống như sâu bọ bị nhờn thuốc trừ sâu).

Để vượt qua nghịch lý này, bộ test case phải được định kỳ đánh giá lại, cập nhật thường xuyên, và viết thêm các kịch bản kiểm thử mới để bao phủ các nhánh rẽ và tính năng mới thay đổi.

---

Extra: Bộ kiểm thử hồi quy tự động (Automated Regression Suite) rất tốt để bắt lỗi cũ quay lại, nhưng không đủ để phát hiện các lỗi mới sinh ra nếu không liên tục bổ sung test case mới.
