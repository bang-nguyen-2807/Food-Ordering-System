import { Router } from "express";
import { NavbarController } from "../../../controller/shiper/navbar/navbar.controller";

const router = Router();
const controller = new NavbarController();

router.get("/getActiveDeliveryOrder", controller.getActiveDeliveryOrder);

export default router;
