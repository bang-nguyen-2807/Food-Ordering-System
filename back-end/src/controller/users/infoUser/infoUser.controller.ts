import { StatusCodes } from "http-status-codes";
import { InfoUserService } from "../../../services/users/infoUser/infoUser.service";
import { Request , Response} from "express";

export class InfoUserController{
    private infoUserService : InfoUserService;
    constructor(){
        this.infoUserService = new InfoUserService();
    }

    setAddressUserController = async (req : Request , res : Response)=>{
        const body = await req.body;
        const {AddressName , Addresses , UserId} = body;
        if(!Addresses || !UserId){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin"})
        }
        const result = await this.infoUserService.setAddressUserService(req);
        if(result){
            return res.status(StatusCodes.OK).json({message : "Thêm địa chỉ thành công"})
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Lỗi hệ thống"})
    }
    getAddressUser = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin"})
            }
            const result = await this.infoUserService.getAddressUser(UserId);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    getInfoUser = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin"})
            }
            const result = await this.infoUserService.getInfoUser(UserId);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    deleteAddressUser = async (req : Request, res : Response) => {
        try{
            const UserAddressId = req.body.UserAddressId as string;
            if(!UserAddressId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin"})
            }
            const result = await this.infoUserService.deleteAddressUser(UserAddressId);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    updateInfoUser = async (req : Request , res : Response) => {
        try{
            const body = await req.body;
            const UserId = body.UserId as string;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "vui lòng đăng nhập"})
            }
            const result = await this.infoUserService.UpdateInfoUser(req);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
}