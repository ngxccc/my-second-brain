#### 2. Workspace của Thu Ngân (Staff Role)

Layout ưu tiên hiển thị hình ảnh và tốc độ thao tác (Touch-friendly).

- **Thanh Sidebar:** Cực kỳ tối giản. Chỉ có: Trang chủ (Bán hàng), Lịch sử, Đăng xuất.
    
- **Tính năng 1: POS Bán hàng (Main Flow):** Chứa `UC_Menu` và `UC_Billing`. Chính là cái luồng xịn xò Async/Batching mà ta vừa xây xong.
    
- **Tính năng 2: Lịch sử ca làm (Lịch sử Bill):** _(Mới)_ Thu ngân xem lại các hóa đơn **trong ngày hôm nay** của mình.
    
    - _Tại sao cần?_ Lỡ máy in kẹt giấy, file PDF lỗi, hoặc khách mất biên lai -> Thu ngân bấm vào nút **"In lại (Reprint)"** để gọi lại hàm Gen PDF QuestPDF. Rất thực tế!
    
- **Tính năng 3: Cài đặt cá nhân:** Đổi mật khẩu tài khoản của chính mình.
    

#### 3. Workspace của Quản Lý (Admin Role)

Layout chuẩn ERP, Sidebar bên trái chứa nhiều Menu, bên phải là lưới dữ liệu (Grid) hoặc Biểu đồ (Chart).

- **Thanh Sidebar:** Tổng quan, Sản phẩm, Danh mục, Nhân viên, Hóa đơn, Đăng xuất.
    
- **Tính năng 1: Dashboard (Tổng quan):** _(Core)_
    
    - Dùng thư viện **ScottPlot** hoặc **LiveCharts2** vẽ 2 cái biểu đồ: (1) Biểu đồ cột Doanh thu 7 ngày qua. (2) Biểu đồ tròn Top 5 món bán chạy nhất. Cực kỳ lấy lòng cô giáo!
        
    - Hiển thị 3 con số to đùng: Tổng đơn hôm nay, Tổng doanh thu hôm nay, Số ly nước đã bán.
        
- **Tính năng 2: Quản lý Menu (Master Data):** * CRUD (Thêm/Sửa/Xóa/Xem) bảng `categories` (Nhóm nước).
    
    - CRUD bảng `products` (Sản phẩm). Kèm tính năng tải ảnh đại diện lên (lưu dưới dạng Base64 vào DB hoặc copy file vào folder `Images/`).
    - Chức năng hiển thị các món đã xoá và khôi phục
    
- **Tính năng 3: Quản lý Nhân sự:**
    
    - CRUD bảng `users` (Tài khoản, Mật khẩu, Role).
    
    - Nút "Reset Password" (Phòng trường hợp nhân viên quên mật khẩu).
    
- **Tính năng 4: Quản trị Hóa đơn (Audit):** _(Cực kỳ quan trọng)_
    
    - Xem toàn bộ lịch sử Bill từ ngày A đến ngày B.
        
    - Tính năng **Hủy Hóa Đơn (Refund/Void)**. Khi Admin bấm hủy, gọi hàm `CancelBill` (Soft Delete `is_deleted = true`) mà ta đã viết. Bill hủy sẽ bị gạch ngang màu đỏ trên UI.

---  
    Làm thế nào (How) để ông implement cơ chế **In-Memory Caching (`IMemoryCache` của .NET)** vào tầng Service để:

1. Lần đầu tiên Thu ngân mở máy, App chọc xuống DB lấy Menu lên và "Nhét" vào RAM (Sống trong 24 tiếng).
    
2. Từ nghìn lần sau trở đi, App chỉ móc Data từ RAM ra (0 mili-giây, bypass hoàn toàn PostgreSQL).
    
3. **Bài toán Edge Case:** Nếu Sếp đang ngồi ở màn hình Admin (Máy số 2) và đổi giá món "Bánh Flan" từ 15k lên 20k. Làm sao để cái Cache trên RAM của máy Thu ngân (Máy số 1) biết đường tự động "Hủy diệt" (Cache Invalidation) để cập nhật giá mới ngay lập tức mà không bán hớ tiền của công ty?


fix việc khôi phục category khi có các product đã được xoá sẵn trước đó thay vì bị xoá dây chuyển bởi category
