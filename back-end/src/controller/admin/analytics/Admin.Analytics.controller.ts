import { Request, Response } from "express";
import { AdminAnalyticsService } from "../../../services/admin/analytics/Admin.Analytics.service";
import { StatusCodes } from "http-status-codes";

export class AdminAnalyticsController {
  private adminAnalyticsService: AdminAnalyticsService;

  constructor() {
    this.adminAnalyticsService = new AdminAnalyticsService();
  }

  getAnalyticsDataController = async (req: Request, res: Response): Promise<void> => { // controller tiếp nhận yêu cầu lấy thống kê doanh thu
    try {
      const { timeRange, startDate, endDate, restaurantId, paymentMethod } = req.query;

      const filters = {
        timeRange: timeRange ? String(timeRange) : '7days',
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        restaurantId: restaurantId ? Number(restaurantId) : undefined,
        paymentMethod: paymentMethod ? String(paymentMethod) : 'ALL'
      };

      const result = await this.adminAnalyticsService.getFullAnalyticsDataService(filters);
      res.status(result.status).json(result.data ? result.data : { message: result.message });
    } catch (error: any) {
      console.error("Lỗi getAnalyticsDataController:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi hệ thống khi xử lý thống kê doanh thu",
        error: error.message
      });
    }
  };
}
