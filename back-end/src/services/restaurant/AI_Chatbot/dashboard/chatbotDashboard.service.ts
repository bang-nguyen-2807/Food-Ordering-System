import { ChatbotDashboardRepo } from "../../../../repositories/restaurant/AI_Chatbot/dashboard/chatbotDashboard.repo"
import { GoogleGenerativeAI } from "@google/generative-ai";
export class ChatbotDashboardService{
    private chatbotDashboardRepo : ChatbotDashboardRepo;
    constructor(){
        this.chatbotDashboardRepo = new ChatbotDashboardRepo();
    }
    async revenueDashboardChatbot(messageUser : string , UserId : string){
        const revenue = await this.chatbotDashboardRepo.revenueDashboardChatbot(UserId);
        const revenueText = revenue.map((item : any)=> `
        Tổng đơn hôm nay : ${item.totalOrdersToday}
        Doanh thu thực tế (chỉ tính các đơn giao thành công 'COMPLETED') : ${item.netRevenueToday}
        Số đơn chờ xử lý : ${item.pendingOrders} -
        Số đơn đang chuẩn bị : ${item.preparingOrders}-
        Số đơn hoàn thành : ${item.completedOrders}-
        Số đơn đã hủy : ${item.cancelledOrders}-
        Tổng đơn trong 7 ngày qua : ${item.totalOrders7Days}-
        Tổng đơn trong tháng này : ${item.totalOrdersThisMonth}-
        Doanh thu trong 7 ngày qua : ${item.revenue7Days}-
        Doanh thu trong tháng này : ${item.revenueThisMonth}-

        `).join('\n')
        const systemPromt = `
        Bạn là trợ lý AI của nhà hàng, giúp quản lí có thể xem báo cáo doanh thu hôm nay từ đó có thể cho quản lý biết được tình hình kinh doanh hôm nay của nhà hàng so với tuần và tháng trước.
        Hãy so sánh và đưa ra nhận xét, đánh giá ngắn gọn. Hãy đưa ra lời khuyên hoặc đề xuất hợp lý nếu có.
        thông qua dữ liệu được cung cấp dưới đây.
        Dữ liệu báo cáo:
        ${revenueText}
        Hãy trả lời một cách thân thiện, ngắn gọn, súc tích
        Trả lời bằng tiếng Việt.
        `
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const modalAI = genAI.getGenerativeModel({model : process.env.GEMINI_MODAL! , systemInstruction: systemPromt})
        const result = await modalAI.generateContent(messageUser)
        const responseText = result.response.text()
        return responseText
    }
}