---
noteId: 1783427319869
---

Chuỗi nhân quả liên kết giữa Error (Sai sót), Defect (Khuyết tật/Lỗi) và Failure (Sự cố) theo chuẩn ISTQB là gì?

---

Theo chuỗi nhân quả 3 bước:

1. **Error (Mistake)**: Sai sót do con người tạo ra (lập trình viên mệt mỏi, hiểu sai yêu cầu).
2. $\rightarrow$ Dẫn đến **Defect (Bug / Fault)**: Điểm khuyết tật nằm ẩn trong tài liệu hoặc mã nguồn.
3. $\rightarrow$ Khi mã nguồn chứa Defect được thực thi, nó gây ra **Failure**: Sự cố sai lệch quan sát được giữa hành vi thực tế và hành vi mong đợi của phần mềm.

---

Extra: Không phải mọi Defect đều dẫn đến Failure; nếu đoạn code bị lỗi không bao giờ được kích hoạt thực thi thì Failure sẽ không bao giờ xuất hiện.
