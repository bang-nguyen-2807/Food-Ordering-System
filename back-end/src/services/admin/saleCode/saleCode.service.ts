import { Request } from "express";
import { SaleCodeRepo } from "../../../repositories/admin/saleCode/saleCode.repo"
import { StatusCodes } from "http-status-codes";
export class SaleCodeService{
    private saleCodeRepo: SaleCodeRepo;
    constructor(){
        this.saleCodeRepo = new SaleCodeRepo()
    }
    async listSaleCodeService(){ // GET sale code
        const result = await this.saleCodeRepo.listSaleCode();
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        }return result
    }
    async addSaleCodeService(req : Request){// POST sale code
        const result = await this.saleCodeRepo.addSaleCode(req);
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        }return result
    }
    async deleteSaleCodeService(req : Request){
        const result = await this.saleCodeRepo.deleteSaleCode(req);
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        }return result
    }
}