import { Router } from "express";
import { ChatbotDashboardController } from "../../../../controller/restaurant/AI_Chatbot/dashboard/chatbotDashboard.controller";

const router = Router();
const chatbotDashboardController = new ChatbotDashboardController();
router.post("/revenue-dashboard-chatbot", chatbotDashboardController.revenueDashboardChatbot);// /api/restaurant/chatbot/revenue-dashboard-chatbot
export default router;
