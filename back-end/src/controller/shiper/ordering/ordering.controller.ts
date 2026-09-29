import { StatusCodes } from "http-status-codes";
import { OrderingService } from "../../../services/shiper/ordering/ordering.service";
import { Request, Response, NextFunction } from "express";

export class OrderingController {
    private orderingService: OrderingService
    constructor() {
        this.orderingService = new OrderingService();
    }
    StatusOrder = async (req: Request, res: Response) => {
        try {
            const UserId = req.query.UserId as string;
            const OrderId = req.query.OrderId as string;

            if (!UserId || !OrderId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "UserId and OrderId are required" })
            }

            const result = await this.orderingService.StatusOrder(UserId, OrderId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }
    UpdateNextStatusOrder = async (req: Request, res: Response) => {
        try {
            const OrderId = req.body.OrderId as string;
            const UserId = req.body.UserId as string;
            if (!OrderId || !UserId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "OrderId and UserId are required" })
            }
            const result = await this.orderingService.UpdateNextStatusOrder(req);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }
    infoRoute = async (req : Request , res : Response)=>{
        try {
            const UserId = req.query.UserId as string;
            const OrderId = req.query.OrderId as string;
            if(!UserId || !OrderId){
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "UserId and OrderId are required" })
            }
            const result = await this.orderingService.infoRoute(UserId , OrderId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }
}