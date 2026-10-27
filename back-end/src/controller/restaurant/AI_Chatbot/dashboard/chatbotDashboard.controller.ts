import { Request, Response } from "express";
import { ChatbotDashboardService } from "../../../../services/restaurant/AI_Chatbot/dashboard/chatbotDashboard.service";
import { StatusCodes } from "http-status-codes";
export class ChatbotDashboardController{
    private chatbotDashboardService : ChatbotDashboardService;
    constructor(){
        this.chatbotDashboardService = new ChatbotDashboardService();
    }
    revenueDashboardChatbot = async(req : Request , res : Response)=>{
        try {
            const {messageUser , UserId} = req.body;
            if(!UserId){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "UserId is required"});
            }
            const result = await this.chatbotDashboardService.revenueDashboardChatbot(messageUser , UserId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "Internal Server Error"});
        }
    }
}