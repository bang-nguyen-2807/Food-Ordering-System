import { Router } from "express";
import { DashboardController } from "../../../controller/restaurant/dashboard/dashboard.controller";
const router = Router();
const dashboardController = new DashboardController();

router.get("/total", dashboardController.dashboardController) // /api/restaurant/dashboard/total
router.get("/weeklyRevenue", dashboardController.weeklyRevenueController) // /api/restaurant/dashboard/weeklyRevenue
router.get("/orderJustPlaced" , dashboardController.orderJustPlacedController) // /api/restaurant/dashboard/orderJustPlaced
export default router;