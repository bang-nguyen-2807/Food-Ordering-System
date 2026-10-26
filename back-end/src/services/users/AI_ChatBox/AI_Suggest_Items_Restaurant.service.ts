import { AiSuggestItemsRestaurantRepo } from "../../../repositories/users/AI_ChatBox/AI_Suggest_Items_Restaurant.repositories"
import { GoogleGenerativeAI } from "@google/generative-ai";
export class AiSuggestItemsRestaurantService{
    private AiSuggestItemsRestaurantRepo : AiSuggestItemsRestaurantRepo;
    constructor(){
        this.AiSuggestItemsRestaurantRepo = new AiSuggestItemsRestaurantRepo();
    }
    async chatBoxAI(messageUser : string , RestaurantId : string){
        const menu = await this.AiSuggestItemsRestaurantRepo.getItemsForAI(RestaurantId);
        const menuText = menu.map((item : any) =>  `- ${item.name} (${item.category}): ${item.price}đ`).join('\n');//Chuyển đổi mảng món ăn thành chuỗi text có định dạng dễ đọc
        // .join('\n') nối các dòng lại với nhau bằng xuống dòng
        const systemPrompt = `
        Bạn là trợ lý AI của nhà hàng, giúp khách hàng chọn món ăn phù hợp.
        Chỉ gợi ý các món CÓ TRONG MENU dưới đây. Không được tự bịa thêm món.
        Trả lời bằng tiếng Việt, thân thiện và ngắn gọn.
        
        MENU HIỆN TẠI:
        ${menuText}
    `;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); // 
        const modalAI = genAI.getGenerativeModel({model : "gemini-3.5-flash-lite" , systemInstruction: systemPrompt})// systemInstruction giúp AI luôn tuân theo vai trò và quy tắc đã định nghĩa
        const result = await modalAI.generateContent(messageUser)
        const responseText = result.response.text();
        return responseText;
    }
    
} 
    