import { Request, Response } from "express"
import { DeliveriesService } from "../../../services/users/deliveries/deliveries.service"
import { StatusCodes } from "http-status-codes"

export class DeliveriesController{
    private deliveriesService : DeliveriesService
    constructor() {
        this.deliveriesService = new DeliveriesService()
    }
    getLocationShipperDeliveries = async(req : Request , res : Response)=>{
        try{
            const OrderId = req.query.OrderId as string;
            const UserId = req.query.UserId as string;
            if(!OrderId || !UserId){
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const result = await this.deliveriesService.getLocationShipperDelivery(OrderId , UserId)
            return res.status(StatusCodes.OK).json(result)
        }catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }
    getAddressUserPlaceOrder = async(req : Request , res : Response)=>{
        try{
            const OrderId = req.query.OrderId as string;
            const UserId = req.query.UserId as string;
            if(!OrderId || !UserId){
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const result = await this.deliveriesService.getAddressUserPlaceOrder(OrderId , UserId)
            return res.status(StatusCodes.OK).json(result)
        }catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }
    getStatusDeliveries = async(req : Request , res : Response)=>{
        try{
            const OrderId = req.query.OrderId as string;
            const UserId = req.query.UserId as string;
            if(!OrderId || !UserId){
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const result = await this.deliveriesService.getStatusDeliveries(OrderId , UserId)
            return res.status(StatusCodes.OK).json(result)
        }catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }
}