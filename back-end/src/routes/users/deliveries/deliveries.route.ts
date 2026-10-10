import { Router } from "express";
import { DeliveriesController } from "../../../controller/users/deliveries/deliveries.controller";

const router = Router();
const deliveriesController = new DeliveriesController();
router.get("/getLocationShipperDeliveries" , deliveriesController.getLocationShipperDeliveries); // /api/user/deliveries/getLocationShipperDeliveries?OrderId=1&UserId=1
router.get("/getAddressUserPlaceOrder" , deliveriesController.getAddressUserPlaceOrder); // /api/user/deliveries/getAddressUserPlaceOrder?OrderId=1&UserId=1
router.get("/getStatusDeliveries" , deliveriesController.getStatusDeliveries); // /api/user/deliveries/getStatusDeliveries?OrderId=1&UserId=1
export default router;