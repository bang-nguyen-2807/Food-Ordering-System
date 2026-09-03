import { Request, Response } from "express";
import { ManagerOrderService } from "../../../services/restaurant/managerOrder/managerOrder.service";
import { StatusCodes } from "http-status-codes";

export class ManagerOrderController {
    private managerOrderService: ManagerOrderService;
    constructor() {
        this.managerOrderService = new ManagerOrderService();
    }
    ManagerOrderController = async(req : Request , res : Response)=>{
        const UserId = req.query.UserId as string;
        const OrderStatus = req.query.OrderStatus as string;
        if(!UserId){
            return res.status(StatusCodes.NOT_FOUND).json({message : "Not Found"});
        }
        const result = await this.managerOrderService.ManagerOrderService(UserId , OrderStatus);
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"});
        }
        return res.status(StatusCodes.OK).json(result);
    }
    UpdateOrderStatusController = async(req : Request , res : Response)=>{
        const OrderId = req.body.OrderId;
        const OrderStatus = req.body.OrderStatus;
        if(!OrderId || !OrderStatus){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"});
        }
        const result = await this.managerOrderService.UpdateOrderStatusService(OrderId , OrderStatus);
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Bad Request"});
        }
        return res.status(StatusCodes.OK).json(result);
    }
}