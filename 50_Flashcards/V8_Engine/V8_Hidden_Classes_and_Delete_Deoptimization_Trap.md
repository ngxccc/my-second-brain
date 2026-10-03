---
noteId: 1789871405991
---

Trong V8 Engine, tại sao việc xóa thuộc tính đối tượng bằng `delete obj.prop` lại gây suy giảm hiệu năng nghiêm trọng (De-optimization)?

---

- **Dictionary Mode Fallback**: Toán tử `delete` phá vỡ cấu trúc Hidden Class (Shape), ép object chuyển sang lưu trữ dạng Hash Map thông thường.
- **IC Invalidation**: Vô hiệu hóa bộ đệm Inline Caching (IC), buộc JIT Compiler de-optimize hàm về mã bytecode thông dịch chậm.

---

Extra: Trong V8, giữ cho đối tượng luôn ở dạng **Monomorphic** (chỉ có 1 Shape duy nhất) là bí quyết tối thượng để đạt tốc độ xử lý nhanh nhất.
