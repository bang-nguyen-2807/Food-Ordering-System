CREATE DATABASE FoodOrderingSystem
GO
USE FoodOrderingSystem
GO
-- USERS
CREATE TABLE Users(
	UserId INT IDENTITY(1,1) PRIMARY KEY,
	FullName NVARCHAR(255) ,
	UserName VARCHAR(90) UNIQUE,
	Password VARCHAR(255),
	NumberPhone VARCHAR(20) UNIQUE,
    Email VARCHAR(255) UNIQUE
)
GO
-- USER_ADDRESS
CREATE TABLE UserAddress(
    UserAddressId INT IDENTITY(1,1) PRIMARY KEY ,
    AddressName NVARCHAR(200) , -- VD NHÀ , CÔNG TY 
    Addresses NVARCHAR(200) NOT NULL,
    UserId INT NOT NULL,
    FOREIGN KEY (UserId) references Users(UserId) ON DELETE CASCADE
)
GO
-- CATEGORIES (LOẠI THỨC ĂN ) -- loại đồ gì gồm all , đồ ăn , đồ uống , đồ chay , bánh kem , tráng miệng , pizza/Burger , món lẩu , sushi , mì phở , cơm hộp
CREATE TABLE Categories(
	CategoriesId INT IDENTITY(1,1) Primary key ,
	CategoriesName NVARCHAR(50) NOT NULL,
	CategoriesCode VARCHAR(30) NOT NULL,
	Descriptions NVARCHAR(255) NULL,
	ImageUrl VARCHAR(255) NULL
)
GO
-- RESTAURANT
CREATE TABLE Restaurants(
	RestaurantId INT IDENTITY(1,1) PRIMARY KEY,
	RestaurantName NVARCHAR(255),
	Addresses NVARCHAR(255)
)
GO
--CATEGORIES_RESTAURANT -- loại đồ ăn của nhà hàng
CREATE TABLE CategoriesRestaurant(
	CategoriesRestaurantId INT IDENTITY(1,1) Primary key ,
    RestaurantId INT NOT NULL,
	CategoriesRestaurantName NVARCHAR(50) NOT NULL,
	CategorieRestaurantsCode VARCHAR(30) NOT NULL,
	Descriptions NVARCHAR(255) NULL,
	ImageUrl VARCHAR(255) NULL,
    FOREIGN KEY (RestaurantId) references Restaurants(RestaurantId)
)
GO
-- MENU ITEMS -- từng món ăn , giá từng món 
CREATE TABLE MenuItems(
	MenuItemId INT IDENTITY(1,1) PRIMARY KEY,
	CategoriesRestaurantId INT NOT NULL,
	NameMenuItems NVARCHAR(150),
	ImageUrl VARCHAR(255) NULL,
	Price DECIMAL(18,2) NOT NULL, -- giá tiền 
	is_available BIT NOT NULL DEFAULT 1,           -- Còn bán hay tạm hết (1 = True, 0 = False)
    display_order INT NOT NULL DEFAULT 0,          -- Thứ tự hiển thị trong menu
	FOREIGN KEY (CategoriesRestaurantId) references CategoriesRestaurant(CategoriesRestaurantId),
)
GO
--ADMINCODE
CREATE TABLE AdminCode (
    AdminCodeId INT IDENTITY(1,1) PRIMARY KEY,
    
    CodeSale VARCHAR(50) NOT NULL UNIQUE,          -- Mã code (VD: ADMIN50, FREESHIP)
    DiscountType NVARCHAR(20) NOT NULL             -- Loại giảm: 'PERCENTAGE' hoặc 'FIXED_AMOUNT'
        CONSTRAINT CK_AdminCode_Type CHECK (DiscountType IN ('PERCENTAGE', 'FIXED_AMOUNT')),
        
    Amount DECIMAL(12, 2) NOT NULL,                -- Giá trị giảm (10 = 10%, hoặc 50000 = 50.000đ)
    MaxAmount DECIMAL(12, 2) NULL,                 -- Giảm tối đa (hữu ích khi giảm theo %)
    MinOrderAmount DECIMAL(12, 2) DEFAULT 0,       -- Đơn tối thiểu để áp dụng code
    
    UsageLimit INT NULL,                           -- Tổng số lần cho phép dùng toàn hệ thống (NULL = không giới hạn)
    UsedCount INT DEFAULT 0,                       -- Số lần đã được sử dụng
    
    StartDate DATETIME2 NOT NULL,                  -- Ngày bắt đầu hiệu lực
    EndDate DATETIME2 NOT NULL,                    -- Ngày hết hạn
    IsActive BIT DEFAULT 1,                        -- Bật/tắt code thủ công
    
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    Description NVARCHAR(300) NULL; -- mô tả chi tiết về mã giảm giá 
    -- Kiểm tra logic giá trị
    CONSTRAINT CK_AdminCode_AmountValid CHECK (
        (DiscountType = 'PERCENTAGE' AND Amount > 0 AND Amount <= 100) OR
        (DiscountType = 'FIXED_AMOUNT' AND Amount > 0)
    ),
    CONSTRAINT CK_AdminCode_Dates CHECK (EndDate >= StartDate)
);
GO
-- CODE SALE
CREATE TABLE CodeSale(
    CodeSaleId INT IDENTITY(1,1) PRIMARY KEY,
    AdminCodeId INT NOT NULL,                  -- Thuộc chương trình mã nào
    UserId INT NOT NULL,                      -- Cấp cho User nào
    
    IsUsed BIT DEFAULT 0,                     -- 0: Chưa dùng, 1: Đã dùng
    UsedAt DATETIME2 NULL,                    -- Thời gian sử dụng
    AssignedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_CodeSale_AdminCode_User
        UNIQUE (AdminCodeId, UserId),
    FOREIGN KEY (AdminCodeId) references AdminCode(AdminCodeId),
    FOREIGN KEY (UserId) references Users(UserId)
)
GO
--ORDER
CREATE TABLE Orders(
	OrderId INT IDENTITY(1,1) PRIMARY KEY,
	UserId INT NOT NULL,
	RestaurantId INT NOT NULL,
    CodeSaleId INT NULL,
    UserAddressId INT NOT NULL,
    DeliveryAddress NVARCHAR(255) NOT NULL,  -- Snapshot địa chỉ nhận lúc đặt
    ReceiverPhone VARCHAR(20) NOT NULL,      -- Snapshot SĐT nhận
	OrderStatus NVARCHAR(30) NOT NULL 
        CONSTRAINT DF_Orders_Status DEFAULT 'PENDING'
        CONSTRAINT CK_Orders_Status CHECK (OrderStatus IN (
            'PENDING',           -- Chờ xác nhận / Chờ thanh toán 
            'CONFIRMED',         -- Quán đã nhận đơn
            'PREPARING',         -- Quán đang nấu
            'READY_FOR_PICKUP',  -- Món đã xong, chờ tài xế lấy
            'DELIVERING',        -- Tài xế đang trên đường giao
            'COMPLETED',         -- Giao thành công & hoàn tất đơn
            'CANCELLED'          -- Đơn đã bị hủy
        )),
	SubTotal DECIMAL(18,2) NOT NULL,           -- Tổng tiền gốc của các món
    DiscountAmount DECIMAL(18,2) DEFAULT 0,    -- Số tiền thực tế được giảm từ mã
    DeliveryFee DECIMAL(18,2) DEFAULT 0,       -- Phí ship (nếu có)
    TotalPrice DECIMAL(18,2) NOT NULL,         -- Tiền thanh toán cuối = SubTotal - DiscountAmount + DeliveryFee
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CompletedAt DATETIME2 NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RestaurantId) REFERENCES Restaurants(RestaurantId),
    FOREIGN KEY (CodeSaleId) REFERENCES CodeSale(CodeSaleId),
    FOREIGN KEY (UserAddressId) REFERENCES UserAddress(UserAddressId)
)
GO
-- ORDER_ITEMS
CREATE TABLE OrderItems(
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName NVARCHAR(150) NOT NULL,
    MenuItemId INT NOT NULL ,
    OrderId INT NOT NULL ,
    Quantity INT NOT NULL 
        CONSTRAINT CK_OrderItems_Quantity CHECK (Quantity > 0), -- Số lượng món (1, 2, 3...)
    UnitPrice DECIMAL(18,2) NOT NULL,          -- Đơn giá tại thời điểm đặt
    TotalPrice AS (Quantity * UnitPrice),      -- Cột tính toán tự động: Thành tiền = Số lượng * Đơn giá
    Note NVARCHAR(255) NULL,                   -- Ghi chú riêng cho món (VD: Không hành, ít ngọt)

    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(MenuItemId)
    --ON DELETE CASCADE ở khóa ngoại OrderId: Khi xóa một đơn hàng test/hủy, toàn bộ chi tiết món của đơn đó sẽ tự động được dọn dẹp theo.
)
GO
-- CART (GIỎ HÀNG)
CREATE TABLE Cart(
    CartId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO
-- CART_ITEMS (món trong giỏ hàng)
CREATE TABLE CartItems(
    CartItemsId INT IDENTITY(1,1) PRIMARY KEY,
    Quantity INT NOT NULL DEFAULT 1 CONSTRAINT CK_CartItems_Quantity CHECK (Quantity > 0),
    CartId INT NOT NULL,
    MenuItemId INT NOT NULL,
    CONSTRAINT UQ_CartItems_Cart_MenuItem
       UNIQUE (CartId, MenuItemId),
    FOREIGN KEY(CartId) REFERENCES Cart(CartId),
    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(MenuItemId)
)
GO
-- BILL
CREATE TABLE BILL(
    BillId INT IDENTITY(1,1) PRIMARY KEY,
    BillCode varchar(20),
    OrderId INT UNIQUE NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL
        CONSTRAINT DF_BILL_PaymentMethod default 'CASH'
        CONSTRAINT CK_BILL_PaymentMethod CHECK(PaymentMethod IN (
            'CASH',
            'BANKING'
        )),
    PaymentStatus NVARCHAR(30) NOT NULL
       CONSTRAINT DF_Bill_PaymentStatus DEFAULT 'UNPAID'
       CONSTRAINT CK_Bill_PaymentStatus CHECK (PaymentStatus IN (
        'UNPAID',      -- Chưa thanh toán (VD: Đơn ship COD chưa nhận, hoặc mới tạo link QR)
        'PENDING',     -- Đang xử lý giao dịch (VD: Đang chờ Cổng thanh toán VNPay/Momo phản hồi)
        'PAID',        -- Đã thanh toán thành công
        'FAILED',      -- Giao dịch lỗi / Thẻ bị từ chối / Hết thời gian chờ thanh toán
        'REFUNDED',    -- Đã hoàn trả tiền cho khách (khi hủy đơn)
        'PARTIALLY_REFUNDED' -- Hoàn tiền 1 phần (VD: Quán hết 1 món trong đơn nhiều món)
    )),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE
)
GO
--SHIPPER
CREATE TABLE Shipper(
    ShipperId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT UNIQUE NOT NULL,
    FOREIGN KEY (UserId) references Users(UserId)
)
GO
-- DELIVERIES : giao hàng
CREATE TABLE Deliveries(
    DeliveriesId INT IDENTITY(1,1) PRIMARY KEY,
    DeliveriesCode VARCHAR(20),
    OrderId INT NOT NULL,
    ShipperId INT NULL,
    DeliveryStatus NVARCHAR(30) NOT NULL 
        CONSTRAINT DF_Deliveries_Status DEFAULT 'FINDING_DRIVER'
        CONSTRAINT CK_Deliveries_Status CHECK (DeliveryStatus IN (
            'FINDING_DRIVER',   -- Hệ thống đang tìm tài xế gần quán
            'ACCEPTED',         -- Tài xế đã nhận đơn và đang di chuyển tới quán
            'ARRIVED_AT_STORE', -- Tài xế đã tới quán, đang chờ lấy đồ ăn
            'PICKED_UP',        -- Tài xế đã lấy món, bắt đầu đi giao (On the way)
            'ARRIVED_AT_BUYER', -- Tài xế đã tới địa chỉ khách nhận
            'DELIVERED',        -- Đã giao hàng thành công tận tay khách
            'FAILED',           -- Giao thất bại (Khách không nghe máy, boom hàng, sai địa chỉ)
            'CANCELLED'         -- Chuyến giao bị hủy (Khách hủy đơn hoặc tài xế hủy nhận đơn)
        )),
    -- Các mốc thời gian theo dõi tiến độ (Tracking)
    PickupTime DATETIME2 NULL,                 -- Thời điểm tài xế lấy món
    DeliveryTime DATETIME2 NULL,               -- Thời điểm giao thành công
    CancelReason NVARCHAR(255) NULL,           -- Lý do nếu giao thất bại / hủy
    
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME() not null,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (ShipperId) REFERENCES Shipper(ShipperId)
)

-- Bổ sung cột Role cho bảng Users (Xác định vai trò cấp Hệ thống)
ALTER TABLE Users
ADD SystemRole NVARCHAR(30) NOT NULL 
    CONSTRAINT DF_Users_SystemRole DEFAULT 'CUSTOMER'
    CONSTRAINT CK_Users_SystemRole CHECK (SystemRole IN ('CUSTOMER', 'MERCHANT', 'SHIPPER', 'ADMIN'));
GO

-- Tạo bảng Quản lý Phân quyền Nhà hàng (RestaurantManagers)
CREATE TABLE RestaurantManagers (
    ManagerId INT IDENTITY(1,1) PRIMARY KEY,
    RestaurantId INT NOT NULL,
    UserId INT NOT NULL,
    
    -- Vai trò trong nội bộ nhà hàng
    RestaurantRole NVARCHAR(50) NOT NULL 
        CONSTRAINT DF_RestaurantManagers_Role DEFAULT 'STAFF'
        CONSTRAINT CK_RestaurantManagers_Role CHECK (RestaurantRole IN (
            'OWNER',   -- Toàn quyền: sửa thông tin quán, quản lý nhân viên, xóa quán
            'MANAGER', -- Quản lý menu, xem doanh thu, xử lý đơn hàng
            'STAFF'    -- Nhân viên: chỉ xem đơn, cập nhật trạng thái món (hết món/còn món)
        )),
    
    IsActive BIT NOT NULL DEFAULT 1,          -- Trạng thái làm việc (1: Đang làm, 0: Tạm khóa/Nghỉ việc)
    AssignedAt DATETIME2 DEFAULT SYSUTCDATETIME(),

    -- Đảm bảo 1 user không bị gán trùng lặp 2 lần vào cùng 1 nhà hàng
    CONSTRAINT UQ_Restaurant_User UNIQUE (RestaurantId, UserId),
    
    FOREIGN KEY (RestaurantId) REFERENCES Restaurants(RestaurantId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);
GO