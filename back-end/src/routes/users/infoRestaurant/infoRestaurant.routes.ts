import { Router } from "express";
import { InfoRestaurantController } from "../../../controller/users/infoRestaurant/infoRestaurant.controller";
const router = Router();
const infoRestaurantController = new InfoRestaurantController();

router.get("/getInfoRestaurant/:RestaurantId",infoRestaurantController.getInfoRestaurant); // /user/infoRestaurant/getInfoRestaurant/:RestaurantId?CatagoriesRestaurantId=1
router.get("/getListCategoriesRestaurant" , infoRestaurantController.getListCategoriesRestaurant); // /user/infoRestaurant/getListCategoriesRestaurant?RestaurantId=1
export default router;
