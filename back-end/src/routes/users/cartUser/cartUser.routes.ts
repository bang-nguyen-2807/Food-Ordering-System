import { Router } from "express";
import { CartUserController } from "../../../controller/users/cartUser/cartUser.controller";
const router = Router();
const cartUserController = new CartUserController();
router.post("/addItemsToCart/:RestaurantId", cartUserController.addItemsToCart); // thêm vào giỏ hnagf
router.get("/fetchItemsToCart/:RestaurantId", cartUserController.fetchItemsToCart);// xem món ăn trong giỏ
router.delete("/deleteItemsFromCart/:RestaurantId", cartUserController.deleteItemsFromCart);// xóa món ăn trong giỏ
router.post("/createOrderAndBill/:RestaurantId", cartUserController.createOrderAndBill);// tạo đơn hàng và hóa đơn
router.get("/getAddressUser", cartUserController.getAddressUser);// get địa chỉ người dùng
export default router;