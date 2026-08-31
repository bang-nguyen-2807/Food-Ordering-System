import { AdminDashboardService } from './../../../services/admin/dashboard/Admin.Dashboard.service';
import {Request , Response} from 'express';
import { StatusCodes } from 'http-status-codes';
export class AdminDashboardController{
    private adminDashboardService : AdminDashboardService;
    constructor(){
        this.adminDashboardService = new AdminDashboardService();
    }
    totalNumberController = async(req : Request , res : Response)=>{
        try{
            const result = await this.adminDashboardService.totalNumberService();
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
    OrderCompletdController = async(req : Request , res : Response)=>{ // đơn hàng thành công
        try{
            const result = await this.adminDashboardService.OrderCompletdService();
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
    OrderConfirmedController = async(req : Request , res : Response)=>{ // đơn hàng chờ xác nhận
        try{
            const result = await this.adminDashboardService.OrderConfirmedService();
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
}