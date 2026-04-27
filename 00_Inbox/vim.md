- **`Ctrl` + `e`**: Cuộn màn hình xuống 1 dòng.
- **`Ctrl` + `y`**: Cuộn màn hình lên 1 dòng.
- **`zz`**: Đưa dòng hiện tại có con trỏ vào chính giữa màn hình. (NÊN LUYỆN)
- **`Ctrl` + `d`** (Down): Xuống nửa trang màn hình. (NÊN LUYỆN)
- **`Ctrl` + `u`** (Up): Lên nửa trang màn hình. (NÊN LUYỆN)
- **`zt`** (Top): Đưa dòng hiện tại lên sát mép trên màn hình.
- **`zb`** (Bottom): Đưa dòng hiện tại xuống sát mép dưới màn hình.
- **`Ctrl` + `f`** (Forward): Xuống một trang màn hình.
- **`Ctrl` + `b`** (Backward): Lên một trang màn hình.

- **`:s/cũ/mới/g`**: Chỉ thay thế trong **dòng hiện tại**.
- **`:5,10s/cũ/mới/g`**: Thay thế từ dòng 5 đến dòng 10.
- **`:.,$s/cũ/mới/g`**: Thay thế từ dòng hiện tại đến cuối file.
- **`:.,.+5s/cũ/mới/g`**: Thay thế từ dòng hiện tại xuống thêm 5 dòng nữa.
- **`:.-10,.s/cũ/mới/g`**: Thay thế từ 10 dòng trước đó đến dòng hiện tại.

- **`.`**: Đại diện cho dòng hiện tại.
- **`,`** : Dấu phẩy ngăn cách giữa điểm bắt đầu và điểm kết thúc của vùng chọn.
- **`+n` / `-n`**: Khoảng cách dòng tương đối so với vị trí con trỏ.

- `gi` - go to implementations
- `gd` - jump to definition.
- `gq` - on a visual selection reflow and wordwrap blocks of text, preserving commenting style. Great for formatting documentation comments.
- `gb` - adds another cursor on the next word it finds which is the same as the word under the cursor.
- `af` - visual mode command which selects increasingly large blocks of text. For example, if you had "blah (foo [bar 'ba|z'])" then it would select 'baz' first. If you pressed `af` again, it'd then select [bar 'baz'], and if you did it a third time it would select "(foo [bar 'baz'])".
- `gh` - equivalent to hovering your mouse over wherever the cursor is. Handy for seeing types and error messages without reaching for the mouse!
- `cia` (Change Inner Argument): Thay đổi tham số hiện tại mà vẫn giữ nguyên dấu phẩy phân cách.
- `daa` (Delete Around Argument): Xóa tham số hiện tại kèm luôn cả dấu phẩy của nó.