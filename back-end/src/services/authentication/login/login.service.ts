import { Request } from 'express';
import { LoginRepo } from './../../../repositories/authentication/login/Login.repo';
import { StatusCodes } from 'http-status-codes';
export class LoginService{
    private loginRepo : LoginRepo;
    constructor(){
        this.loginRepo = new LoginRepo();
    }
    async loginService(req : Request){
        const login = await this.loginRepo.login(req);
        if(login){
            return login;
        } return {status : StatusCodes.BAD_REQUEST , message : "login fail"}
    }
}