Mỗi lần bro gọi `pnlMain.Controls.Add(button)`, thằng WinForms sẽ tự động gọi thợ (Layout Engine) đến đo đạc và tính toán lại toàn bộ vị trí, kích thước của CẢ CÁI NHÀ.

Nếu bro add 100 cái controls mà không có `SuspendLayout()`, WinForms sẽ gọi thợ 100 lần. App sẽ giật lag tung chảo, chớp chớp (flickering) nhìn rất "phèn".

**Luật chơi hệ thực chiến:**

1. **Khi nào dùng?** Khi bro thao tác với Container (Panel, UserControl, Form, GroupBox) và chuẩn bị thêm từ 2 controls con trở lên, hoặc thay đổi hàng loạt thuộc tính `Dock`, `Location`, `Size`.
    
2. **Khi nào KHÔNG dùng?** Đừng rảnh mà đi gọi `_btnToggle.SuspendLayout()`. Button, TextBox, Label không chứa thằng con nào bên trong cả (thường là vậy), nên việc bắt nó "tạm dừng tính toán layout của con nó" là vô nghĩa, tốn CPU cycle.
    
3. **Cú pháp chuẩn:** * Đầu game: `Container.SuspendLayout()` (Báo thợ nghỉ tay).
    
    - Giữa game: Add một nùi Controls, set Dock, set Size vô tư.
        
    - Cuối game: `Container.ResumeLayout(false)` (Gọi thợ ra tính toán lại đúng 1 lần duy nhất).


khi resumelayout Bắt buộc phải tuân theo nguyên lý **Bottom-Up (Từ trong ra ngoài / Con trước Cha sau)**.