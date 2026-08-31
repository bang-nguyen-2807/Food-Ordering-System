import { connnectDB } from "../../../config/database";
export class AdminDashboardRepo {
  async totalNumber() { // tổng 
    const pool = await connnectDB();
    let totalQuery = `
            SELECT
                (SELECT count(UserId) as N'totalUsers' FROM Users ) as usersTotals ,
                (SELECT COUNT(RestaurantId) as N'totalRestaurant' FROM Restaurants) as restaurantTotals,
                (SELECT COUNT(ShipperId) as N'totalShipper' FROM Shipper) as shipperTotals,
                (
                    SELECT COUNT(OrderStatus) AS N'totalOrderStatusProcessing' FROM Orders 
                    WHERE OrderStatus != 'COMPLETED'
                ) as orderTotal,
                (
                SELECT 
                        ISNULL(SUM(TotalPrice), 0) AS TotalRevenue
                    FROM Orders
                    WHERE OrderStatus = 'COMPLETED'
                    AND CreatedAt >= CAST(GETDATE() AS DATE)
                    AND CreatedAt < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))

                ) AS revenue
        `;
    const result = await pool.request().query(totalQuery)
    return result.recordset
  }
  async OrderCompletd() { // đơn hàng đã thành công trong ngày
    const pool = await connnectDB();
    const Query = `
        SELECT 
            O.OrderId,
            O.CreatedAt AS OrderDate,
            O.CompletedAt,
            U.FullName AS CustomerName,
            U.FullName,
            U.NumberPhone AS CustomerPhone,
            R.RestaurantName,
            ISNULL(STRING_AGG(CONCAT(OI.ItemName, ' (x', OI.Quantity, ')'), ', '), N'Không có thông tin món') AS ItemsSummary,
            O.SubTotal,
            O.DiscountAmount,
            O.DeliveryFee,
            O.TotalPrice AS OrderTotal,
            O.TotalPrice,
            O.OrderStatus
        FROM Orders AS O
            LEFT JOIN OrderItems AS OI ON O.OrderId = OI.OrderId
            LEFT JOIN Users AS U ON O.UserId = U.UserId
            LEFT JOIN Restaurants AS R ON O.RestaurantId = R.RestaurantId
        WHERE UPPER(O.OrderStatus) = 'COMPLETED'
          AND CAST(O.CreatedAt AS DATE) = CAST(GETDATE() AS DATE)
        GROUP BY 
            O.OrderId, 
            O.CreatedAt, 
            O.CompletedAt,
            U.FullName, 
            U.NumberPhone, 
            R.RestaurantName, 
            O.SubTotal,
            O.DiscountAmount,
            O.DeliveryFee, 
            O.TotalPrice, 
            O.OrderStatus
        ORDER BY O.OrderId DESC;
    `
    const result = await pool.request().query(Query)
    return result.recordset
  }
  async OrderConfirmed() { // đơn hàng xác nhận trong ngày
    const pool = await connnectDB();
    const query = `
    SELECT 
            O.OrderId,
            O.CreatedAt AS OrderDate,
            O.CompletedAt,
            U.FullName AS CustomerName,
            U.FullName,
            U.NumberPhone AS CustomerPhone,
            R.RestaurantName,
            ISNULL(STRING_AGG(CONCAT(OI.ItemName, ' (x', OI.Quantity, ')'), ', '), N'Không có thông tin món') AS ItemsSummary,
            O.SubTotal,
            O.DiscountAmount,
            O.DeliveryFee,
            O.TotalPrice AS OrderTotal,
            O.TotalPrice,
            O.OrderStatus
        FROM Orders AS O
            LEFT JOIN OrderItems AS OI ON O.OrderId = OI.OrderId
            LEFT JOIN Users AS U ON O.UserId = U.UserId
            LEFT JOIN Restaurants AS R ON O.RestaurantId = R.RestaurantId
        WHERE UPPER(O.OrderStatus) = 'CONFIRMED'
          AND CAST(O.CreatedAt AS DATE) = CAST(GETDATE() AS DATE)
        GROUP BY 
            O.OrderId, 
            O.CreatedAt, 
            O.CompletedAt,
            U.FullName, 
            U.NumberPhone, 
            R.RestaurantName, 
            O.SubTotal,
            O.DiscountAmount,
            O.DeliveryFee, 
            O.TotalPrice, 
            O.OrderStatus
        ORDER BY O.OrderId DESC;
    `
    const result = await pool.request().query(query)
    return result.recordset
  }
}

