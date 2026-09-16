---
noteId: 1783153909280
---

Mẫu kiến trúc nào ưu tiên tính chất "Persistence Ignorance" bằng cách cô lập hoàn toàn Domain Model khỏi các thư viện Database/ORM cụ thể?

---

Mẫu thiết kế **Repository Pattern**.

Tầng Domain và Business Service chỉ định nghĩa và phụ thuộc vào các Interface nghiệp vụ (như `UserRepository`), không hề biết dữ liệu đang được lưu bằng PostgreSQL, MongoDB hay In-memory Cache.

---

Extra: Repository Pattern tạo ra sự phân tách mối quan tâm (Separation of Concerns) sạch sẽ nhưng phải đánh đổi bằng chi phí viết nhiều code boilerplate so với Fat Service.
