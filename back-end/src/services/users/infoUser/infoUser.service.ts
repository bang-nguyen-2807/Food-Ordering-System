import { InfoUserRepo } from "../../../repositories/users/infoUser/infoUser.repo";
import {Request} from "express";
export class InfoUserService{
    private infoUserRepo : InfoUserRepo;
    constructor(){
        this.infoUserRepo = new InfoUserRepo();
    }

    async setAddressUserService(req : Request){
        return this.infoUserRepo.setAddressUser(req);
    }
    async getAddressUser(UserId : string){
        return this.infoUserRepo.getAddressUser(UserId)
    }
    async getInfoUser(UserId : string){
        return this.infoUserRepo.getInfoUser(UserId)
    }
    async deleteAddressUser(UserAddressId : string){
        return this.infoUserRepo.deleteAddressUser(UserAddressId)
    }
    async UpdateInfoUser(req : Request){
        return this.infoUserRepo.UpdateInfoUser(req)
    }
}