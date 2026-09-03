import { ManagerMenuService } from "../../../services/restaurant/managerMenu/managerMenu.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ManagerMenuController {
    private managerMenuService : ManagerMenuService;

    constructor(){
        this.managerMenuService = new ManagerMenuService();
    }

    async getManagerMenuController(req : Request , res : Response){
        try {
            const UserId = req.query.UserId as string;
            const CategoriesRestaurantId = req.query.CategoriesRestaurantId as string;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu UserId trong Yêu cầu!"});
            }
            const result = await this.managerMenuService.getManagerMenuService(UserId , CategoriesRestaurantId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getManagerMenuController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi máy chủ khi lấy menu"});
        }
    }

    async getCategoriesRestaurantController(req : Request , res : Response){
        try {
            const UserId = req.query.UserId as string;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu UserId trong Yêu cầu!"});
            }
            const result = await this.managerMenuService.getCategoriesRestaurantService(UserId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getCategoriesRestaurantController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi máy chủ khi lấy danh mục"});
        }
    }

    async addMenuItemController(req : Request , res : Response){
        try {
            const body = await req.body;
            if(!body.NameMenuItems || !body.Price || !body.UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin bắt buộc!"});
            }
            const result = await this.managerMenuService.addMenuItemService(req);
            return res.status(StatusCodes.OK).json({message : "Success", result});
        } catch (error: any) {
            console.error("Lỗi addMenuItemController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi khi thêm món"});
        }
    }

    async addCategoriesRestaurantController(req : Request , res : Response){
        try {
            const body = await req.body;
            if(!body.UserId || !body.CategoriesRestaurantName || !body.CategorieRestaurantsCode){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin danh mục!"});
            }
            const result = await this.managerMenuService.addCategoriesRestaurantService(req);
            return res.status(StatusCodes.OK).json({message : "Success", result});
        } catch (error: any) {
            console.error("Lỗi addCategoriesRestaurantController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi khi thêm danh mục"});
        }
    }

    async deleteMenuItemController(req : Request<{MenuItemId : string}> , res : Response){
        try {
            const MenuItemId = req.params.MenuItemId;
            if(!MenuItemId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu MenuItemId!"});
            }
            const result = await this.managerMenuService.deleteMenuItemService(req);
            return res.status(StatusCodes.OK).json({message : "Success", result});
        } catch (error: any) {
            console.error("Lỗi deleteMenuItemController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi khi xóa món"});
        }
    }

    async deleteCategoriesRestaurantController(req : Request<{CategoriesRestaurantId : string}> , res : Response){
        try {
            const CategoriesRestaurantId = req.params.CategoriesRestaurantId;
            if(!CategoriesRestaurantId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu CategoriesRestaurantId!"});
            }
            const result = await this.managerMenuService.deleteCategoriesRestaurantService(req);
            return res.status(StatusCodes.OK).json({message : "Success", result});
        } catch (error: any) {
            console.error("Lỗi deleteCategoriesRestaurantController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi khi xóa danh mục"});
        }
    }

    async updateMenuItemController(req : Request , res : Response){
        try {
            const body = await req.body;
            if(!body.MenuItemId || !body.NameMenuItems || body.Price === undefined){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Thiếu thông tin cập nhật món!"});
            }
            const result = await this.managerMenuService.updateMenuItemService(req);
            return res.status(StatusCodes.OK).json({message : "Success", result});
        } catch (error: any) {
            console.error("Lỗi updateMenuItemController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message || "Lỗi khi cập nhật món"});
        }
    }
}