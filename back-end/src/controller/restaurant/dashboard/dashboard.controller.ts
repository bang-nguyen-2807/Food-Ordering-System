import { StatusCodes } from "http-status-codes";
import { DashboardRepoService } from "../../../services/restaurant/dashboard/dashboard.service";
import { Request, Response } from "express";
export class DashboardController {
    private dashboardService : DashboardRepoService;
    constructor(){
        this.dashboardService = new DashboardRepoService();
    }

    dashboardController = async(req : Request , res : Response)=>{
        const UserId = req.query.UserId as string; // Query parameter là tham số được truyền lên server thông qua URL
        if(!UserId){
            return res.status(StatusCodes.NOT_FOUND).json({message : "Not Found"})
        }
        const result = await this.dashboardService.DashboardService(UserId);
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"});
        }
        return res.status(StatusCodes.OK).json(result);
    }
    weeklyRevenueController = async(req :Request , res : Response)=>{
        const UserId = req.query.UserId as string;
        if(!UserId){
            return res.status(StatusCodes.NOT_FOUND).json({message : "Not Found"})
        }
        const result = await this.dashboardService.weeklyRevenueService(UserId);
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"})
        }
        return res.status(StatusCodes.OK).json(result);
    }
    orderJustPlacedController = async(req :Request , res : Response)=>{
        const UserId = req.query.UserId as string;
        if(!UserId){
            return res.status(StatusCodes.NOT_FOUND).json({message : "Not Found"})
        }
        const result = await this.dashboardService.orderJustPlacedService(UserId);
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"})
        }
        return res.status(StatusCodes.OK).json(result);
    }
}