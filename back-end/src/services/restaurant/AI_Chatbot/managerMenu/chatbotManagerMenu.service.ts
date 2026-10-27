import { ChatbotManagerMenuRepo } from "../../../../repositories/restaurant/AI_Chatbot/managerMenu/chatbotManagerMenu.repo";
import { GoogleGenerativeAI } from "@google/generative-ai";
export class ChatbotManagerMenuService {
    private chatbotManagerMenuRepo: ChatbotManagerMenuRepo;
    constructor() {
        this.chatbotManagerMenuRepo = new ChatbotManagerMenuRepo();
    }

    async ChatbotSelling(messageUser : string, UserId: string) {
        const [
            bestSellingToday,
            bestSelling7Days,
            bestSellingMonth,
            slowSellingToday,
            slowSelling7Days,
            slowSellingMonth
        ] = await Promise.all([
            this.chatbotManagerMenuRepo.top5BestSellingToday(UserId),
            this.chatbotManagerMenuRepo.top5BestSelling7Days(UserId),
            this.chatbotManagerMenuRepo.top5BestSellingThisMonth(UserId),
            this.chatbotManagerMenuRepo.top5SlowSellingToday(UserId),
            this.chatbotManagerMenuRepo.top5SlowSelling7Days(UserId),
            this.chatbotManagerMenuRepo.top5SlowSellingThisMonth(UserId),
        ]);

        //  Top 5 bán chạy hôm nay
        const bestSellingTodayText = bestSellingToday.map((item: any) => `
        Mã món : ${item.MenuItemId}
        Tên món : ${item.NameMenuItems}
        Giá bán : ${item.Price}
        Trạng thái phục vụ : ${item.is_available ? 'Đang mở bán' : 'Tạm ngưng bán'}
        Tổng số lượng đã bán hôm nay : ${item.TotalQuantitySold}
        Tổng doanh thu tạo ra hôm nay : ${item.TotalRevenueGenerated}
        `).join('\n');

        //  Top 5 bán chạy trong 7 ngày qua
        const bestSelling7DaysText = bestSelling7Days.map((item: any) => `
        Mã món : ${item.MenuItemId}
        Tên món : ${item.NameMenuItems}
        Giá bán : ${item.Price}
        Trạng thái phục vụ : ${item.is_available ? 'Đang mở bán' : 'Tạm ngưng bán'}
        Tổng số lượng đã bán trong 7 ngày qua : ${item.TotalQuantitySold}
        Tổng doanh thu tạo ra trong 7 ngày qua : ${item.TotalRevenueGenerated}
        `).join('\n');

        //  5 bán chạy trong tháng này
        const bestSellingMonthText = bestSellingMonth.map((item: any) => `
        Mã món : ${item.MenuItemId}
        Tên món : ${item.NameMenuItems}
        Giá bán : ${item.Price}
        Trạng thái phục vụ : ${item.is_available ? 'Đang mở bán' : 'Tạm ngưng bán'}
        Tổng số lượng đã bán trong tháng này : ${item.TotalQuantitySold}
        Tổng doanh thu tạo ra trong tháng này : ${item.TotalRevenueGenerated}
        `).join('\n');

        // Top 5 bán chậm hôm nay
        const slowSellingTodayText = slowSellingToday.map((item: any) => `
        Mã món : ${item.MenuItemId}
        Tên món : ${item.NameMenuItems}
        Giá bán : ${item.Price}
        Trạng thái phục vụ : ${item.is_available ? 'Đang mở bán' : 'Tạm ngưng bán'}
        Tổng số lượng đã bán hôm nay : ${item.TotalQuantitySold}
        Tổng doanh thu tạo ra hôm nay : ${item.TotalRevenueGenerated}
        `).join('\n');

        // Top 5 bán chậm trong 7 ngày qua
        const slowSelling7DaysText = slowSelling7Days.map((item: any) => `
        Mã món : ${item.MenuItemId}
        Tên món : ${item.NameMenuItems}
        Giá bán : ${item.Price}
        Trạng thái phục vụ : ${item.is_available ? 'Đang mở bán' : 'Tạm ngưng bán'}
        Tổng số lượng đã bán trong 7 ngày qua : ${item.TotalQuantitySold}
        Tổng doanh thu tạo ra trong 7 ngày qua : ${item.TotalRevenueGenerated}
        `).join('\n');

        // Top 5 bán chậm trong tháng này
        const slowSellingMonthText = slowSellingMonth.map((item: any) => `
        Mã món : ${item.MenuItemId}
        Tên món : ${item.NameMenuItems}
        Giá bán : ${item.Price}
        Trạng thái phục vụ : ${item.is_available ? 'Đang mở bán' : 'Tạm ngưng bán'}
        Tổng số lượng đã bán trong tháng này : ${item.TotalQuantitySold}
        Tổng doanh thu tạo ra trong tháng này : ${item.TotalRevenueGenerated}
        `).join('\n');

        const systemPromp = `
        Bạn là trợ lý AI của nhà hàng. giúp quản lí có thể thống kê nhanh chóng 5 món bán chậm nhất và 5 món bán chạy nhất. 
        Hãy đưa ra nhận xét một cách ngắn gọn, súc tích và thân thiện.Hãy đưa ra lời khuyên hoặc đề xuất hợp lý nếu có.

        Dữ liệu báo cáo :
        Top 5 món bán chạy hôm nay :
        ${bestSellingTodayText}

        Top 5 món bán chạy trong 7 ngày qua :
        ${bestSelling7DaysText}

        Top 5 món bán chạy trong tháng này :
        ${bestSellingMonthText}

        Top 5 món bán chậm hôm nay :
        ${slowSellingTodayText}

        Top 5 món bán chậm trong 7 ngày qua :
        ${slowSelling7DaysText}

        Top 5 món bán chậm trong tháng này :
        ${slowSellingMonthText}
        Trả lời bằng tiếng Việt.
        `
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const modalAI = genAI.getGenerativeModel({model : process.env.GEMINI_MODAL! , systemInstruction: systemPromp})
        const result = await modalAI.generateContent(messageUser)
        const responseText = result.response.text()
        return responseText
    }
}