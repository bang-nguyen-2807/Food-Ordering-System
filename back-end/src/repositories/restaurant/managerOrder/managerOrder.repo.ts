import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class ManagerOrderRepo{
    async ManagerOrder(UserId : string , OrderStatus : string){
        const query = `
            WITH AggregatedItems AS (
            -- Gom chi tiết từng món: Tên, Số lượng, Đơn giá, Thành tiền, Ghi chú
            SELECT 
                OrderId,
                CONCAT(
                    ItemName, 
                    ' (x', SUM(Quantity), ' - ', 
                    FORMAT(SUM(TotalPrice), '#,##0'), N'đ',
                    CASE WHEN Note IS NOT NULL AND Note <> '' THEN CONCAT(N', Note: ', Note) ELSE '' END,
                    ')'
                ) AS FormattedItemDetail
            FROM OrderItems
            GROUP BY 
                OrderId, 
                ItemName,
                Note
        ),
        OrderSummaryItems AS (
            -- Nối tất cả các món trong đơn thành 1 chuỗi hoàn chỉnh
            SELECT 
                OrderId,
                STRING_AGG(FormattedItemDetail, N'; ') AS FullItemDetails
            FROM AggregatedItems
            GROUP BY OrderId
        )
        SELECT 
            O.OrderId AS OrderId,
            O.CreatedAt AS TimeBuy,
            O.DeliveryFee AS ShipFee,
            U.FullName AS CustomerName,
            U.UserName AS Username,
            OSI.FullItemDetails AS OrderItemsDetail, -- Toàn bộ chi tiết từng món nằm ở đây
            O.SubTotal AS TotalItemsPrice,          -- Tổng tiền món ăn của cả đơn
            O.TotalPrice AS FinalOrderPrice,        -- Tiền thanh toán cuối
            ISNULL(AC.Amount, 0) AS CodeSaleDiscount,
            UA.Addresses AS PlaceShip,
            O.OrderStatus AS StatusOrder
        FROM Orders AS O
            JOIN Restaurants AS R 
                ON O.RestaurantId = R.RestaurantId
            JOIN RestaurantManagers AS RM 
                ON RM.RestaurantId = R.RestaurantId
            JOIN Users AS URM 
                ON URM.UserId = RM.UserId
            JOIN Users AS U 
                ON U.UserId = O.UserId
            JOIN UserAddress AS UA 
                ON O.UserAddressId = UA.UserAddressId
            JOIN OrderSummaryItems AS OSI 
                ON OSI.OrderId = O.OrderId
            LEFT JOIN CodeSale AS CS 
                ON CS.CodeSaleId = O.CodeSaleId
            LEFT JOIN AdminCode AS AC 
                ON AC.AdminCodeId = CS.AdminCodeId
        WHERE URM.UserId = @UserId AND (@OrderStatus = '' OR O.OrderStatus = @OrderStatus)
        ORDER BY O.OrderId DESC;
        `
        return DbHelpQueryRepo.excuteQuery(query , [{name : "UserId" , type : sql.Int , value: UserId}, {name : "OrderStatus" , type : sql.NVarChar , value: OrderStatus}])
    }
    async UpdateOrderStatus(OrderId: number, OrderStatus: string) {
        const query = `
            UPDATE Orders
            SET OrderStatus = @OrderStatus
            WHERE OrderId = @OrderId
        `;
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "OrderId", type: sql.Int, value: OrderId },
            { name: "OrderStatus", type: sql.NVarChar, value: OrderStatus }
        ]);
    }
}