---
noteId: 1791469635418
---

Cơ chế Soft Deletes trong Eloquent bảo toàn dữ liệu như thế nào khi gọi `$model->delete()` và cách truy vấn kèm dữ liệu đã xóa?

---

- **Cơ chế đánh dấu:** Không xóa bản ghi vật lý mà chỉ gán thời gian hiện tại vào cột `deleted_at`; các truy vấn mặc định tự động loại trừ bản ghi này.
- **Truy vấn bao gồm/khôi phục:** Sử dụng `Model::withTrashed()->get()` để lấy toàn bộ dữ liệu, và gọi `$model->restore()` để khôi phục.

---

Extra: Yêu cầu trait `use SoftDeletes;` trong Model và khai báo `$table->softDeletes();` trong migration. Xóa vĩnh viễn bằng `$model->forceDelete()`.
