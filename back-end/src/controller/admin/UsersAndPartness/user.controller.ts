
import { Request, Response } from "express";
import { UserService } from "../../../services/admin/UsersAndPartness/User.Service";
import { StatusCodes } from "http-status-codes";

export class UserController{
    private userService : UserService;
    constructor (){
        this.userService = new UserService();
    }
    userController = async (req : Request , res : Response)=>{ // get data user
        try{
            const result = await this.userService.userService();
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
    restaurantController = async(req : Request , res : Response)=>{// get data restaurant
        try{
            const result = await this.userService.restaurantService();
            return res.status(StatusCodes.OK).json(result)
        }catch(err : any){
            const status = err.message.includes("không tìm thấy") ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR
            return res.status(status).json({message : err.message})
        }
    }
    shipperController = async (req : Request , res : Response)=>{ // get data shipper
        try{
            const result = await this.userService.shipperService();
            return res.status(StatusCodes.OK).json(result)
        }catch(err : any){
            const status = err.message.includes("không tìm thấy") ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR
            return res.status(status).json({message : err.message})
        }
    }
    // USER
    addUserController = async(req : Request , res : Response)=>{// post data user
        try{
            const result = await this.userService.AddUserService(req);
            return res.status(StatusCodes.OK).json(result)
        }catch(err : any){
            const status = err.message.includes("không tìm thấy") ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR
            return res.status(status).json({message : err.message})
        }
    }
    updateUserController = async(req : Request<{UserId : string}> , res : Response)=>{ // update data user
        try{
            const UserId = parseInt(req.params.UserId);
            const {FullName , UserName , NumberPhone , Email} = req.body;
            if(isNaN(UserId)){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "UserId ko hợp lệ"})
            }
            if(!FullName || !UserName || !NumberPhone || !Email){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "missing data"})
            }
            const result = await this.userService.updateUserService(Number(UserId) , FullName , UserName , NumberPhone , Email)
            if(!result){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "lỗi post dữ liệu"})
            } return res.status(StatusCodes.OK).json(result)
        }catch{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status : StatusCodes.INTERNAL_SERVER_ERROR , message : "Lỗi máy chủ!"});
        }
    }
    deleteUserController = async(req : Request<{UserId : string}> , res : Response)=>{
        try{
            const UserId = parseInt(req.params.UserId); // ép về kiểu số nguyên
            if(isNaN(UserId)){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "UserId không hợp lệ"})
            }
            const result = await this.userService.deleteUserService(UserId)
            if(!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)){
                return res.status(StatusCodes.BAD_REQUEST).json({status : StatusCodes.BAD_REQUEST , message : "Lỗi khi xóa người dùng!"})
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Xóa người dùng thành công!" })
        }catch{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status : StatusCodes.INTERNAL_SERVER_ERROR , message : "Lỗi máy chủ!"});
        }
    }

    // --- RESTAURANT CONTROLLERS ---
    addRestaurantController = async (req: Request, res: Response) => {
        try {
            const { RestaurantName, UserId, Addresses, RestaurantRole } = req.body;
            if (!RestaurantName || !UserId || !Addresses) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Vui lòng nhập đầy đủ thông tin nhà hàng!" });
            }
            const result = await this.userService.addRestaurantService(RestaurantName, Number(UserId), Addresses, RestaurantRole);
            if (!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Lỗi khi thêm nhà hàng!" });
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Thêm nhà hàng mới thành công!" });
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Lỗi máy chủ!" });
        }
    }

    updateRestaurantController = async (req: Request<{ RestaurantId: string }>, res: Response) => {
        try {
            const RestaurantId = parseInt(req.params.RestaurantId);
            const { RestaurantName, UserId, Addresses, RestaurantRole } = req.body;
            if (isNaN(RestaurantId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "RestaurantId không hợp lệ" });
            }
            if (!RestaurantName || !UserId || !Addresses) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Vui lòng điền đầy đủ dữ liệu" });
            }
            const result = await this.userService.updateRestaurantService(RestaurantId, RestaurantName, Number(UserId), Addresses, RestaurantRole);
            if (!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Lỗi khi cập nhật nhà hàng!" });
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Cập nhật nhà hàng thành công!" });
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Lỗi máy chủ!" });
        }
    }

    deleteRestaurantController = async (req: Request<{ RestaurantId: string }>, res: Response) => {
        try {
            const RestaurantId = parseInt(req.params.RestaurantId);
            if (isNaN(RestaurantId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "RestaurantId không hợp lệ" });
            }
            const result = await this.userService.deleteRestaurantService(RestaurantId);
            if (!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Lỗi khi xóa nhà hàng!" });
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Xóa nhà hàng thành công!" });
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Lỗi máy chủ!" });
        }
    }

    // --- SHIPPER CONTROLLERS ---
    addShipperController = async (req: Request, res: Response) => {
        try {
            const { FullName, UserName, Password, NumberPhone, Email, UserId } = req.body;
            if (!UserId && (!FullName || !UserName || !Password || !NumberPhone || !Email)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Vui lòng nhập đầy đủ thông tin shipper!" });
            }
            const result = await this.userService.addShipperService(FullName, UserName, Password, NumberPhone, Email, UserId ? Number(UserId) : undefined);
            if (!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Lỗi khi thêm shipper!" });
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Thêm shipper mới thành công!" });
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Lỗi máy chủ!" });
        }
    }

    updateShipperController = async (req: Request<{ ShipperId: string }>, res: Response) => {
        try {
            const ShipperId = parseInt(req.params.ShipperId);
            const { UserId, FullName, UserName, NumberPhone, Email } = req.body;
            if (isNaN(ShipperId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "ShipperId không hợp lệ" });
            }
            if (!UserId || !FullName || !UserName || !NumberPhone || !Email) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Vui lòng điền đầy đủ thông tin" });
            }
            const result = await this.userService.updateShipperService(ShipperId, Number(UserId), FullName, UserName, NumberPhone, Email);
            if (!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Lỗi khi cập nhật shipper!" });
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Cập nhật shipper thành công!" });
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Lỗi máy chủ!" });
        }
    }

    deleteShipperController = async (req: Request<{ ShipperId: string }>, res: Response) => {
        try {
            const ShipperId = parseInt(req.params.ShipperId);
            if (isNaN(ShipperId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "ShipperId không hợp lệ" });
            }
            const result = await this.userService.deleteShipperService(ShipperId);
            if (!result || (typeof result === "object" && "status" in result && result.status === StatusCodes.BAD_REQUEST)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "Lỗi khi xóa shipper!" });
            }
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "Xóa shipper thành công!" });
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Lỗi máy chủ!" });
        }
    }
}