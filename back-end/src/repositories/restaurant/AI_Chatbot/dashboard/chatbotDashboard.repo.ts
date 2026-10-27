import sql from "mssql"
import { DbHelpQueryRepo } from "../../../../utils/dbHelpQueryRepo"
export class ChatbotDashboardRepo{
    async revenueDashboardChatbot(UserId : string){
        const query = `    
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @Today DATETIME2 = CAST(CAST(@Now AS DATE) AS DATETIME2);
            DECLARE @WeekStart DATETIME2 = DATEADD(DAY, -6, @Today);
            DECLARE @MonthStart DATETIME2 =
                DATEFROMPARTS(YEAR(@Now), MONTH(@Now), 1);

            SELECT
                -- Tổng số đơn
                COUNT(CASE
                    WHEN O.CreatedAt >= @Today
                    THEN O.OrderId
                END) AS totalOrdersToday,

                COUNT(CASE
                    WHEN O.CreatedAt >= @WeekStart
                    AND O.CreatedAt <= @Now
                    THEN O.OrderId
                END) AS totalOrders7Days,

                COUNT(CASE
                    WHEN O.CreatedAt >= @MonthStart
                    AND O.CreatedAt <= @Now
                    THEN O.OrderId
                END) AS totalOrdersThisMonth,

                -- Doanh thu đơn hoàn thành
                ISNULL(SUM(CASE
                    WHEN O.CreatedAt >= @Today
                    AND O.OrderStatus = 'COMPLETED'
                    THEN O.SubTotal - O.DiscountAmount
                    ELSE 0
                END), 0) AS netRevenueToday,

                ISNULL(SUM(CASE
                    WHEN O.CreatedAt >= @WeekStart
                    AND O.CreatedAt <= @Now
                    AND O.OrderStatus = 'COMPLETED'
                    THEN O.SubTotal - O.DiscountAmount
                    ELSE 0
                END), 0) AS revenue7Days,

                ISNULL(SUM(CASE
                    WHEN O.CreatedAt >= @MonthStart
                    AND O.CreatedAt <= @Now
                    AND O.OrderStatus = 'COMPLETED'
                    THEN O.SubTotal - O.DiscountAmount
                    ELSE 0
                END), 0) AS revenueThisMonth,

                -- Đơn đang chờ hôm nay
                COUNT(CASE
                    WHEN O.CreatedAt >= @Today
                    AND O.OrderStatus = 'PENDING'
                    THEN O.OrderId
                END) AS pendingOrders,

                -- Đơn đang chuẩn bị hôm nay
                COUNT(CASE
                    WHEN O.CreatedAt >= @Today
                    AND O.OrderStatus = 'PREPARING'
                    THEN O.OrderId
                END) AS preparingOrders,

                -- Đơn hoàn thành hôm nay
                COUNT(CASE
                    WHEN O.CreatedAt >= @Today
                    AND O.OrderStatus = 'COMPLETED'
                    THEN O.OrderId
                END) AS completedOrders,

                -- Đơn đã hủy hôm nay
                COUNT(CASE
                    WHEN O.CreatedAt >= @Today
                    AND O.OrderStatus = 'CANCELLED'
                    THEN O.OrderId
                END) AS cancelledOrders

            FROM Orders AS O
            INNER JOIN RestaurantManagers AS RM
                ON O.RestaurantId = RM.RestaurantId
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            AND O.CreatedAt < DATEADD(DAY, 1, CAST(@Now AS DATE));

        `
        return DbHelpQueryRepo.excuteQuery(query, [
            {name: 'UserId', type: sql.Int, value: parseInt(UserId)}
        ])
    }
}