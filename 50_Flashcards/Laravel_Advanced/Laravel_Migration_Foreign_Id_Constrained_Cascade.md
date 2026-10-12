---
noteId: 1791469635570
---

Cú pháp ngắn gọn nhất trong Schema Builder để tạo một Foreign Key `category_id` tự động liên kết với bảng `categories` và xóa tầng là gì?

---

- **Cú pháp fluent:** `$table->foreignId('category_id')->constrained()->cascadeOnDelete();`.
- **Quy ước tự động:** Phương thức `constrained()` tự suy luận bảng đích là `categories` dựa trên tiền tố của tên cột (`category`).

---

Extra: Tương đương cú pháp: `$table->unsignedBigInteger('category_id'); $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');`.
