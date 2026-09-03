import { DashboardRepo } from "../../../repositories/restaurant/dashboard/dashboard.repo";

export class DashboardRepoService{
    private dashboardRepo  : DashboardRepo;
    constructor(){
        this.dashboardRepo = new DashboardRepo();
    }

    async DashboardService(UserId : string){
        const result = await this.dashboardRepo.Dashboard(UserId);
        return result;
    }
    async weeklyRevenueService(UserId : string){
        const result = await this.dashboardRepo.weeklyRevenue(UserId);
        return result;
    }
    async orderJustPlacedService(UserId : string){
        const result = await this.dashboardRepo.orderJustPlaced(UserId);
        return result;
    }
}