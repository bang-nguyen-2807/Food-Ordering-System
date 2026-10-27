import { DbHelpQueryRepo } from "../../../../utils/dbHelpQueryRepo"
import sql from "mssql"

export class ChatbotManagerMenuRepo {
    // 1. TOP 5 món bán chạy hôm nay
    async top5BestSellingToday(UserId: string) {
        const query = `
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @Today DATETIME2 = CAST(CAST(@Now AS DATE) AS DATETIME2);

            SELECT TOP 5
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available,
                ISNULL(SUM(OI.Quantity), 0) AS TotalQuantitySold,
                ISNULL(SUM(OI.Quantity * OI.UnitPrice), 0) AS TotalRevenueGenerated
            FROM MenuItems AS MI
            INNER JOIN CategoriesRestaurant AS CR
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            INNER JOIN RestaurantManagers AS RM
                ON CR.RestaurantId = RM.RestaurantId
            INNER JOIN OrderItems AS OI
                ON MI.MenuItemId = OI.MenuItemId
            INNER JOIN Orders AS O
                ON OI.OrderId = O.OrderId
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            AND O.OrderStatus = 'COMPLETED'
            AND O.CreatedAt >= @Today
            AND O.CreatedAt < DATEADD(DAY, 1, @Today)
            GROUP BY
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available
            ORDER BY TotalQuantitySold DESC;
        `;
        return await DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }

    // 2. TOP 5 món bán chạy trong 7 ngày gần nhất
    async top5BestSelling7Days(UserId: string) {
        const query = `
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @Today DATETIME2 = CAST(CAST(@Now AS DATE) AS DATETIME2);
            DECLARE @WeekStart DATETIME2 = DATEADD(DAY, -6, @Today);

            SELECT TOP 5
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available,
                ISNULL(SUM(OI.Quantity), 0) AS TotalQuantitySold,
                ISNULL(SUM(OI.Quantity * OI.UnitPrice), 0) AS TotalRevenueGenerated
            FROM MenuItems AS MI
            INNER JOIN CategoriesRestaurant AS CR
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            INNER JOIN RestaurantManagers AS RM
                ON CR.RestaurantId = RM.RestaurantId
            INNER JOIN OrderItems AS OI
                ON MI.MenuItemId = OI.MenuItemId
            INNER JOIN Orders AS O
                ON OI.OrderId = O.OrderId
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            AND O.OrderStatus = 'COMPLETED'
            AND O.CreatedAt >= @WeekStart
            AND O.CreatedAt <= @Now
            GROUP BY
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available
            ORDER BY TotalQuantitySold DESC;
        `;
        return await DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }

    // 3. TOP 5 món bán chạy trong tháng này
    async top5BestSellingThisMonth(UserId: string) {
        const query = `
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @MonthStart DATETIME2 = DATEFROMPARTS(YEAR(@Now), MONTH(@Now), 1);

            SELECT TOP 5
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available,
                ISNULL(SUM(OI.Quantity), 0) AS TotalQuantitySold,
                ISNULL(SUM(OI.Quantity * OI.UnitPrice), 0) AS TotalRevenueGenerated
            FROM MenuItems AS MI
            INNER JOIN CategoriesRestaurant AS CR
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            INNER JOIN RestaurantManagers AS RM
                ON CR.RestaurantId = RM.RestaurantId
            INNER JOIN OrderItems AS OI
                ON MI.MenuItemId = OI.MenuItemId
            INNER JOIN Orders AS O
                ON OI.OrderId = O.OrderId
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            AND O.OrderStatus = 'COMPLETED'
            AND O.CreatedAt >= @MonthStart
            AND O.CreatedAt <= @Now
            GROUP BY
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available
            ORDER BY TotalQuantitySold DESC;
        `;
        return await DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }

    // 4. TOP 5 món bán chậm nhất hôm nay
    async top5SlowSellingToday(UserId: string) {
        const query = `
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @Today DATETIME2 = CAST(CAST(@Now AS DATE) AS DATETIME2);

            SELECT TOP 5
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available,
                ISNULL(SUM(CASE
                    WHEN O.OrderId IS NOT NULL THEN OI.Quantity
                    ELSE 0
                END), 0) AS TotalQuantitySold,
                ISNULL(SUM(CASE
                    WHEN O.OrderId IS NOT NULL THEN OI.Quantity * OI.UnitPrice
                    ELSE 0
                END), 0) AS TotalRevenueGenerated
            FROM MenuItems AS MI
            INNER JOIN CategoriesRestaurant AS CR
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            INNER JOIN RestaurantManagers AS RM
                ON CR.RestaurantId = RM.RestaurantId
            LEFT JOIN OrderItems AS OI
                ON MI.MenuItemId = OI.MenuItemId
            LEFT JOIN Orders AS O
                ON OI.OrderId = O.OrderId
                AND O.OrderStatus = 'COMPLETED'
                AND O.CreatedAt >= @Today
                AND O.CreatedAt < DATEADD(DAY, 1, @Today)
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            GROUP BY
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available
            ORDER BY TotalQuantitySold ASC, MI.NameMenuItems ASC;
        `;
        return await DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }

    // 5. TOP 5 món bán chậm nhất trong 7 ngày gần nhất
    async top5SlowSelling7Days(UserId: string) {
        const query = `
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @Today DATETIME2 = CAST(CAST(@Now AS DATE) AS DATETIME2);
            DECLARE @WeekStart DATETIME2 = DATEADD(DAY, -6, @Today);

            SELECT TOP 5
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available,
                ISNULL(SUM(CASE
                    WHEN O.OrderId IS NOT NULL THEN OI.Quantity
                    ELSE 0
                END), 0) AS TotalQuantitySold,
                ISNULL(SUM(CASE
                    WHEN O.OrderId IS NOT NULL THEN OI.Quantity * OI.UnitPrice
                    ELSE 0
                END), 0) AS TotalRevenueGenerated
            FROM MenuItems AS MI
            INNER JOIN CategoriesRestaurant AS CR
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            INNER JOIN RestaurantManagers AS RM
                ON CR.RestaurantId = RM.RestaurantId
            LEFT JOIN OrderItems AS OI
                ON MI.MenuItemId = OI.MenuItemId
            LEFT JOIN Orders AS O
                ON OI.OrderId = O.OrderId
                AND O.OrderStatus = 'COMPLETED'
                AND O.CreatedAt >= @WeekStart
                AND O.CreatedAt <= @Now
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            GROUP BY
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available
            ORDER BY TotalQuantitySold ASC, MI.NameMenuItems ASC;
        `;
        return await DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }

    // 6. TOP 5 món bán chậm nhất trong tháng này
    async top5SlowSellingThisMonth(UserId: string) {
        const query = `
            DECLARE @Now DATETIME2 = SYSUTCDATETIME();
            DECLARE @MonthStart DATETIME2 = DATEFROMPARTS(YEAR(@Now), MONTH(@Now), 1);

            SELECT TOP 5
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available,
                ISNULL(SUM(CASE
                    WHEN O.OrderId IS NOT NULL THEN OI.Quantity
                    ELSE 0
                END), 0) AS TotalQuantitySold,
                ISNULL(SUM(CASE
                    WHEN O.OrderId IS NOT NULL THEN OI.Quantity * OI.UnitPrice
                    ELSE 0
                END), 0) AS TotalRevenueGenerated
            FROM MenuItems AS MI
            INNER JOIN CategoriesRestaurant AS CR
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            INNER JOIN RestaurantManagers AS RM
                ON CR.RestaurantId = RM.RestaurantId
            LEFT JOIN OrderItems AS OI
                ON MI.MenuItemId = OI.MenuItemId
            LEFT JOIN Orders AS O
                ON OI.OrderId = O.OrderId
                AND O.OrderStatus = 'COMPLETED'
                AND O.CreatedAt >= @MonthStart
                AND O.CreatedAt <= @Now
            WHERE RM.UserId = @UserId
            AND RM.IsActive = 1
            GROUP BY
                MI.MenuItemId,
                MI.NameMenuItems,
                MI.Price,
                MI.is_available
            ORDER BY TotalQuantitySold ASC, MI.NameMenuItems ASC;
        `;
        return await DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: parseInt(UserId) }
        ]);
    }
}