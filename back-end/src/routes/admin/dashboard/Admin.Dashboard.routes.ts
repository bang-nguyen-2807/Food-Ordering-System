import { AdminDashboardController } from './../../../controller/admin/dashboard/Admin.Dashboard.controller';
import { Router } from "express";

const router = Router()
const adminDashboardController = new AdminDashboardController();
router.get("/total" , adminDashboardController.totalNumberController) // tổng số lượng user , restaurant , shipper , orderStatus , totalRevenue
router.get("/order/complete" , adminDashboardController.OrderCompletdController) // đơn hàng thành công // /api/admin/dashboard/order/complete
router.get("/order/confirmed" , adminDashboardController.OrderConfirmedController) // đơn hàng chờ xác nhận // /api/admin/dashboard/order/confirmed
export default router