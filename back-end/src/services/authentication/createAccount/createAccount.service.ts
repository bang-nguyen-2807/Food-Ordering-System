import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateAccountRepo } from './../../../repositories/authentication/createAccount/createAccount.repo';
export class CreateAccountService {
    private createAccountRepo : CreateAccountRepo;
    constructor(){
        this.createAccountRepo = new CreateAccountRepo();
    }
    async createAccountService (req : Request){
        const create = await this.createAccountRepo.createAccount(req);
        if(create){
            return create
        } return {status : StatusCodes.BAD_REQUEST , message : "Tạo tài khoản thất bại!"}
    }
}