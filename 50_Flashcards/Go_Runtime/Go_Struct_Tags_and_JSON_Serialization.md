---
noteId: 1790738820566
---

Tại sao trong Go, các trường của Struct phải viết hoa chữ cái đầu (Exported) và cần sử dụng cú pháp Struct Tag (ví dụ: `ID string \`json:"id"\``) khi chuyển đổi dữ liệu với JSON?

---

- **Quy tắc đóng gói và khả năng hiển thị (Exported Identifier Rule):**
  - Trong Go, phạm vi truy cập (Public/Private) được quyết định bởi chữ cái đầu tiên: viết hoa là `Public` (Exported ra ngoài package), viết thường là `Private` (chỉ dùng nội bộ package).
  - Package chuẩn `encoding/json` nằm ở một package độc lập bên ngoài. Nếu trường viết thường (ví dụ: `id string`), thư viện JSON **hoàn toàn không thể nhìn thấy hoặc đọc được giá trị của trường đó** $\rightarrow$ Dữ liệu bị bỏ qua (bị lờ đi) khi Marshal/Unmarshal.
- **Cơ chế Struct Tag & Reflection:**
  - Chuỗi nằm trong cặp dấu backtick `` `json:"id"` `` được gọi là **Struct Tag**.
  - Lúc runtime, thư viện `encoding/json` dùng cơ chế **Reflection (`reflect.TypeOf`)** để đọc siêu dữ liệu (Metadata) này nhằm ánh xạ (Mapping) tên trường viết hoa trong Go (`ID`) sang tên trường viết thường/snake_case trong JSON (`"id"`).

---

Extra: Các tùy chọn Struct Tag thực chiến:

- `json:"id,omitempty"`: Tự động bỏ qua trường này trong JSON nếu giá trị là Zero-value (`""`, `0`, `nil`).
- `json:"-"`: Tuyệt đối không bao giờ serialize trường này ra JSON (thường dùng cho thông tin nhạy cảm như `PasswordHash`).
