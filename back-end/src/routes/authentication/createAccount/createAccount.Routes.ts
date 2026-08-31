import { Request, Response, Router } from "express";
import { CreateAccountController } from "../../../controller/authentication/createAccount/createAccount.Controller";

const router = Router();
const createAccountController = new CreateAccountController();
router.post("/createAccount" ,(req : Request , res : Response)=> createAccountController.createAccountController(req , res))
export default router