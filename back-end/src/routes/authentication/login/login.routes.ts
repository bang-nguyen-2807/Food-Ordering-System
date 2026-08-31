import { LoginController } from './../../../controller/authentication/login/Login.controller';
import { Router , Request , Response} from "express";
const router = Router();
const loginController = new LoginController();
router.post("/login" , (req : Request, res : Response)=>loginController.loginController(req , res))// /api/authentication/login
export default router