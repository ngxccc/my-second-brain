Vậy, cậu sẽ xử lý vấn đề **DPI Awareness** và **Responsive** trong WinForms code chay như thế nào? Cậu sẽ tiếp tục dùng pixel chết (absolute positioning) hay chuyển sang tính toán theo phần trăm (%) màn hình? Và nếu tính theo %, WinForms hỗ trợ class nào để làm việc đó tốt nhất?

### Phase 1: Figma & Design System (20%)

Trước khi gõ dòng code nào, phải có bản vẽ kỹ thuật.

1. **Define Layout:**
    
    - **Dashboard:** Bên trái là Lưới Bàn (Table Grid), bên phải là Menu chọn món & Bill tạm tính.
        
    - **Color Palette:** Chọn 1 màu chủ đạo (Primary Color) ví dụ `#6C5DD3` (Tím) hoặc `#00B894` (Xanh Mint).
        
2. **Define Specs (Thông số kỹ thuật):**
    
    - `Card Món`: 180x240px, Radius 15px.
        
    - `Table Button`: 100x100px, Radius 10px.
        
    - `Shadow`: Blur 10, Y=4, Color `#000000` Opacity 10%.
        
    - _Lưu lại các thông số này vào một file Text/Notion để lúc code C# nhìn vào đó mà gõ._
        

### Phase 2: Database Modeling (SQL Server) (20%)

Thiết kế DB để chịu được nghiệp vụ Gộp/Chuyển bàn.

- `TableFood`: (id, name, status) -> _Lưu danh sách bàn._
    
- `Account`: (username, displayname, password, type).
    
- `FoodCategory`: (id, name).
    
- `Food`: (id, name, idCategory, price).
    
- `Bill`: (id, DateCheckIn, DateCheckOut, idTable, status, discount, totalPrice). -> _Lưu hóa đơn tổng._
    
- `BillInfo`: (id, idBill, idFood, count). -> _Lưu chi tiết món trong hóa đơn._
    

### Phase 3: Core UI Framework "Code Chay" (30%)

Đây là lúc khổ nhất nhưng sướng nhất. Viết các Class cơ sở.

1. **Utils Class:** Viết hàm `DrawRoundedRectangle`, `DrawShadow` dùng chung.
    
2. **Component Building:**
    
    - Code class `ProductCard` (như ví dụ trước).
        
    - Code class `TableButton` (Kế thừa Button/Panel, có property `Status` để tự đổi màu Xanh/Đỏ).
        
3. **Layout Manager:** Code Form chính dùng `TableLayoutPanel` chia 2 cột (70% Menu, 30% Bill).
    

### Phase 4: Business Logic & Binding (20%)

1. **Load Table:** `SELECT * FROM TableFood` -> Loop tạo `TableButton`.
    
2. **Load Menu:** `SELECT * FROM Food` -> Loop tạo `ProductCard`.
    
3. **Order Flow:** Click Bàn -> Lấy Bill ID -> Click Món -> Insert vào `BillInfo` -> Reload List món bên phải.
    

### Phase 5: Refine & Polish (10%)

- Thêm hiệu ứng Hover.
    
- Xử lý biên (Edge cases): Nhập số lượng âm, tách bàn, gộp bàn.


CoffeePOS/
│
├── 📂 Core/                   # Những thứ dùng chung toàn project
│   ├── 📂 Constants/          # Lưu hằng số (Màu sắc, Font, Config)
│   ├── 📂 Helpers/            # Hàm hỗ trợ (Vẽ bo góc, Convert tiền tệ)
│   └── 📂 Events/             # Global Events (nếu cần)
│
├── 📂 Data/                   # Tầng giao tiếp Database (PostgreSQL)
│   ├── DbContext.cs           # Wrapper cho Npgsql (kết nối DB)
│   └── 📂 Entities/           # Class ánh xạ bảng SQL (Table, Food, Bill)
│       ├── Table.cs
│       ├── Food.cs
│       └── ...
│
├── 📂 Shared/                 # Các UI Control tự chế (Code Chay nằm đây)
│   ├── 📂 Components/
│   │   ├── RoundedButton.cs
│   │   ├── ProductCard.cs     # Thẻ món ăn
│   │   └── OverlayForm.cs     # Cái màn đen mờ
│   └── 📂 Styles/             # Class quản lý Theme màu
│
├── 📂 Features/               # QUAN TRỌNG NHẤT - Chia theo nghiệp vụ
│   │
│   ├── 📂 Auth/               # Đăng nhập/Phân quyền
│   │   ├── LoginForm.cs
│   │   └── AuthService.cs
│   │
│   ├── 📂 Tables/             # Quản lý sơ đồ bàn
│   │   ├── UCTableMap.cs      # UserControl hiển thị lưới bàn
│   │   ├── TableService.cs    # Logic gộp bàn, chuyển bàn
│   │   └── TableRepository.cs # Query SQL liên quan đến bàn
│   │
│   ├── 📂 Menu/               # Quản lý thực đơn & Order
│   │   ├── UCMenuGrid.cs      # UserControl hiển thị món ăn
│   │   └── MenuRepository.cs  # Query lấy list món
│   │
│   └── 📂 Billing/            # Thanh toán
│       ├── UCBillPanel.cs     # Panel bên phải (List món đã chọn)
│       ├── FormPayment.cs     # Popup thanh toán
│       └── BillService.cs     # Tính tiền, in hóa đơn
│
├── 📂 Forms/                  # Các Form chính (Container)
│   ├── MainForm.cs            # Form 3 cột (Sidebar - Main - Bill)
│   └── AdminForm.cs           # Form quản lý riêng
│
├── Program.cs                 # Điểm khởi chạy
└── App.config                 # Lưu Connection String