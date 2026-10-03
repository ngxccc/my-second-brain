---
noteId: 1790738820566
---

Tại sao các trường của Struct trong Go phải viết hoa chữ cái đầu mới có thể serialize ra JSON?

---

- **Quy tắc Exported Identifier**: Chỉ trường viết hoa mới là Public ra ngoài package; package `encoding/json` không thể đọc trường viết thường (Private).
- **Struct Tag qua Reflection**: Chuỗi tag `json:"..."` được đọc lúc runtime bằng Reflection (`reflect.TypeOf`) để ánh xạ sang tên trường JSON mong muốn.

---

Extra: Dùng `omitempty` để tự động bỏ qua zero-value; dùng `json:"-"` để ẩn trường nhạy cảm như PasswordHash khỏi payload JSON.
