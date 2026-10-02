---
noteId: 1789871406063
---

Về mặt nguyên lý Khoa học Máy tính (CS), tại sao trả về địa chỉ bộ nhớ của một biến cục bộ (Con trỏ) trong hàm lại là hành vi nguy hiểm chết người nếu biến đó nằm ở Stack?

---

Vì khi hàm kết thúc (Return), **Stack Frame của hàm đó bị giải phóng ngay lập tức** (thanh ghi Stack Pointer giật lùi về vị trí cũ).

Nếu biến cục bộ nằm ở Stack:

1. Vùng nhớ chứa biến đó sẽ trở thành vùng nhớ tự do và bị các hàm tiếp theo ghi đè dữ liệu lên.
2. Con trỏ trả về bên ngoài trở thành **Con trỏ treo (Dangling Pointer)**, trỏ vào một vùng nhớ rác hoặc không hợp lệ.
3. Việc đọc/ghi qua con trỏ này sẽ dẫn đến lỗi bảo mật nghiêm trọng hoặc sập chương trình ngay lập tức (**Segmentation Fault**).

---

Extra: Trong C/C++, đây là lỗi Undefined Behavior kinh điển. Các ngôn ngữ hiện đại có bộ Garbage Collector (như Go) giải quyết triệt để vấn đề này bằng cơ chế **Escape Analysis** (tự động phát hiện và chuyển biến lên Heap).
