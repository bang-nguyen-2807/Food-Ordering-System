import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class ManagerOrderRepo {
    async infoOrder(Status?: string, RestaurantId?: number){
        const query = `
            SELECT 
    O.OrderId,
    O.CreatedAt AS OrderDate,
    O.CompletedAt,
    
    -- Thông tin khách hàng
    Cust.FullName AS CustomerName,
    Cust.NumberPhone AS CustomerPhone,
    
    -- Thông tin Shipper giao đơn
    ISNULL(ShipUser.FullName, N'Chưa có tài xế') AS ShipperName,
    ISNULL(ShipUser.NumberPhone, N'N/A') AS ShipperPhone,
    
    -- Thông tin quán & món
    R.RestaurantId,
    R.RestaurantName,
    ISNULL(STRING_AGG(CONCAT(OI.ItemName, ' (x', OI.Quantity, ')'), ', '), N'Không có thông tin món') AS ItemsSummary,
    
    -- Chi phí & Trạng thái
    O.SubTotal,
    O.DiscountAmount,
    O.DeliveryFee,
    O.TotalPrice AS OrderTotal,
    O.OrderStatus
FROM Orders AS O
    -- 1. Lấy chi tiết món
    LEFT JOIN OrderItems AS OI ON O.OrderId = OI.OrderId
    
    -- 2. Lấy thông tin khách hàng đặt đơn
    LEFT JOIN Users AS Cust ON O.UserId = Cust.UserId
    
    -- 3. Lấy thông tin nhà hàng
    LEFT JOIN Restaurants AS R ON O.RestaurantId = R.RestaurantId
    
    -- 4. Lấy thông tin chuyến giao hàng & Shipper
    LEFT JOIN Deliveries AS D ON O.OrderId = D.OrderId
    LEFT JOIN Shipper AS SH ON D.ShipperId = SH.ShipperId
    LEFT JOIN Users AS ShipUser ON SH.UserId = ShipUser.UserId

WHERE (@Status IS NULL OR @Status = '' OR UPPER(@Status) = 'ALL' OR UPPER(O.OrderStatus) = UPPER(@Status))
  AND (@RestaurantId IS NULL OR @RestaurantId = 0 OR R.RestaurantId = @RestaurantId)
GROUP BY 
    O.OrderId, 
    O.CreatedAt, 
    O.CompletedAt,
    Cust.FullName, 
    Cust.NumberPhone, 
    ShipUser.FullName,
    ShipUser.NumberPhone,
    R.RestaurantId,
    R.RestaurantName, 
    O.SubTotal,
    O.DiscountAmount,
    O.DeliveryFee, 
    O.TotalPrice, 
    O.OrderStatus
ORDER BY O.OrderId DESC;
        `
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "Status", type: sql.VarChar, value: Status ?? null },
            { name: "RestaurantId", type: sql.Int, value: RestaurantId ? Number(RestaurantId) : 0 }
        ]);
    }

    async getRestaurantsList() {
        const query = `SELECT RestaurantId, RestaurantName FROM Restaurants ORDER BY RestaurantName ASC;`;
        return DbHelpQueryRepo.excuteQuery<{ RestaurantId: number; RestaurantName: string }>(query, []);
    }
}