import { ManagerOrderRepo } from "../../../repositories/admin/managerOrder/managerOrder.repo";
import { StatusCodes } from "http-status-codes";
export class ManagerOrderService{
    private managerOrderRepo : ManagerOrderRepo;
    constructor(){
        this.managerOrderRepo = new ManagerOrderRepo();
    }
    async infoOrderService(Status?: string, RestaurantId?: number) { // thông tin tất cả đơn hàng
        const result = await this.managerOrderRepo.infoOrder(Status, RestaurantId);
        return result;
    }

    async getRestaurantsListService() {
        const result = await this.managerOrderRepo.getRestaurantsList();
        return result;
    }
}