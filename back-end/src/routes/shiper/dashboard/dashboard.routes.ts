import { Router } from "express";
import { DashboardController } from "../../../controller/shiper/dashboard/dashboard.controller";

const router = Router();
const controller = new DashboardController();
router.get("/totalOrder", controller.totalOrder);// /api/shipper/dashboard/totalOrder?UserId=
router.put("/updateShipperLocation", controller.updateShipperLocation);// /api/shipper/dashboard/updateShipperLocation?UserId=&&longitude=&&latitude=
router.get("/getAvailableDeliveries", controller.getAvailableDeliveries);// /api/shipper/dashboard/getAvailableDeliveries?UserId=&&radiusMeter=
export default router