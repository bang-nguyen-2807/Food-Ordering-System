import { Router } from "express";
import { AiSuggestItemsRestaurantController } from "../../../controller/users/AI_Chatbox/AI_Suggest_Items_Restaurant.controller";
const router = Router();
const aiSuggestItemsRestaurantController = new AiSuggestItemsRestaurantController();
router.post("/chatBoxAISuggestItemsRestaurant", aiSuggestItemsRestaurantController.chatBoxAI); // chat box AI /api/user/aiChatBox/chatBoxAISuggestItemsRestaurant?RestaurantId=1&MessageUser=hello
export default router;