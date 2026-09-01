import { Router } from "express";
import { AdminAnalyticsController } from "../../../controller/admin/analytics/Admin.Analytics.controller";

const router = Router();
const adminAnalyticsController = new AdminAnalyticsController();

router.get("/data", adminAnalyticsController.getAnalyticsDataController); // route lấy dữ liệu thống kê doanh thu /api/admin/analytics/data

export default router;
