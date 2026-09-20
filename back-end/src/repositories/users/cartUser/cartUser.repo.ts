import { connnectDB } from "../../../config/database"
import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class CartUserRepo{
    async addItemsToCart(UserId : string, RestaurantId : string, MenuItemId : string, Quantity : number = 1){ // thêm món ăn vào giỏ hàng  , giá trị quantity = 1 la thiet lap mac dinh
        const query = `
             SET NOCOUNT ON;
            DECLARE @CartId INT;
            DECLARE @CurrentRestaurantId INT;
            -- Lấy Cart hiện tại của User
            SELECT @CartId = CartId, @CurrentRestaurantId = RestaurantId 
            FROM Cart 
            WHERE UserId = @UserId;
            IF @CartId IS NULL
            BEGIN
                -- Trường hợp 1: Chưa có giỏ hàng -> Tạo giỏ hàng mới gắn với RestaurantId
                INSERT INTO Cart (UserId, RestaurantId) VALUES (@UserId, @RestaurantId);
                SET @CartId = SCOPE_IDENTITY();
            END
            ELSE IF @CurrentRestaurantId <> @RestaurantId
            BEGIN
                -- Trường hợp 2: Khách đổi sang mua quán khác -> Xóa món cũ và đổi RestaurantId
                DELETE FROM CartItems WHERE CartId = @CartId;
                UPDATE Cart SET RestaurantId = @RestaurantId WHERE CartId = @CartId;
            END
            -- Thêm hoặc cộng dồn số lượng món vào CartItems
            IF EXISTS (SELECT 1 FROM CartItems WHERE CartId = @CartId AND MenuItemId = @MenuItemId)
            BEGIN
                UPDATE CartItems 
                SET Quantity = Quantity + @Quantity 
                WHERE CartId = @CartId AND MenuItemId = @MenuItemId;
            END
            ELSE
            BEGIN
                INSERT INTO CartItems (CartId, MenuItemId, Quantity) 
                VALUES (@CartId, @MenuItemId, @Quantity);
            END
        `
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "UserId" , type : sql.Int , value : UserId},
            {name : "RestaurantId" , type : sql.Int , value : RestaurantId},
            {name : "MenuItemId" , type : sql.Int , value : MenuItemId},
            {name : "Quantity" , type : sql.Int , value : Quantity}
        ])
    }
    async fetchItemsToCart(UserId : string , RestaurantId : number){// danh sách người dùng đã chọn món ăn trong cart
        const query = `
            SELECT 
                C.CartId,
                C.UserId,
                C.RestaurantId,
                CI.CartItemsId,
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.ImageUrl,
                MI.Price AS UnitPrice,          -- Đơn giá món ăn
                CI.Quantity,                     -- Số lượng trong giỏ
                (CI.Quantity * MI.Price) AS TotalPrice -- Thành tiền = Số lượng * Đơn giá
            FROM Cart AS C
            INNER JOIN CartItems AS CI 
                ON C.CartId = CI.CartId
            INNER JOIN MenuItems AS MI 
                ON CI.MenuItemId = MI.MenuItemId
            WHERE C.UserId = @UserId 
            AND C.RestaurantId = @RestaurantId;
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "UserId" , type : sql.Int , value : UserId},
            {name : "RestaurantId" , type : sql.Int , value : RestaurantId}
        ])
    }
    async deleteItemsFromCart(UserId : string , RestaurantId : string , MenuItemId : string){// delele items from cart
        const query = `
            DELETE CI FROM CartItems AS CI
            JOIN Cart AS C
            ON CI.CartId = C.CartId
            WHERE CI.MenuItemId = @MenuItemsId and C.UserId = @UserId and C.RestaurantId = @RestaurantId
        `
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "UserId" , type : sql.Int , value : UserId},
            {name : "RestaurantId" , type : sql.Int , value : RestaurantId},
            {name : "MenuItemsId" , type : sql.Int , value : MenuItemId}
        ])
    }
    async createOrderAndBill(UserId : string , RestaurantId : string , UserAddressId : string | null , DeliveryAddress : string , PaymentMethod : string , CodeSaleId :string|null , DeliveryFee : string){
        const query = `
            BEGIN TRANSACTION;
            BEGIN TRY
                DECLARE @CartId INT;
                DECLARE @OrderId INT;
                DECLARE @SubTotal DECIMAL(18, 2);
                DECLARE @DiscountAmount DECIMAL(18, 2) = 0;
                DECLARE @TotalPrice DECIMAL(18, 2);
                DECLARE @FinalDeliveryAddress NVARCHAR(255);
                DECLARE @ReceiverPhone VARCHAR(20);

                -- 1. Lấy CartId của người dùng đối với Nhà hàng này
                SELECT @CartId = CartId 
                FROM Cart 
                WHERE UserId = @UserId AND RestaurantId = @RestaurantId;

                -- 2. Lấy SĐT từ Users và ưu tiên dùng Địa chỉ do người dùng tự nhập
                SELECT TOP 1
                    @ReceiverPhone = ISNULL(U.NumberPhone, '0900000000')
                FROM Users U
                WHERE U.UserId = @UserId;

                -- Ưu tiên địa chỉ người dùng tự nhập từ ô Input
                IF @InputDeliveryAddress IS NOT NULL AND @InputDeliveryAddress <> ''
                    SET @FinalDeliveryAddress = @InputDeliveryAddress;
                ELSE
                    SELECT TOP 1 @FinalDeliveryAddress = Addresses FROM UserAddress WHERE UserId = @UserId;

                IF @FinalDeliveryAddress IS NULL OR @FinalDeliveryAddress = ''
                    SET @FinalDeliveryAddress = N'Địa chỉ chưa xác định';

                -- 3. Tính SubTotal (tổng tiền các món trong giỏ)
                SELECT @SubTotal = ISNULL(SUM(CI.Quantity * MI.Price), 0)
                FROM CartItems CI
                JOIN MenuItems MI ON CI.MenuItemId = MI.MenuItemId
                WHERE CI.CartId = @CartId;

                -- Tính Tổng tiền thanh toán (TotalPrice)
                SET @TotalPrice = @SubTotal - @DiscountAmount + CAST(@DeliveryFee AS DECIMAL(18, 2));

                -- 4. INSERT tạo đơn hàng mới vào bảng Orders
                INSERT INTO Orders (
                    UserId, RestaurantId, CodeSaleId, UserAddressId, 
                    DeliveryAddress, ReceiverPhone, OrderStatus, 
                    SubTotal, DiscountAmount, DeliveryFee, TotalPrice
                )
                VALUES (
                    @UserId, @RestaurantId, 
                    CASE WHEN @CodeSaleId > 0 THEN @CodeSaleId ELSE NULL END, 
                    CASE WHEN ISNUMERIC(@UserAddressId) = 1 AND @UserAddressId > 0 THEN CAST(@UserAddressId AS INT) ELSE (SELECT TOP 1 UserAddressId FROM UserAddress WHERE UserId = @UserId) END, 
                    @FinalDeliveryAddress, @ReceiverPhone, 'PENDING', 
                    @SubTotal, @DiscountAmount, CAST(@DeliveryFee AS DECIMAL(18, 2)), @TotalPrice
                );

                -- LẤY ORDERID VỪA ĐƯỢC TẠO DÙNG SCOPE_IDENTITY()
                SET @OrderId = SCOPE_IDENTITY();

                -- 5. Copy từ CartItems sang OrderItems (bao gồm ItemName, Quantity, UnitPrice)
                INSERT INTO OrderItems (ItemName, MenuItemId, OrderId, Quantity, UnitPrice)
                SELECT 
                    MI.NameMenuItems,
                    CI.MenuItemId,
                    @OrderId,
                    CI.Quantity,
                    MI.Price
                FROM CartItems CI
                JOIN MenuItems MI ON CI.MenuItemId = MI.MenuItemId
                WHERE CI.CartId = @CartId;

                -- 6. Tạo Hóa đơn mới vào bảng BILL (Mã bill dạng BILL + OrderId)
                DECLARE @BillCode VARCHAR(20) = 'BILL' + CAST(@OrderId AS VARCHAR(10));
                INSERT INTO BILL (BillCode, OrderId, PaymentMethod, PaymentStatus)
                VALUES (@BillCode, @OrderId, ISNULL(@PaymentMethod, 'CASH'), 'UNPAID');

                -- 7. Xóa sạch món ăn trong giỏ hàng CartItems sau khi lên đơn thành công
                DELETE FROM CartItems WHERE CartId = @CartId;

                COMMIT TRANSACTION;

                -- 8. Trả về thông tin Hóa đơn hoàn chỉnh kèm Trạng thái đơn hàng và Danh sách món ăn
                SELECT 
                    O.OrderId,
                    O.OrderStatus,
                    B.BillId,
                    B.BillCode,
                    B.PaymentMethod,
                    B.PaymentStatus,
                    O.SubTotal,
                    O.DiscountAmount,
                    O.DeliveryFee,
                    O.TotalPrice,
                    O.DeliveryAddress,
                    O.ReceiverPhone,
                    O.CreatedAt,
                    (
                        SELECT 
                            OI.ItemName,
                            OI.Quantity,
                            OI.UnitPrice,
                            (OI.Quantity * OI.UnitPrice) AS TotalPrice
                        FROM OrderItems OI
                        WHERE OI.OrderId = O.OrderId
                        FOR JSON PATH
                    ) AS ItemsList
                FROM Orders O
                JOIN BILL B ON O.OrderId = B.OrderId
                WHERE O.OrderId = @OrderId;
            END TRY
            BEGIN CATCH
                ROLLBACK TRANSACTION;
                THROW;
            END CATCH;
        `;

        const cleanCodeSaleId = (CodeSaleId && CodeSaleId !== "" && CodeSaleId !== "null" && CodeSaleId !== "undefined") ? parseInt(CodeSaleId) : null;
        const cleanUserAddressId = (UserAddressId && UserAddressId !== "" && UserAddressId !== "null") ? parseInt(UserAddressId) : null;

        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) },
            { name: "RestaurantId", type: sql.Int, value: parseInt(RestaurantId) },
            { name: "UserAddressId", type: sql.Int, value: cleanUserAddressId },
            { name: "InputDeliveryAddress", type: sql.NVarChar, value: DeliveryAddress || "" },
            { name: "PaymentMethod", type: sql.NVarChar, value: PaymentMethod || 'CASH' },
            { name: "CodeSaleId", type: sql.Int, value: cleanCodeSaleId },
            { name: "DeliveryFee", type: sql.Decimal, value: parseFloat(DeliveryFee) || 15000 }
        ]);
    }
    async getAddressUser(UserId : string) { // get user's address
        const query = `
            SELECT UserAddressId , AddressName , Addresses FROM UserAddress
            WHERE UserId = @UserId
        `;
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }
}