import { DbHelpQueryRepo, SqlParam } from "../../../utils/dbHelpQueryRepo";
import sql from "mssql";

export interface AnalyticsFilterParams {
  timeRange?: string; // 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'last_month' | 'custom'
  startDate?: string;
  endDate?: string;
  restaurantId?: number;
  paymentMethod?: string;
}

export class AdminAnalyticsRepo {
  // hàm hỗ trợ sinh điều kiện lọc ngày SQL và danh sách params
  private buildDateConditions(params: AnalyticsFilterParams, tablePrefix: string = 'O') {
    const timeRange = params.timeRange || '7days';
    const sqlParams: SqlParam[] = [];
    let dateWhereClause = '';
    let prevDateWhereClause = '';

    if (timeRange === 'today') {
      dateWhereClause = `${tablePrefix}.CreatedAt >= CAST(GETDATE() AS DATE) AND ${tablePrefix}.CreatedAt < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))`;
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AND ${tablePrefix}.CreatedAt < CAST(GETDATE() AS DATE)`;
    } else if (timeRange === 'yesterday') {
      dateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AND ${tablePrefix}.CreatedAt < CAST(GETDATE() AS DATE)`;
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AND ${tablePrefix}.CreatedAt < DATEADD(DAY, -1, CAST(GETDATE() AS DATE))`;
    } else if (timeRange === '30days') {
      dateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -30, CAST(GETDATE() AS DATE))`;
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -60, CAST(GETDATE() AS DATE)) AND ${tablePrefix}.CreatedAt < DATEADD(DAY, -30, CAST(GETDATE() AS DATE))`;
    } else if (timeRange === 'this_month') {
      dateWhereClause = `${tablePrefix}.CreatedAt >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)`;
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(MONTH, -1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND ${tablePrefix}.CreatedAt < DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)`;
    } else if (timeRange === 'last_month') {
      dateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(MONTH, -1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND ${tablePrefix}.CreatedAt < DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)`;
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(MONTH, -2, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND ${tablePrefix}.CreatedAt < DATEADD(MONTH, -1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))`;
    } else if (timeRange === 'custom' && params.startDate && params.endDate) {
      dateWhereClause = `${tablePrefix}.CreatedAt >= @startDate AND ${tablePrefix}.CreatedAt <= @endDate`;
      sqlParams.push({ name: 'startDate', type: sql.VarChar(50), value: params.startDate });
      sqlParams.push({ name: 'endDate', type: sql.VarChar(50), value: params.endDate });
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -DATEDIFF(DAY, @startDate, @endDate), @startDate) AND ${tablePrefix}.CreatedAt < @startDate`;
    } else {
      // mặc định 7days
      dateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -7, CAST(GETDATE() AS DATE))`;
      prevDateWhereClause = `${tablePrefix}.CreatedAt >= DATEADD(DAY, -14, CAST(GETDATE() AS DATE)) AND ${tablePrefix}.CreatedAt < DATEADD(DAY, -7, CAST(GETDATE() AS DATE))`;
    }

    if (params.restaurantId && Number(params.restaurantId) > 0) {
      dateWhereClause += ` AND ${tablePrefix}.RestaurantId = @restaurantId`;
      sqlParams.push({ name: 'restaurantId', type: sql.Int, value: Number(params.restaurantId) });
    }

    return { dateWhereClause, prevDateWhereClause, sqlParams };
  }

  async getAnalyticsOverview(filters: AnalyticsFilterParams) { // lấy chỉ số KPI tổng quan & tỷ lệ tăng trưởng
    const { dateWhereClause, prevDateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    let paymentJoin = '';
    let extraPaymentWhere = '';

    if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
      paymentJoin = ` LEFT JOIN BILL AS B ON O.OrderId = B.OrderId `;
      extraPaymentWhere = ` AND B.PaymentMethod = @paymentMethod `;
      sqlParams.push({ name: 'paymentMethod', type: sql.NVarChar(50), value: filters.paymentMethod });
    }

    const query = `
      SELECT
        -- Doanh thu thực nhận kỳ hiện tại (Net Revenue)
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.TotalPrice ELSE 0 END), 0) AS CurrentNetRevenue,
        -- Doanh thu gộp kỳ hiện tại (Gross Revenue)
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.SubTotal ELSE 0 END), 0) AS CurrentGrossRevenue,
        -- Số đơn thành công
        COUNT(CASE WHEN O.OrderStatus = 'COMPLETED' THEN 1 END) AS CompletedOrdersCount,
        -- Số đơn bị hủy
        COUNT(CASE WHEN O.OrderStatus = 'CANCELLED' THEN 1 END) AS CancelledOrdersCount,
        -- Tổng số đơn phát sinh
        COUNT(O.OrderId) AS TotalOrdersCount,
        -- Giá trị trung bình đơn hàng (AOV)
        CASE 
          WHEN COUNT(CASE WHEN O.OrderStatus = 'COMPLETED' THEN 1 END) > 0 
          THEN ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.TotalPrice ELSE 0 END), 0) / COUNT(CASE WHEN O.OrderStatus = 'COMPLETED' THEN 1 END)
          ELSE 0 
        END AS AverageOrderValue
      FROM Orders AS O
      ${paymentJoin}
      WHERE ${dateWhereClause} ${extraPaymentWhere};

      -- Truy vấn kỳ trước để tính % tăng trưởng
      SELECT 
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.TotalPrice ELSE 0 END), 0) AS PreviousNetRevenue,
        COUNT(CASE WHEN O.OrderStatus = 'COMPLETED' THEN 1 END) AS PreviousCompletedOrders
      FROM Orders AS O
      ${paymentJoin}
      WHERE ${prevDateWhereClause} ${extraPaymentWhere};
    `;

    const pool = await (await import("../../../config/database")).connnectDB();
    const request = pool.request();
    sqlParams.forEach(p => request.input(p.name, p.type, p.value));
    const result = await request.query(query);

    const recordsets = result.recordsets as any[];
    const currentStats = (recordsets[0] && recordsets[0][0]) || {};
    const prevStats = (recordsets[1] && recordsets[1][0]) || {};

    const currRev = Number(currentStats.CurrentNetRevenue || 0);
    const prevRev = Number(prevStats.PreviousNetRevenue || 0);
    let growthRate = 0;
    if (prevRev > 0) {
      growthRate = Number((((currRev - prevRev) / prevRev) * 100).toFixed(2));
    } else if (currRev > 0) {
      growthRate = 100;
    }

    return {
      netRevenue: currRev,
      grossRevenue: Number(currentStats.CurrentGrossRevenue || 0),
      completedOrders: Number(currentStats.CompletedOrdersCount || 0),
      cancelledOrders: Number(currentStats.CancelledOrdersCount || 0),
      totalOrders: Number(currentStats.TotalOrdersCount || 0),
      averageOrderValue: Number(currentStats.AverageOrderValue || 0),
      previousNetRevenue: prevRev,
      growthRate: growthRate
    };
  }

  async getRevenueTimeline(filters: AnalyticsFilterParams) { // lấy biến động doanh thu theo chuỗi thời gian
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');
    const isHourly = filters.timeRange === 'today' || filters.timeRange === 'yesterday';

    let paymentJoin = '';
    let extraPaymentWhere = '';

    if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
      paymentJoin = ` LEFT JOIN BILL AS B ON O.OrderId = B.OrderId `;
      extraPaymentWhere = ` AND B.PaymentMethod = @paymentMethod `;
      sqlParams.push({ name: 'paymentMethod', type: sql.NVarChar(50), value: filters.paymentMethod });
    }

    let selectTimeLabel = `FORMAT(O.CreatedAt, 'yyyy-MM-dd')`;
    let groupByClause = `FORMAT(O.CreatedAt, 'yyyy-MM-dd')`;

    if (isHourly) {
      selectTimeLabel = `CONCAT(FORMAT(DATEPART(HOUR, O.CreatedAt), '00'), ':00')`;
      groupByClause = `CONCAT(FORMAT(DATEPART(HOUR, O.CreatedAt), '00'), ':00')`;
    }

    const query = `
      SELECT 
        ${selectTimeLabel} AS TimeLabel,
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.TotalPrice ELSE 0 END), 0) AS Revenue,
        COUNT(CASE WHEN O.OrderStatus = 'COMPLETED' THEN 1 END) AS CompletedCount,
        COUNT(CASE WHEN O.OrderStatus = 'CANCELLED' THEN 1 END) AS CancelledCount
      FROM Orders AS O
      ${paymentJoin}
      WHERE ${dateWhereClause} ${extraPaymentWhere}
      GROUP BY ${groupByClause}
      ORDER BY TimeLabel ASC;
    `;

    return DbHelpQueryRepo.excuteQuery(query, sqlParams);
  }

  async getPaymentDistribution(filters: AnalyticsFilterParams) { // lấy tỷ trọng doanh thu theo phương thức thanh toán
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    const query = `
      SELECT 
        ISNULL(B.PaymentMethod, 'CASH') AS PaymentMethod,
        ISNULL(SUM(O.TotalPrice), 0) AS TotalRevenue,
        COUNT(O.OrderId) AS TotalOrders
      FROM Orders AS O
      LEFT JOIN BILL AS B ON O.OrderId = B.OrderId
      WHERE O.OrderStatus = 'COMPLETED' AND ${dateWhereClause}
      GROUP BY ISNULL(B.PaymentMethod, 'CASH')
      ORDER BY TotalRevenue DESC;
    `;

    return DbHelpQueryRepo.excuteQuery(query, sqlParams);
  }

  async getCategoryDistribution(filters: AnalyticsFilterParams) { // lấy tỷ trọng doanh thu theo danh mục món ăn
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    const query = `
      SELECT 
        ISNULL(CR.CategoriesRestaurantName, N'Khác') AS CategoryName,
        ISNULL(SUM(OI.Quantity * OI.UnitPrice), 0) AS TotalRevenue,
        ISNULL(SUM(OI.Quantity), 0) AS TotalQuantity
      FROM Orders AS O
      INNER JOIN OrderItems AS OI ON O.OrderId = OI.OrderId
      INNER JOIN MenuItems AS MI ON OI.MenuItemId = MI.MenuItemId
      LEFT JOIN CategoriesRestaurant AS CR ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
      WHERE O.OrderStatus = 'COMPLETED' AND ${dateWhereClause}
      GROUP BY CR.CategoriesRestaurantName
      ORDER BY TotalRevenue DESC;
    `;

    return DbHelpQueryRepo.excuteQuery(query, sqlParams);
  }

  async getTopProducts(filters: AnalyticsFilterParams) { // lấy top món đóng góp doanh thu cao nhất
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    const query = `
      SELECT TOP 10
        MI.MenuItemId,
        OI.ItemName,
        MI.ImageUrl,
        ISNULL(CR.CategoriesRestaurantName, N'Khác') AS CategoryName,
        ISNULL(SUM(OI.Quantity), 0) AS QuantitySold,
        ISNULL(SUM(OI.Quantity * OI.UnitPrice), 0) AS TotalRevenue
      FROM Orders AS O
      INNER JOIN OrderItems AS OI ON O.OrderId = OI.OrderId
      INNER JOIN MenuItems AS MI ON OI.MenuItemId = MI.MenuItemId
      LEFT JOIN CategoriesRestaurant AS CR ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
      WHERE O.OrderStatus = 'COMPLETED' AND ${dateWhereClause}
      GROUP BY MI.MenuItemId, OI.ItemName, MI.ImageUrl, CR.CategoriesRestaurantName
      ORDER BY TotalRevenue DESC;
    `;

    return DbHelpQueryRepo.excuteQuery(query, sqlParams);
  }

  async getPeakHours(filters: AnalyticsFilterParams) { // thống kê doanh thu và đơn hàng theo 24 khung giờ
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    const query = `
      SELECT 
        DATEPART(HOUR, O.CreatedAt) AS HourSlot,
        CONCAT(FORMAT(DATEPART(HOUR, O.CreatedAt), '00'), 'h - ', FORMAT(DATEPART(HOUR, O.CreatedAt) + 1, '00'), 'h') AS HourSlotText,
        COUNT(O.OrderId) AS OrderCount,
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.TotalPrice ELSE 0 END), 0) AS Revenue
      FROM Orders AS O
      WHERE ${dateWhereClause}
      GROUP BY DATEPART(HOUR, O.CreatedAt)
      ORDER BY HourSlot ASC;
    `;

    return DbHelpQueryRepo.excuteQuery(query, sqlParams);
  }

  async getDiscountAndLoss(filters: AnalyticsFilterParams) { // lấy chi phí khuyến mãi và thất thoát đơn bị hủy
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    const query = `
      SELECT 
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'COMPLETED' THEN O.DiscountAmount ELSE 0 END), 0) AS TotalDiscountSpent,
        COUNT(CASE WHEN O.OrderStatus = 'COMPLETED' AND O.DiscountAmount > 0 THEN 1 END) AS OrdersUsedVoucher,
        ISNULL(SUM(CASE WHEN O.OrderStatus = 'CANCELLED' THEN O.TotalPrice ELSE 0 END), 0) AS TotalLossCancelled,
        COUNT(CASE WHEN O.OrderStatus = 'CANCELLED' THEN 1 END) AS CancelledOrdersCount
      FROM Orders AS O
      WHERE ${dateWhereClause};
    `;

    const result = await DbHelpQueryRepo.excuteQuery<any>(query, sqlParams);
    return result[0] || {
      TotalDiscountSpent: 0,
      OrdersUsedVoucher: 0,
      TotalLossCancelled: 0,
      CancelledOrdersCount: 0
    };
  }

  async getFilteredOrders(filters: AnalyticsFilterParams) { // lấy danh sách bảng kê đơn hàng theo bộ lọc
    const { dateWhereClause, sqlParams } = this.buildDateConditions(filters, 'O');

    let paymentJoin = ' LEFT JOIN BILL AS B ON O.OrderId = B.OrderId ';
    let extraPaymentWhere = '';

    if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
      extraPaymentWhere = ` AND B.PaymentMethod = @paymentMethod `;
      sqlParams.push({ name: 'paymentMethod', type: sql.NVarChar(50), value: filters.paymentMethod });
    }

    const query = `
      SELECT TOP 50
        O.OrderId,
        O.CreatedAt,
        O.CompletedAt,
        U.FullName AS CustomerName,
        U.NumberPhone AS CustomerPhone,
        R.RestaurantName,
        ISNULL(B.PaymentMethod, 'CASH') AS PaymentMethod,
        O.SubTotal,
        O.DiscountAmount,
        O.DeliveryFee,
        O.TotalPrice,
        O.OrderStatus
      FROM Orders AS O
      LEFT JOIN Users AS U ON O.UserId = U.UserId
      LEFT JOIN Restaurants AS R ON O.RestaurantId = R.RestaurantId
      ${paymentJoin}
      WHERE ${dateWhereClause} ${extraPaymentWhere}
      ORDER BY O.OrderId DESC;
    `;

    return DbHelpQueryRepo.excuteQuery(query, sqlParams);
  }

  async getRestaurantsList() { // lấy danh sách tất cả nhà hàng cho dropdown lọc
    const query = `
      SELECT RestaurantId, RestaurantName, Addresses 
      FROM Restaurants
      ORDER BY RestaurantName ASC;
    `;
    return DbHelpQueryRepo.excuteQuery(query, []);
  }
}
