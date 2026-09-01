import { ManagerOrderService } from "../../../services/admin/managerOrder/managerOrder.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
export class ManagerOrderController {
    private managerOrderService = new ManagerOrderService();
    infoOrderController = async (req: Request, res: Response) => {
        const Status = req.query.Status as string;
        const RestaurantIdStr = req.query.RestaurantId as string;
        const RestaurantId = RestaurantIdStr ? parseInt(RestaurantIdStr, 10) : undefined;
        
        const result = await this.managerOrderService.infoOrderService(Status, RestaurantId);
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"})
        } 
        return res.status(StatusCodes.OK).json(result);
    }

    getRestaurantsListController = async (req: Request, res: Response) => {
        const result = await this.managerOrderService.getRestaurantsListService();
        return res.status(StatusCodes.OK).json(result);
    }
}