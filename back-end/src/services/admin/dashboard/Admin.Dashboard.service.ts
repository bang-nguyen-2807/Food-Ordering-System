import { AdminDashboardRepo } from './../../../repositories/admin/dashboard/Admin.Dashboard.repo';
import { StatusCodes } from 'http-status-codes';
export class AdminDashboardService{
    private adminDashboardRepo : AdminDashboardRepo;
    constructor(){
        this.adminDashboardRepo = new AdminDashboardRepo();
    }
    async totalNumberService(){ // tổng số đơn hàng
        const totalNumber = await this.adminDashboardRepo.totalNumber();
        if(!totalNumber){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return totalNumber
    }
    async OrderCompletdService(){ // đơn hàng đã thành công
        const orderCompletd = await this.adminDashboardRepo.OrderCompletd();
        if(!orderCompletd){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return orderCompletd
    }
    async OrderConfirmedService(){ // đơn hàng chờ xác nhận
        const orderConfirmed = await this.adminDashboardRepo.OrderConfirmed();
        if(!orderConfirmed){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return orderConfirmed
    }
}