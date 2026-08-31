import { Request, Response } from "express";
import { CreateAccountService } from "../../../services/authentication/createAccount/createAccount.service";
import { StatusCodes } from "http-status-codes";
export class CreateAccountController{
    private createAccountService : CreateAccountService;
    constructor(){
        this.createAccountService = new CreateAccountService()
    }
    createAccountController = async(req : Request , res : Response) =>{
        try{
            const body = req.body;
            if(!body){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "missing data"})
            }
            const result = await this.createAccountService.createAccountService(req);
            if(result){
                return res.status(result.status || StatusCodes.OK).json(result);
            }else{
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "Tạo tài khoản thất bại!"});
            }
        }catch{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status : StatusCodes.INTERNAL_SERVER_ERROR , message : "Lỗi máy chủ!"});
        }
    }
}