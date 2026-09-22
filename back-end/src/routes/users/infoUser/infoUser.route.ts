import { Router } from "express";
import { InfoUserController } from "../../../controller/users/infoUser/infoUser.controller";
const router = Router();
const infoUserController = new InfoUserController();
router.post("/addAddress" , infoUserController.setAddressUserController)// thêm địa chỉ cho user
router.get("/getAddressUser" , infoUserController.getAddressUser) // get địa chỉ của user
router.get("/getInfoUser" , infoUserController.getInfoUser) // get thông tin của user
router.delete("/deleteAddressUser" , infoUserController.deleteAddressUser) // xóa địa chỉ của user
router.put("/updateInfoUser" , infoUserController.updateInfoUser) // cập nhật thông tin của user
router.put("/changePassword" , infoUserController.changePassword) // đổi mật khẩu của user
export default router;
