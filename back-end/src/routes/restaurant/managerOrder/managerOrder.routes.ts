import { Router } from "express";
import { ManagerOrderController } from "../../../controller/restaurant/managerOrder/managerOrder.controller";

const router = Router();
const managerOrderController = new ManagerOrderController();
router.get('/order' , managerOrderController.ManagerOrderController); // /api/restaurant/managerOrder/order
router.put('/updateStatus', managerOrderController.UpdateOrderStatusController);
export default router
