import { InfoRestaurantService } from "../../../services/users/infoRestaurant/infoRestaurant.service";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
export class InfoRestaurantController{
    private infoRestaurantService : InfoRestaurantService
    constructor() {
        this.infoRestaurantService = new InfoRestaurantService();
    }
    getInfoRestaurant = async (req : Request , res : Response) => {
        try{
            const RestaurantId = req.params.RestaurantId as string
            const CatagoriesRestaurantId = req.query.CategoriesRestaurantId as string | undefined

            if(!RestaurantId ){ 
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Missing data"})
            }
            const result = await this.infoRestaurantService.getInfoRestaurant(RestaurantId , CatagoriesRestaurantId)
            return res.status(StatusCodes.OK).json(result)


        }catch(error : any){
            console.error("Lỗi getInfoRestaurantController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy thông tin nhà hàng" });
        }
    }
    getListCategoriesRestaurant = async (req : Request , res : Response) => {
        try{
            const RestaurantId = req.query.RestaurantId as string
            if(!RestaurantId ){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Missing data"})
            }
            const result = await this.infoRestaurantService.getListCategoriesRestaurant(RestaurantId)
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            console.error("Lỗi getListCategoriesRestaurantController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy danh sách danh mục nhà hàng" });
        }
    }
}