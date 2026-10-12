---
noteId: 1791469635742
---

Những thuộc tính chia sẻ chung nào thường được gom nhóm thông qua `Route::prefix()`, `name()`, và `middleware()`?

---

- **Tiền tố & Định danh:** `prefix('admin')` áp dụng URI chung `/admin/*`, `name('admin.')` tự động gắn tiền tố cho tên route con.
- **Bộ lọc bảo vệ:** `middleware(['auth', 'verified'])` áp dụng hàng rào bảo mật chung cho toàn bộ các route bên trong nhóm.

---

Extra: Cú pháp gộp hiện đại: `Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () { ... });`.
