import { ManagerOrderRepo } from "../../../repositories/restaurant/managerOrder/managerOrder.repo";

export class ManagerOrderService {
    private managerOrderRepo: ManagerOrderRepo;
    constructor() {
        this.managerOrderRepo = new ManagerOrderRepo()
    }
    async ManagerOrderService(UserId: string, OrderStatus: string) {
        const result = await this.managerOrderRepo.ManagerOrder(UserId, OrderStatus)
        return result;
    }
    async UpdateOrderStatusService(OrderId: number, OrderStatus: string) {
        const result = await this.managerOrderRepo.UpdateOrderStatus(OrderId, OrderStatus);
        return result;
    }
}