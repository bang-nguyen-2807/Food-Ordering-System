import { StatusCodes } from "http-status-codes";
import { SaleCodeService } from "../../../services/admin/saleCode/saleCode.service";
import {Request , Response } from "express";
export class SaleCodeController{
    private saleCodeService : SaleCodeService;
    constructor(){
        this.saleCodeService = new SaleCodeService();
    }
    listSaleCodeController = async(req : Request , res : Response)=>{ // get sale code
        try{
            const result = await this.saleCodeService.listSaleCodeService();
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
    addSaleCodeController = async(req : Request , res : Response)=>{
        try{
            const body = await req.body;
            if(!body){
                throw new Error("Body is required");
            }
            const result = await this.saleCodeService.addSaleCodeService(req);
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
    deleteSaleCodeController = async(req : Request<{AdminCodeId : string}> , res : Response)=>{
        try{
            const body = await req.body;
            const AdminCodeId = parseInt(req.params.AdminCodeId)
            if(isNaN(AdminCodeId)){
                return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: "RestaurantId không hợp lệ" });
            }
            if(!body){
                throw new Error("Body is required");
            }
            const result = await this.saleCodeService.deleteSaleCodeService(req);
            return res.status(StatusCodes.OK).json(result)
        }catch(error : any){
            const status = error.message.includes('Không tìm thấy') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(status).json({ message: error.message });   
        }
    }
}