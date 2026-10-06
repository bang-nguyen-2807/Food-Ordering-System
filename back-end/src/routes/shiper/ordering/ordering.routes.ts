import { Router } from "express";
import { OrderingController } from "../../../controller/shiper/ordering/ordering.controller";

const router = Router();
const orderingController = new OrderingController();
router.get("/statusOrder", orderingController.StatusOrder) ; // /shipper/ordering/statusOrder?UserId=1&OrderId=1
router.put("/updateNextStatusOrder", orderingController.UpdateNextStatusOrder) ; // /shipper/ordering/updateNextStatusOrder?UserId=1&OrderId=1
router.get("/infoRoute", orderingController.infoRoute) ; // /shipper/ordering/infoRoute?UserId=1&OrderId=1
router.get("/getLocationRestaurant", orderingController.getLocationRestaurant) ; // /shipper/ordering/getLocationRestaurant?OrderId=1
router.get("/getOrderStatus" , orderingController.getStatusOrder) ; // /shipper/ordering/getOrderStatus?OrderId=1&UserId=1
export default router;