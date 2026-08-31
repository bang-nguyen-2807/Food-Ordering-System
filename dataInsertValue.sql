USE FoodOrderingSystem
GO

/* =========================================================
   1. USERS
   ========================================================= */

INSERT INTO Users
(
    FullName,
    UserName,
    Password,
    NumberPhone,
    Email
)
VALUES
(N'Nguyễn Văn An', 'nguyenan', '123456', '0901000001', 'an@gmail.com'),
(N'Trần Thị Bình', 'tranbinh', '123456', '0901000002', 'binh@gmail.com'),
(N'Lê Hoàng Nam', 'lenam', '123456', '0901000003', 'nam@gmail.com'),
(N'Phạm Minh Anh', 'minhanh', '123456', '0901000004', 'minhanh@gmail.com'),
(N'Đỗ Quang Huy', 'quanghuy', '123456', '0901000005', 'huy@gmail.com'),
(N'Nguyễn Thị Lan', 'thilan', '123456', '0901000006', 'lan@gmail.com'),
(N'Trần Minh Đức', 'minhduc', '123456', '0901000007', 'duc@gmail.com'),
(N'Lê Thu Hà', 'leha', '123456', '0901000008', 'ha@gmail.com'),
(N'Phạm Quốc Bảo', 'quocbao', '123456', '0901000009', 'bao@gmail.com'),
(N'Hoàng Ngọc Mai', 'ngocmai', '123456', '0901000010', 'mai@gmail.com'),
(N'Vũ Thành Long', 'thanhlong', '123456', '0901000011', 'long@gmail.com'),
(N'Đặng Thùy Linh', 'thuylinh', '123456', '0901000012', 'linh@gmail.com'),
(N'Bùi Đức Anh', 'ducanh', '123456', '0901000013', 'ducanh@gmail.com'),
(N'Nguyễn Phương Thảo', 'phuongthao', '123456', '0901000014', 'thao@gmail.com'),
(N'Trần Quốc Việt', 'quocviet', '123456', '0901000015', 'viet@gmail.com'),

-- 5 SHIPPER
(N'Nguyễn Văn Hải', 'shipperhai', '123456', '0902000001', 'hai@shipper.com'),
(N'Trần Văn Khoa', 'shipperkhoa', '123456', '0902000002', 'khoa@shipper.com'),
(N'Lê Minh Tâm', 'shippertam', '123456', '0902000003', 'tam@shipper.com'),
(N'Phạm Văn Dũng', 'shipperdung', '123456', '0902000004', 'dung@shipper.com'),
(N'Hoàng Văn Sơn', 'shipperson', '123456', '0902000005', 'son@shipper.com');
GO


/* =========================================================
   2. USER ADDRESS
   ========================================================= */

INSERT INTO UserAddress
(
    AddressName,
    Addresses,
    UserId
)
VALUES
-- User 1
(N'Nhà', N'12 Nguyễn Huệ, TP Huế', 1),
(N'Công ty', N'25 Lê Lợi, TP Huế', 1),

-- User 2
(N'Nhà', N'45 Trần Hưng Đạo, TP Huế', 2),
(N'Công ty', N'10 Võ Thị Sáu, TP Huế', 2),

-- User 3
(N'Nhà', N'18 Nguyễn Trãi, TP Huế', 3),
(N'Công ty', N'50 Bà Triệu, TP Huế', 3),

-- User 4
(N'Nhà', N'20 Phan Chu Trinh, TP Huế', 4),
(N'Công ty', N'80 Điện Biên Phủ, TP Huế', 4),

-- User 5
(N'Nhà', N'15 Hai Bà Trưng, TP Huế', 5),
(N'Công ty', N'35 Đống Đa, TP Huế', 5),

-- User 6
(N'Nhà', N'100 Nguyễn Sinh Cung, TP Huế', 6),
(N'Công ty', N'55 Nguyễn Tất Thành, TP Huế', 6),

-- User 7
(N'Nhà', N'22 Lý Thường Kiệt, TP Huế', 7),
(N'Công ty', N'77 Hà Nội, TP Huế', 7),

-- User 8
(N'Nhà', N'31 Trường Chinh, TP Huế', 8),
(N'Công ty', N'66 Tố Hữu, TP Huế', 8),

-- User 9
(N'Nhà', N'14 Nguyễn Khoa Chiêm, TP Huế', 9),
(N'Công ty', N'88 Phạm Văn Đồng, TP Huế', 9),

-- User 10
(N'Nhà', N'90 Nguyễn Công Trứ, TP Huế', 10),
(N'Công ty', N'12 Duy Tân, TP Huế', 10),

-- User 11
(N'Nhà', N'17 Mai Thúc Loan, TP Huế', 11),
(N'Công ty', N'42 Nguyễn Chí Thanh, TP Huế', 11),

-- User 12
(N'Nhà', N'23 Đặng Trần Côn, TP Huế', 12),
(N'Công ty', N'39 Nguyễn Thái Học, TP Huế', 12),

-- User 13
(N'Nhà', N'55 Chi Lăng, TP Huế', 13),
(N'Công ty', N'70 Nguyễn Bỉnh Khiêm, TP Huế', 13),

-- User 14
(N'Nhà', N'16 Đinh Tiên Hoàng, TP Huế', 14),
(N'Công ty', N'29 Lê Duẩn, TP Huế', 14),

-- User 15
(N'Nhà', N'75 Nguyễn Sinh Sắc, TP Huế', 15),
(N'Công ty', N'100 Hùng Vương, TP Huế', 15);
GO


/* =========================================================
   3. CATEGORIES
   ========================================================= */

INSERT INTO Categories
(
    CategoriesName,
    CategoriesCode,
    Descriptions,
    ImageUrl
)
VALUES
(N'Đồ ăn', 'FOOD', N'Các món ăn chính', NULL),
(N'Đồ uống', 'DRINK', N'Nước uống các loại', NULL),
(N'Đồ chay', 'VEGETARIAN', N'Món ăn chay', NULL),
(N'Bánh', 'CAKE', N'Các loại bánh', NULL),
(N'Tráng miệng', 'DESSERT', N'Món tráng miệng', NULL),
(N'Pizza Burger', 'PIZZA_BURGER', N'Pizza và Burger', NULL),
(N'Lẩu', 'HOT_POT', N'Các món lẩu', NULL),
(N'Mì Phở', 'NOODLE', N'Mì, phở và bún', NULL);
GO


/* =========================================================
   4. RESTAURANTS
   ========================================================= */

INSERT INTO Restaurants
(
    RestaurantName,
    Addresses
)
VALUES
(N'Bếp Huế', N'15 Nguyễn Huệ, TP Huế'),
(N'Phố Ăn Nhanh', N'25 Lê Lợi, TP Huế'),
(N'Nhà Hàng Sen', N'50 Trần Hưng Đạo, TP Huế'),
(N'Pizza House', N'80 Hùng Vương, TP Huế'),
(N'Food Corner', N'100 Nguyễn Sinh Cung, TP Huế');
GO


/* =========================================================
   5. CATEGORIES RESTAURANT
   ========================================================= */

INSERT INTO CategoriesRestaurant
(
    RestaurantId,
    CategoriesRestaurantName,
    CategorieRestaurantsCode,
    Descriptions,
    ImageUrl
)
VALUES
-- Bếp Huế
(1, N'Món Huế', 'HUE', N'Đặc sản Huế', NULL),
(1, N'Món nước', 'HUE_NOODLE', N'Bún, phở, mì', NULL),
(1, N'Đồ uống', 'HUE_DRINK', N'Nước uống', NULL),

-- Phố Ăn Nhanh
(2, N'Cơm', 'RICE', N'Các món cơm', NULL),
(2, N'Mì', 'NOODLE', N'Mì và bún', NULL),
(2, N'Đồ uống', 'DRINK', N'Nước uống', NULL),

-- Nhà Hàng Sen
(3, N'Món chính', 'MAIN', N'Món ăn chính', NULL),
(3, N'Lẩu', 'HOT_POT', N'Các món lẩu', NULL),
(3, N'Món chay', 'VEGETARIAN', N'Món chay', NULL),

-- Pizza House
(4, N'Pizza', 'PIZZA', N'Pizza các loại', NULL),
(4, N'Burger', 'BURGER', N'Burger các loại', NULL),
(4, N'Đồ uống', 'DRINK', N'Nước uống', NULL),

-- Food Corner
(5, N'Cơm', 'RICE', N'Cơm phần', NULL),
(5, N'Mì Phở', 'NOODLE', N'Mì và phở', NULL),
(5, N'Tráng miệng', 'DESSERT', N'Tráng miệng', NULL);
GO


/* =========================================================
   6. MENU ITEMS
   50 MÓN
   Mỗi nhà hàng 10 món
   ========================================================= */

INSERT INTO MenuItems
(
    CategoriesRestaurantId,
    NameMenuItems,
    ImageUrl,
    Price,
    is_available,
    display_order
)
VALUES

/* ================= BẾP HUẾ ================= */

(1, N'Bún bò Huế', NULL, 45000, 1, 1),
(1, N'Cơm hến', NULL, 35000, 1, 2),
(1, N'Bánh bèo Huế', NULL, 30000, 1, 3),
(1, N'Bánh nậm', NULL, 30000, 1, 4),

(2, N'Phở bò', NULL, 50000, 1, 5),
(2, N'Phở gà', NULL, 45000, 1, 6),
(2, N'Bún thịt nướng', NULL, 45000, 1, 7),

(3, N'Trà đào', NULL, 30000, 1, 8),
(3, N'Trà tắc', NULL, 25000, 1, 9),
(3, N'Cà phê sữa', NULL, 30000, 1, 10),


/* ================= PHỐ ĂN NHANH ================= */

(4, N'Cơm gà chiên', NULL, 55000, 1, 1),
(4, N'Cơm sườn', NULL, 60000, 1, 2),
(4, N'Cơm bò xào', NULL, 65000, 1, 3),
(4, N'Cơm chiên Dương Châu', NULL, 50000, 1, 4),

(5, N'Mì xào bò', NULL, 55000, 1, 5),
(5, N'Mì xào hải sản', NULL, 65000, 1, 6),
(5, N'Bún bò Huế', NULL, 45000, 1, 7),

(6, N'Coca Cola', NULL, 20000, 1, 8),
(6, N'Pepsi', NULL, 20000, 1, 9),
(6, N'Nước cam', NULL, 25000, 1, 10),


/* ================= NHÀ HÀNG SEN ================= */

(7, N'Cá kho tộ', NULL, 75000, 1, 1),
(7, N'Thịt kho trứng', NULL, 70000, 1, 2),
(7, N'Gà nướng mật ong', NULL, 85000, 1, 3),

(8, N'Lẩu thái', NULL, 250000, 1, 4),
(8, N'Lẩu hải sản', NULL, 300000, 1, 5),
(8, N'Lẩu bò', NULL, 280000, 1, 6),

(9, N'Đậu hũ sốt cà chua', NULL, 45000, 1, 7),
(9, N'Nấm xào rau củ', NULL, 55000, 1, 8),
(9, N'Cơm chiên chay', NULL, 50000, 1, 9),
(9, N'Rau củ kho quẹt chay', NULL, 45000, 1, 10),


/* ================= PIZZA HOUSE ================= */

(10, N'Pizza bò BBQ', NULL, 150000, 1, 1),
(10, N'Pizza hải sản', NULL, 170000, 1, 2),
(10, N'Pizza xúc xích', NULL, 130000, 1, 3),
(10, N'Pizza phô mai', NULL, 120000, 1, 4),

(11, N'Burger bò', NULL, 75000, 1, 5),
(11, N'Burger gà', NULL, 70000, 1, 6),
(11, N'Burger phô mai', NULL, 80000, 1, 7),

(12, N'Coca Cola', NULL, 20000, 1, 8),
(12, N'Trà đào', NULL, 30000, 1, 9),
(12, N'Soda chanh', NULL, 30000, 1, 10),


/* ================= FOOD CORNER ================= */

(13, N'Cơm gà', NULL, 55000, 1, 1),
(13, N'Cơm sườn', NULL, 60000, 1, 2),
(13, N'Cơm bò lúc lắc', NULL, 80000, 1, 3),

(14, N'Phở bò', NULL, 50000, 1, 4),
(14, N'Phở gà', NULL, 45000, 1, 5),
(14, N'Mì Quảng', NULL, 50000, 1, 6),

(15, N'Chè Huế', NULL, 30000, 1, 7),
(15, N'Bánh flan', NULL, 25000, 1, 8),
(15, N'Kem vani', NULL, 30000, 1, 9),
(15, N'Chè khúc bạch', NULL, 35000, 1, 10);
GO


/* =========================================================
   7. ADMIN CODE
   ========================================================= */

INSERT INTO AdminCode
(
    CodeSale,
    DiscountType,
    Amount,
    MaxAmount,
    MinOrderAmount,
    UsageLimit,
    UsedCount,
    StartDate,
    EndDate,
    IsActive
)
VALUES
(
    'WELCOME50',
    'PERCENTAGE',
    10,
    50000,
    100000,
    100,
    0,
    '2026-01-01',
    '2026-12-31',
    1
);
GO


/* =========================================================
   8. CODE SALE
   Cấp WELCOME50 cho một số user
   ========================================================= */

INSERT INTO CodeSale
(
    AdminCodeId,
    UserId,
    IsUsed
)
VALUES
(1, 1, 0),
(1, 2, 0),
(1, 3, 0),
(1, 4, 0),
(1, 5, 0),
(1, 6, 0),
(1, 7, 0),
(1, 8, 0);
GO


/* =========================================================
   9. CART
   MỖI USER 1 CART
   ========================================================= */

INSERT INTO Cart(UserId)
VALUES
(1),(2),(3),(4),(5),
(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15),
(16),(17),(18),(19),(20);
GO


/* =========================================================
   10. CART ITEMS
   MỖI CART CÓ THỂ CÓ NHIỀU MÓN
   ========================================================= */

INSERT INTO CartItems
(
    Quantity,
    CartId,
    MenuItemId
)
VALUES
(2, 1, 1),
(1, 1, 8),
(1, 1, 15),

(1, 2, 11),
(2, 2, 18),

(1, 3, 21),
(1, 3, 24),
(2, 3, 28),

(2, 4, 31),
(1, 4, 35),

(1, 5, 41),
(2, 5, 47),

(1, 6, 2),
(1, 6, 5),

(2, 7, 12),
(1, 7, 19),

(1, 8, 22),
(1, 8, 27),

(1, 9, 32),
(2, 9, 36),

(1, 10, 42),
(1, 10, 48),

(1, 11, 3),
(2, 11, 9),

(1, 12, 13),
(1, 12, 20),

(2, 13, 23),
(1, 13, 29),

(1, 14, 33),
(1, 14, 37),

(1, 15, 43),
(2, 15, 50);
GO


/* =========================================================
   11. ORDERS
   15 ĐƠN HÀNG
   ========================================================= */

INSERT INTO Orders
(
    UserId,
    RestaurantId,
    CodeSaleId,
    UserAddressId,
    DeliveryAddress,
    ReceiverPhone,
    OrderStatus,
    SubTotal,
    DiscountAmount,
    DeliveryFee,
    TotalPrice,
    CreatedAt,
    CompletedAt
)
VALUES

-- Order 1
(1, 1, 1, 1,
 N'12 Nguyễn Huệ, TP Huế',
 '0901000001',
 'COMPLETED',
 125000, 12500, 15000, 127500,
 '2026-08-01 10:00',
 '2026-08-01 11:00'),

-- Order 2
(2, 2, 2, 3,
 N'45 Trần Hưng Đạo, TP Huế',
 '0901000002',
 'COMPLETED',
 115000, 11500, 15000, 118500,
 '2026-08-02 11:00',
 '2026-08-02 12:00'),

-- Order 3
(3, 3, 3, 5,
 N'18 Nguyễn Trãi, TP Huế',
 '0901000003',
 'COMPLETED',
 325000, 32500, 20000, 312500,
 '2026-08-03 12:00',
 '2026-08-03 13:00'),

-- Order 4
(4, 4, 4, 7,
 N'20 Phan Chu Trinh, TP Huế',
 '0901000004',
 'DELIVERING',
 225000, 22500, 15000, 217500,
 '2026-08-04 13:00',
 NULL),

-- Order 5
(5, 5, 5, 9,
 N'15 Hai Bà Trưng, TP Huế',
 '0901000005',
 'COMPLETED',
 140000, 14000, 15000, 141000,
 '2026-08-05 14:00',
 '2026-08-05 15:00'),

-- Order 6
(6, 1, NULL, 11,
 N'100 Nguyễn Sinh Cung, TP Huế',
 '0901000006',
 'PREPARING',
 95000, 0, 15000, 110000,
 '2026-08-06 15:00',
 NULL),

-- Order 7
(7, 2, NULL, 13,
 N'22 Lý Thường Kiệt, TP Huế',
 '0901000007',
 'CONFIRMED',
 105000, 0, 15000, 120000,
 '2026-08-07 16:00',
 NULL),

-- Order 8
(8, 3, NULL, 15,
 N'31 Trường Chinh, TP Huế',
 '0901000008',
 'CANCELLED',
 300000, 0, 20000, 320000,
 '2026-08-08 17:00',
 NULL),

-- Order 9
(9, 4, NULL, 17,
 N'14 Nguyễn Khoa Chiêm, TP Huế',
 '0901000009',
 'COMPLETED',
 150000, 0, 15000, 165000,
 '2026-08-09 18:00',
 '2026-08-09 19:00'),

-- Order 10
(10, 5, NULL, 19,
 N'90 Nguyễn Công Trứ, TP Huế',
 '0901000010',
 'COMPLETED',
 100000, 0, 15000, 115000,
 '2026-08-10 19:00',
 '2026-08-10 20:00'),

-- Order 11
(11, 1, NULL, 21,
 N'17 Mai Thúc Loan, TP Huế',
 '0901000011',
 'READY_FOR_PICKUP',
 100000, 0, 15000, 115000,
 '2026-08-11 10:00',
 NULL),

-- Order 12
(12, 2, NULL, 23,
 N'23 Đặng Trần Côn, TP Huế',
 '0901000012',
 'PENDING',
 130000, 0, 15000, 145000,
 '2026-08-12 11:00',
 NULL),

-- Order 13
(13, 3, NULL, 25,
 N'55 Chi Lăng, TP Huế',
 '0901000013',
 'PREPARING',
 165000, 0, 20000, 185000,
 '2026-08-13 12:00',
 NULL),

-- Order 14
(14, 4, NULL, 27,
 N'16 Đinh Tiên Hoàng, TP Huế',
 '0901000014',
 'COMPLETED',
 200000, 0, 15000, 215000,
 '2026-08-14 13:00',
 '2026-08-14 14:00'),

-- Order 15
(15, 5, NULL, 29,
 N'75 Nguyễn Sinh Sắc, TP Huế',
 '0901000015',
 'CANCELLED',
 80000, 0, 15000, 95000,
 '2026-08-15 14:00',
 NULL);
GO


/* =========================================================
   12. ORDER ITEMS
   ========================================================= */

INSERT INTO OrderItems
(
    ItemName,
    MenuItemId,
    OrderId,
    Quantity,
    UnitPrice,
    Note
)
VALUES

-- Order 1 - Bếp Huế
(N'Bún bò Huế', 1, 1, 2, 45000, N'Ít cay'),
(N'Trà đào', 8, 1, 1, 30000, NULL),

-- Order 2 - Phố Ăn Nhanh
(N'Cơm gà chiên', 11, 2, 1, 55000, NULL),
(N'Mì xào bò', 15, 2, 1, 55000, N'Không hành'),

-- Order 3 - Nhà Hàng Sen
(N'Cá kho tộ', 21, 3, 1, 75000, NULL),
(N'Lẩu thái', 24, 3, 1, 250000, N'Ít cay'),

-- Order 4 - Pizza House
(N'Pizza bò BBQ', 31, 4, 1, 150000, NULL),
(N'Coca Cola', 38, 4, 2, 20000, NULL),
(N'Soda chanh', 40, 4, 1, 30000, NULL),

-- Order 5 - Food Corner
(N'Cơm gà', 41, 5, 1, 55000, NULL),
(N'Phở bò', 44, 5, 1, 50000, NULL),
(N'Chè Huế', 47, 5, 1, 30000, NULL),

-- Order 6
(N'Bánh bèo Huế', 3, 6, 1, 30000, NULL),
(N'Phở bò', 5, 6, 1, 50000, NULL),

-- Order 7
(N'Cơm sườn', 12, 7, 1, 60000, NULL),
(N'Coca Cola', 18, 7, 2, 20000, NULL),

-- Order 8
(N'Thịt kho trứng', 22, 8, 1, 70000, NULL),
(N'Lẩu hải sản', 25, 8, 1, 300000, NULL),

-- Order 9
(N'Pizza hải sản', 32, 9, 1, 170000, NULL),

-- Order 10
(N'Cơm sườn', 42, 10, 1, 60000, NULL),
(N'Phở gà', 45, 10, 1, 45000, NULL),

-- Order 11
(N'Cơm hến', 2, 11, 2, 35000, NULL),
(N'Cà phê sữa', 10, 11, 1, 30000, NULL),

-- Order 12
(N'Cơm chiên Dương Châu', 14, 12, 2, 50000, NULL),
(N'Nước cam', 20, 12, 1, 25000, NULL),

-- Order 13
(N'Gà nướng mật ong', 23, 13, 1, 85000, NULL),
(N'Đậu hũ sốt cà chua', 27, 13, 1, 45000, NULL),
(N'Cơm chiên chay', 29, 13, 1, 50000, NULL),

-- Order 14
(N'Pizza bò BBQ', 31, 14, 1, 150000, NULL),
(N'Burger bò', 35, 14, 1, 75000, NULL),

-- Order 15
(N'Cơm gà', 41, 15, 1, 55000, NULL),
(N'Bánh flan', 48, 15, 1, 25000, NULL);
GO


/* =========================================================
   13. BILL
   ========================================================= */

INSERT INTO BILL
(
    BillCode,
    OrderId,
    PaymentMethod,
    PaymentStatus
)
VALUES
('BILL0001', 1, 'CASH', 'PAID'),
('BILL0002', 2, 'BANKING', 'PAID'),
('BILL0003', 3, 'BANKING', 'PAID'),
('BILL0004', 4, 'BANKING', 'PAID'),
('BILL0005', 5, 'CASH', 'PAID'),
('BILL0006', 6, 'CASH', 'UNPAID'),
('BILL0007', 7, 'BANKING', 'PAID'),
('BILL0008', 8, 'CASH', 'REFUNDED'),
('BILL0009', 9, 'BANKING', 'PAID'),
('BILL0010', 10, 'CASH', 'PAID'),
('BILL0011', 11, 'CASH', 'UNPAID'),
('BILL0012', 12, 'BANKING', 'PENDING'),
('BILL0013', 13, 'BANKING', 'PAID'),
('BILL0014', 14, 'BANKING', 'PAID'),
('BILL0015', 15, 'CASH', 'REFUNDED');
GO


/* =========================================================
   14. SHIPPER
   ========================================================= */

INSERT INTO Shipper(UserId)
VALUES
(16),
(17),
(18),
(19),
(20);
GO


/* =========================================================
   15. DELIVERIES
   ========================================================= */

INSERT INTO Deliveries
(
    DeliveriesCode,
    OrderId,
    ShipperId,
    DeliveryStatus,
    PickupTime,
    DeliveryTime,
    CancelReason
)
VALUES

('DEL0001', 1, 1, 'DELIVERED',
 '2026-08-01 10:30',
 '2026-08-01 11:00',
 NULL),

('DEL0002', 2, 2, 'DELIVERED',
 '2026-08-02 11:30',
 '2026-08-02 12:00',
 NULL),

('DEL0003', 3, 3, 'DELIVERED',
 '2026-08-03 12:30',
 '2026-08-03 13:00',
 NULL),

('DEL0004', 4, 4, 'PICKED_UP',
 '2026-08-04 13:30',
 NULL,
 NULL),

('DEL0005', 5, 5, 'DELIVERED',
 '2026-08-05 14:30',
 '2026-08-05 15:00',
 NULL),

('DEL0006', 6, 1, 'ARRIVED_AT_STORE',
 NULL,
 NULL,
 NULL),

('DEL0007', 7, 2, 'ACCEPTED',
 NULL,
 NULL,
 NULL),

('DEL0008', 8, 3, 'CANCELLED',
 NULL,
 NULL,
 N'Khách hủy đơn'),

('DEL0009', 9, 4, 'DELIVERED',
 '2026-08-09 18:30',
 '2026-08-09 19:00',
 NULL),

('DEL0010', 10, 5, 'DELIVERED',
 '2026-08-10 19:30',
 '2026-08-10 20:00',
 NULL),

('DEL0011', 11, 1, 'ARRIVED_AT_STORE',
 NULL,
 NULL,
 NULL),

('DEL0012', 12, NULL, 'FINDING_DRIVER',
 NULL,
 NULL,
 NULL),

('DEL0013', 13, 2, 'ACCEPTED',
 NULL,
 NULL,
 NULL),

('DEL0014', 14, 3, 'DELIVERED',
 '2026-08-14 13:30',
 '2026-08-14 14:00',
 NULL),

('DEL0015', 15, 4, 'CANCELLED',
 NULL,
 NULL,
 N'Khách hủy đơn');
GO

USE FoodOrderingSystem
GO

/* =========================================================
   1. TẠO 5 TÀI KHOẢN CHỦ / QUẢN LÝ NHÀ HÀNG (SystemRole = 'MERCHANT')
   UserId sẽ tiếp nối từ 21 đến 25
   ========================================================= */

INSERT INTO Users (FullName, UserName, Password, NumberPhone, Email, SystemRole)
VALUES
(N'Nguyễn Thành Long (Chủ Bếp Huế)',     'owner_bephue',     '123456', '0903000001', 'bephue@merchant.com',     'MERCHANT'),
(N'Trần Minh Tâm (Chủ Phố Ăn Nhanh)',   'owner_phoannhanh', '123456', '0903000002', 'phoannhanh@merchant.com', 'MERCHANT'),
(N'Lê Hoàng Phúc (Chủ Nhà Hàng Sen)',   'owner_nhahangsen', '123456', '0903000003', 'nhahangsen@merchant.com', 'MERCHANT'),
(N'Phạm Thu Thảo (Chủ Pizza House)',    'owner_pizzahouse', '123456', '0903000004', 'pizzahouse@merchant.com', 'MERCHANT'),
(N'Đỗ Hữu Nghĩa (Chủ Food Corner)',     'owner_foodcorner', '123456', '0903000005', 'foodcorner@merchant.com', 'MERCHANT');
GO

/* =========================================================
   2. TẠO GIỎ HÀNG CHO CÁC USER MỚI
   ========================================================= */

INSERT INTO Cart (UserId)
SELECT UserId FROM Users WHERE UserName IN (
    'owner_bephue', 'owner_phoannhanh', 'owner_nhahangsen', 'owner_pizzahouse', 'owner_foodcorner'
);
GO

/* =========================================================
   3. GÁN QUYỀN OWNER CHO 5 NHÀ HÀNG (RestaurantManagers)
   ========================================================= */

INSERT INTO RestaurantManagers (RestaurantId, UserId, RestaurantRole, IsActive)
VALUES
-- Nhà hàng 1: Bếp Huế
(1, (SELECT UserId FROM Users WHERE UserName = 'owner_bephue'),     'OWNER', 1),

-- Nhà hàng 2: Phố Ăn Nhanh
(2, (SELECT UserId FROM Users WHERE UserName = 'owner_phoannhanh'), 'OWNER', 1),

-- Nhà hàng 3: Nhà Hàng Sen
(3, (SELECT UserId FROM Users WHERE UserName = 'owner_nhahangsen'), 'OWNER', 1),

-- Nhà hàng 4: Pizza House
(4, (SELECT UserId FROM Users WHERE UserName = 'owner_pizzahouse'), 'OWNER', 1),

-- Nhà hàng 5: Food Corner
(5, (SELECT UserId FROM Users WHERE UserName = 'owner_foodcorner'), 'OWNER', 1);
GO

/* =========================================================
   4. CẬP NHẬT SystemRole = 'SHIPPER' CHO 5 TÀI XẾ ĐÃ CÓ (UserId 16 -> 20)
   ========================================================= */

UPDATE Users 
SET SystemRole = 'SHIPPER'
WHERE UserId IN (16, 17, 18, 19, 20);
GO