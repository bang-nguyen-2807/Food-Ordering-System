import { StatusCodes } from "http-status-codes";
import { LoginService } from "../../../services/authentication/login/login.service";
import { Request, Response } from "express";
export class LoginController {
    private loginService : LoginService ;
    constructor(){
        this.loginService = new LoginService();
    }
    loginController = async (req : Request , res : Response)=>{
        try{
            const body = await req.body
            if(!body){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "missing data"})
            }
            const result = await this.loginService.loginService(req)
            if(result){
                return res.status(StatusCodes.OK).json(result);
            }else{
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "failed add class"});
            }
        }catch{
            return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "failed add class"});
        }
    }
}