import { UserController } from './../../../controller/admin/UsersAndPartness/user.controller';
import { Router , Request, Response } from "express";

const router = Router();
const userController = new UserController()
router.get("/user" , userController.userController) // /admin/userAndPartness/user
router.get("/restaurant" , userController.restaurantController) // /admin/userAndPartness/restaurant
router.get("/shipper" , userController.shipperController)// /admin/userAndPartness/shipper
//CRUD USER
router.put("/updateUser/:UserId" ,userController.updateUserController) // /admin/userAndPartness/updateUser
router.post("/addUser" ,(req : Request , res : Response)=> userController.addUserController(req , res)) // /admin/userAndPartness/addUser
router.delete("/deleteUser/:UserId" ,  userController.deleteUserController) // /admin/userAndPartness/deleteUser
//CRUD RESTAURANT
router.post("/addRestaurant" ,(req : Request , res : Response)=> userController.addRestaurantController(req , res)) // /admin/userAndPartness/addRestaurant
router.put("/updateRestaurant/:RestaurantId" , userController.updateRestaurantController) // /admin/userAndPartness/updateRestaurant
router.delete("/deleteRestaurant/:RestaurantId" , userController.deleteRestaurantController) // /admin/userAndPartness/deleteRestaurant
//CRUD SHIPPER
router.post("/addShipper", (req: Request, res: Response) => userController.addShipperController(req, res)); // /admin/userAndPartness/addShipper
router.put("/updateShipper/:ShipperId", userController.updateShipperController); // /admin/userAndPartness/updateShipper
router.delete("/deleteShipper/:ShipperId", userController.deleteShipperController); // /admin/userAndPartness/deleteShipper
export default router