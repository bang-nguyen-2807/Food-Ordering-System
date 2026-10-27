import { ChatbotManagerMenuService } from "../../../../services/restaurant/AI_Chatbot/managerMenu/chatbotManagerMenu.service";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
export class ChatbotMangerMenuController{
    private chatbotMangerService : ChatbotManagerMenuService;
    constructor(){
        this.chatbotMangerService = new ChatbotManagerMenuService();
    }
    ChatbotSelling = async(req : Request , res : Response) => {
        try {
            const {messageUser , UserId} = req.body;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "UserId is required"});
            }
            const result = await this.chatbotMangerService.ChatbotSelling(messageUser, UserId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal Server Error"});
        }
    }
}