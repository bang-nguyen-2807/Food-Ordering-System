import { AdminAnalyticsRepo, AnalyticsFilterParams } from "../../../repositories/admin/analytics/Admin.Analytics.repo";
import { StatusCodes } from "http-status-codes";

export class AdminAnalyticsService {
  private adminAnalyticsRepo: AdminAnalyticsRepo;

  constructor() {
    this.adminAnalyticsRepo = new AdminAnalyticsRepo();
  }

  async getFullAnalyticsDataService(filters: AnalyticsFilterParams) { // dịch vụ tổng hợp toàn bộ dữ liệu thống kê doanh thu
    try {
      const overview = await this.adminAnalyticsRepo.getAnalyticsOverview(filters);
      const timeline = await this.adminAnalyticsRepo.getRevenueTimeline(filters);
      const paymentDistribution = await this.adminAnalyticsRepo.getPaymentDistribution(filters);
      const categoryDistribution = await this.adminAnalyticsRepo.getCategoryDistribution(filters);
      const topProducts = await this.adminAnalyticsRepo.getTopProducts(filters);
      const peakHours = await this.adminAnalyticsRepo.getPeakHours(filters);
      const discountAndLoss = await this.adminAnalyticsRepo.getDiscountAndLoss(filters);
      const filteredOrders = await this.adminAnalyticsRepo.getFilteredOrders(filters);
      const restaurants = await this.adminAnalyticsRepo.getRestaurantsList();

      return {
        status: StatusCodes.OK,
        data: {
          overview,
          timeline,
          paymentDistribution,
          categoryDistribution,
          topProducts,
          peakHours,
          discountAndLoss,
          orders: filteredOrders,
          restaurants
        }
      };
    } catch (error: any) {
      console.error("Lỗi getFullAnalyticsDataService:", error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Xảy ra lỗi khi truy xuất dữ liệu thống kê doanh thu",
        error: error.message
      };
    }
  }
}
