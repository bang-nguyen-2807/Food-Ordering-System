import { Request, Response } from "express";
import { HomeService } from "../../../services/users/home/home.service";
import { StatusCodes } from "http-status-codes";

export class HomeController {
    private homeService: HomeService;
    constructor() {
        this.homeService = new HomeService();
    }
    getListRestaurant = async(req : Request , res : Response)=>{
        try {
            const {lat , lng} = req.query as {lat : string , lng : string};
            if (!lat || !lng) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const result = await this.homeService.getListRestaurant(lat , lng);
            if (!result) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getListRestaurant:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy danh sách nhà hàng" });
        }
    }
    getListCatagories = async(req : Request , res : Response)=>{
        try {
            const result = await this.homeService.getListCatagories();
            if (!result) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getListCatagories:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy danh sách loại đồ ăn" });
        }
    }
}