import { Router } from "express";
import { ManagerOrderController } from "../../../controller/admin/managerOrder/managerOrder.controller";

const router = Router()
const managerOrderController = new ManagerOrderController();
router.get("/infoOrder" , managerOrderController.infoOrderController) // thông tin tất cả đơn hàng
router.get("/restaurants" , managerOrderController.getRestaurantsListController) // danh sách nhà hàng
export default router;