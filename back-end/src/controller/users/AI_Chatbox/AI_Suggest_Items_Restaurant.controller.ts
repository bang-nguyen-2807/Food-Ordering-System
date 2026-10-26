import { Request, Response } from "express";
import {AiSuggestItemsRestaurantService} from "../../../services/users/AI_ChatBox/AI_Suggest_Items_Restaurant.service"
import { StatusCodes } from "http-status-codes";
export class AiSuggestItemsRestaurantController{
    private aiSuggestItemsRestaurantService : AiSuggestItemsRestaurantService;
    constructor(){
        this.aiSuggestItemsRestaurantService = new AiSuggestItemsRestaurantService();
    }
    chatBoxAI = async (req : Request , res : Response) => {
        try {
            const {messageUser , RestaurantId} = req.body;
            if(!RestaurantId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "RestaurantId is required"});
            }
            const result = await this.aiSuggestItemsRestaurantService.chatBoxAI(messageUser , RestaurantId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal Server Error"});
        }
    }
}