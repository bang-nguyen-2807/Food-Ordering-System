import { Request } from "express";
import { DashboardRepo } from "../../../repositories/shiper/dashboard/dashboard.repo";


export class DashboardService {
    private dashboardRepo: DashboardRepo;
    constructor() {
        this.dashboardRepo = new DashboardRepo()
    }
    async totalOrder(UserId: string) {
        const result = await this.dashboardRepo.totalOrder(UserId);
        return result;
    }
    async updateShipperLocation(req: Request) {
        const result = await this.dashboardRepo.updateShipperLocation(req);
        return result;
    }
    async getAvailableDeliveries(UserId: string, radiusMeter?: number) {
        const result = await this.dashboardRepo.getAvailableDeliveries(UserId, radiusMeter);
        return result;
    }
}