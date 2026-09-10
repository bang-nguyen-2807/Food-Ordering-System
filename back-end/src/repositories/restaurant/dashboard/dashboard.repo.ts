import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import {Request} from "express"
import sql from "mssql"
export class DashboardRepo{
    async Dashboard(UserId : string){
        let query = `
            SELECT
                -- 1. Tổng số món
                COALESCE(SUM(ISNULL(OI.TotalItems, 0)), 0) AS TotalItems,

                -- 2. Tổng số đơn
                COUNT(*) AS TotalOrders,

                -- 3. Tổng doanh thu
                COALESCE(
                    SUM(
                        CASE
                            WHEN O.OrderStatus = 'COMPLETED'
                            THEN O.SubTotal
                            ELSE 0
                        END
                    ),
                    0
                ) AS TotalMoney,

                -- 4. Đơn đang xử lý
                SUM(
                    CASE
                        WHEN O.OrderStatus IN (
                            'CONFIRMED',
                            'PREPARING',
                            'READY_FOR_PICKUP',
                            'DELIVERING'
                        )
                        THEN 1
                        ELSE 0
                    END
                ) AS ProcessingOrders,

                -- 5. Đơn hoàn thành
                SUM(
                    CASE
                        WHEN O.OrderStatus = 'COMPLETED'
                        THEN 1
                        ELSE 0
                    END
                ) AS CompletedOrders,

                -- 6. Đơn đã hủy
                SUM(
                    CASE
                        WHEN O.OrderStatus = 'CANCELLED'
                        THEN 1
                        ELSE 0
                    END
                ) AS CancelledOrders,

                -- 7. Đơn đang chờ
                SUM(
                    CASE
                        WHEN O.OrderStatus = 'PENDING'
                        THEN 1
                        ELSE 0
                    END
                ) AS PendingOrders

            FROM RestaurantManagers AS RM

            JOIN Restaurants AS R
                ON R.RestaurantId = RM.RestaurantId

            JOIN Orders AS O
                ON O.RestaurantId = R.RestaurantId

            LEFT JOIN (
                SELECT
                    OrderId,
                    SUM(Quantity) AS TotalItems
                FROM OrderItems
                GROUP BY OrderId
            ) AS OI
                ON OI.OrderId = O.OrderId

            WHERE RM.UserId = @UserId

                -- Chỉ lấy đơn trong ngày hôm nay
                AND O.CreatedAt >= CAST(GETDATE() AS DATE)
                AND O.CreatedAt < DATEADD(DAY, 1, CAST(GETDATE() AS DATE));
        `
        return DbHelpQueryRepo.excuteQuery(query , [{name : "UserId" , type : sql.Int , value : UserId}]);
    }
    async weeklyRevenue(UserId : string){
        let query = `
        DECLARE @Today DATE = CAST(GETDATE() AS DATE);

            -- Tìm thứ 2 của tuần hiện tại
            DECLARE @Monday DATE =
                DATEADD(
                    DAY,
                    -(DATEDIFF(DAY, '19000101', @Today) % 7),
                    @Today
                );

            ;WITH WeekDays AS
            (
                SELECT
                    0 AS DayIndex,
                    @Monday AS SaleDate

                UNION ALL

                SELECT
                    DayIndex + 1,
                    DATEADD(DAY, 1, SaleDate)
                FROM WeekDays
                WHERE DayIndex < 6
            ),
            Revenue AS
            (
                SELECT
                    CAST(O.CreatedAt AS DATE) AS SaleDate,
                    SUM(O.TotalPrice) AS Revenue
                FROM RestaurantManagers RM
                JOIN Orders O
                    ON O.RestaurantId = RM.RestaurantId
                WHERE RM.UserId = @UserId
                AND O.OrderStatus = 'COMPLETED'
                AND O.CreatedAt >= @Monday
                AND O.CreatedAt < DATEADD(DAY, 7, @Monday)
                GROUP BY CAST(O.CreatedAt AS DATE)
            )
            SELECT
                W.DayIndex,
                W.SaleDate,
                CASE W.DayIndex
                    WHEN 0 THEN N'Thứ 2'
                    WHEN 1 THEN N'Thứ 3'
                    WHEN 2 THEN N'Thứ 4'
                    WHEN 3 THEN N'Thứ 5'
                    WHEN 4 THEN N'Thứ 6'
                    WHEN 5 THEN N'Thứ 7'
                    WHEN 6 THEN N'Chủ Nhật'
                END AS DayName,
                COALESCE(R.Revenue, 0) AS Revenue
            FROM WeekDays W
            LEFT JOIN Revenue R
                ON R.SaleDate = W.SaleDate
            ORDER BY W.DayIndex
            OPTION (MAXRECURSION 6);
        `
        return DbHelpQueryRepo.excuteQuery(query , [{name : "UserId" , type : sql.Int , value : UserId}])
    }
    async orderJustPlaced(UserId : string){ // đơn hàng vừa đặt
        let query = `
            WITH AggregatedItems AS (
                -- Tính tổng số lượng của từng món ăn trong từng đơn hàng
                SELECT 
                    OrderId,
                    CONCAT(ItemName, ' (x', SUM(Quantity) , ')') AS FormattedItem
                FROM OrderItems
                GROUP BY 
                    OrderId, 
                    ItemName
            )
            SELECT TOP 5
                O.OrderId AS OrderId,
                U.FullName AS customerName,
                U.UserName AS accountName,
                STRING_AGG(AI.FormattedItem, ', ') AS ItemNames,
                O.SubTotal AS sumSubItems,
                O.CreatedAt AS timeCreateItems,
                O.OrderStatus AS statusOrder
            FROM Orders AS O
                JOIN Users AS U
                    ON O.UserId = U.UserId
                JOIN Restaurants AS R
                    ON O.RestaurantId = R.RestaurantId
                JOIN RestaurantManagers AS RM
                    ON RM.RestaurantId = R.RestaurantId
                JOIN Users AS URM -- OWN RESTAURANT
                    ON URM.UserId = RM.UserId
                JOIN AggregatedItems AS AI
                    ON AI.OrderId = O.OrderId
                WHERE URM.UserId = @UserId
            GROUP BY 
                O.OrderId ,
                U.FullName,
                U.UserName,
                O.SubTotal,
                O.OrderStatus,
                O.CreatedAt
            ORDER BY O.OrderId DESC
        `
        return DbHelpQueryRepo.excuteQuery(query , [{name : "UserId" , type : sql.Int , value : UserId}])
    }
    async updateRestaurantLocation(req: Request) {
        let query = `
            EXEC UpdateRestaurantLocation @UserId = @UserId, @Latitude = @latitude, @Longitude = @longitude;
        `
        const UserId = req.body.UserId as string;
        const longitude = req.body.longitude as string;
        const latitude = req.body.latitude as string;
        return DbHelpQueryRepo.excuteNonQuery(
            query, [
            { name: "UserId", type: sql.Int, value: UserId },
            { name: "latitude", type: sql.Decimal(10, 7), value: latitude },
            { name: "longitude", type: sql.Decimal(10, 7), value: longitude }
        ]
        )
    }
}