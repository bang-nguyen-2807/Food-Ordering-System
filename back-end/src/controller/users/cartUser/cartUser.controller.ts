import { StatusCodes } from "http-status-codes";
import { CartUserService } from "../../../services/users/cartUser/cartUser.service";
import { Request, Response } from "express";
export class CartUserController{
    private cartUserService : CartUserService;
    constructor(){
        this.cartUserService = new CartUserService();
    }
    addItemsToCart = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            const RestaurantId = req.params.RestaurantId as string;
            const MenuItemId = req.query.MenuItemId as string;
            const Quantity = parseInt(req.query.Quantity as string) || 1;
            const result = await this.cartUserService.addItemsToCart(UserId, RestaurantId, MenuItemId, Quantity);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    fetchItemsToCart = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            const RestaurantId = parseInt(req.params.RestaurantId as string);
            const result = await this.cartUserService.fetchItemsToCart(UserId, RestaurantId);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    deleteItemsFromCart = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            const RestaurantId = req.params.RestaurantId as string;
            const MenuItemId = req.query.MenuItemId as string;
            const result = await this.cartUserService.deleteItemsFromCart(UserId, RestaurantId, MenuItemId);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    createOrderAndBill = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            const RestaurantId = req.params.RestaurantId as string;
            const UserAddressId = req.query.UserAddressId as string;
            const DeliveryAddress = (req.query.DeliveryAddress || req.body.DeliveryAddress || "") as string;
            const PaymentMethod = req.query.PaymentMethod as string;
            const CodeSaleId = req.query.CodeSaleId as string;
            const DeliveryFee = req.query.DeliveryFee as string;
            const result = await this.cartUserService.createOrderAndBill(UserId, RestaurantId, UserAddressId, DeliveryAddress, PaymentMethod, CodeSaleId, DeliveryFee);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
    getAddressUser = async (req : Request, res : Response) => {
        try{
            const UserId = req.query.UserId as string;
            const result = await this.cartUserService.getAddressUser(UserId);
            return res.status(StatusCodes.OK).json(result);
        }catch(err){
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal server error"});
        }
    }
}