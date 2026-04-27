- **Dumb Component (Chỉ cần State, KHÔNG cần Service):** Đây là những Component "ngây thơ", chỉ nhận dữ liệu từ cha truyền xuống và hiển thị.
    
    - _Vũ khí:_ Từ khóa `new` thuần túy.
        
    - _Ví dụ:_ `new UC_ProductSizeEditor(sizeName, price)` (Nó không tự chọc DB, nó chỉ chứa giao diện).
        
- **Root Component (Cần Service, KHÔNG cần State lúc khởi tạo):** Đây là những Component to bự (như màn hình Quản lý được gắn sẵn trên Sidebar). Khi mở lên nó tự gọi DB lấy toàn bộ danh sách.
    
    - _Vũ khí:_ Khởi tạo qua DI Container (`_serviceProvider.GetRequiredService<T>()`).
        
    - _Ví dụ:_ `UC_ManageProducts` (Nhận 3-4 cái Services nhưng không cần ID cụ thể nào lúc khởi tạo).
        
- **Smart Child Component (Cần CẢ Service VÀ State):** Đây là bài toán khó nhất. Nó cần mở ra cho một ID cụ thể (State), nhưng nó đủ khôn để tự chọc DB lấy chi tiết (Service).
    
    - _Vũ khí:_ `ActivatorUtilities.CreateInstance` (Cỗ máy lai tạo).
        
    - _Ví dụ:_ `UC_ManageProductSizes` (Cần `int productId` từ user click, và cần `IProductSizeService` từ DI).