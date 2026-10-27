import { Router } from "express";
import { ChatbotMangerMenuController } from "../../../../controller/restaurant/AI_Chatbot/managerMenu/chatbotManagerMenu.controller";

const router = Router()
const chatbotMangerMenuController = new ChatbotMangerMenuController()
router.post('/ChatbotSelling', chatbotMangerMenuController.ChatbotSelling); // /api/restaurant/chatbot/ChatbotSelling
export default router
