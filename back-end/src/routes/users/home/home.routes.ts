import { Router } from "express";
import { HomeController } from "../../../controller/users/home/home.controller";

const router = Router();
const homeController = new HomeController();
router.get("/getListRestaurant", homeController.getListRestaurant); // /api/user/home/getListRestaurant
router.get("/getListCatagories", homeController.getListCatagories); // /api/user/home/getListCatagories
export default router;
