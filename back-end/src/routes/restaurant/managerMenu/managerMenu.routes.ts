import { Router } from "express";
import { ManagerMenuController } from "../../../controller/restaurant/managerMenu/managerMenu.controller";

const router = Router();
const managerMenuController = new ManagerMenuController();

router.get("/menu", (req, res) => managerMenuController.getManagerMenuController(req, res)); // /restaurant/managerMenu/menu
router.get("/categories", (req, res) => managerMenuController.getCategoriesRestaurantController(req, res)); // /restaurant/managerMenu/categories
router.post("/addMenuItem", (req, res) => managerMenuController.addMenuItemController(req, res)); // /restaurant/managerMenu/addMenuItem
router.post("/addCategories", (req, res) => managerMenuController.addCategoriesRestaurantController(req, res)); // /restaurant/managerMenu/addCategories
router.delete("/deleteMenuItem/:MenuItemId", (req, res) => managerMenuController.deleteMenuItemController(req, res)); // /restaurant/managerMenu/deleteMenuItem/:MenuItemId
router.delete("/deleteCategories/:CategoriesRestaurantId", (req, res) => managerMenuController.deleteCategoriesRestaurantController(req, res)); // /restaurant/managerMenu/deleteCategories/:CategoriesRestaurantId
router.put("/updateMenuItem", (req, res) => managerMenuController.updateMenuItemController(req, res)); // /restaurant/managerMenu/updateMenuItem

export default router;
