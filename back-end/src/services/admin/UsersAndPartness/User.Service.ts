import { Request } from 'express';
import { UserRepo } from "../../../repositories/admin/UsersAndPartness/User.repo";
import { StatusCodes } from 'http-status-codes';
export class UserService{
    private userRepo  :  UserRepo;
    constructor(){
        this.userRepo = new UserRepo()
    }
    async userService(){ // get data user
        const result = await this.userRepo.User();
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return result
    }
    async restaurantService (){// get data restaurant
        const result = await this.userRepo.Restaurant();
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return result
    }
    async shipperService(){
        const result = await this.userRepo.Shipper();
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return result
    }
    // User
    async AddUserService(req : Request){// post data user
        const result = await this.userRepo.addUser(req)
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return result
    }
    async updateUserService(UserId : number , FullName  : string, UserName : string , NumberPhone : string, Email : string){ // update data user
        const result = await this.userRepo.updateUser(UserId , FullName , UserName , NumberPhone , Email);
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"} 
        } return result
    }
    async deleteUserService(UserId : number){ // delete data user
        const result = await this.userRepo.deleteUser(UserId);
        if(!result){
            return {status : StatusCodes.BAD_REQUEST , message : "Bad Request"}
        }return result
    }
    // RESTAURANT SERVICES 
    async addRestaurantService(RestaurantName: string, UserId: number, Addresses: string, RestaurantRole: string) {
        const result = await this.userRepo.addRestaurant(RestaurantName, UserId, Addresses, RestaurantRole);
        if (!result) {
            return { status: StatusCodes.BAD_REQUEST, message: "Bad Request" };
        }
        return result;
    }
    async updateRestaurantService(RestaurantId: number, RestaurantName: string, UserId: number, Addresses: string, RestaurantRole: string) {
        const result = await this.userRepo.updateRestaurant(RestaurantId, RestaurantName, UserId, Addresses, RestaurantRole);
        if (!result) {
            return { status: StatusCodes.BAD_REQUEST, message: "Bad Request" };
        }
        return result;
    }
    async deleteRestaurantService(RestaurantId: number) {
        const result = await this.userRepo.deleteRestaurant(RestaurantId);
        if (!result) {
            return { status: StatusCodes.BAD_REQUEST, message: "Bad Request" };
        }
        return result;
    }
    // SHIPPER SERVICES
    async addShipperService(FullName: string, UserName: string, Password: string, NumberPhone: string, Email: string, UserId?: number) {
        const result = await this.userRepo.addShipper(FullName, UserName, Password, NumberPhone, Email, UserId);
        if (!result) {
            return { status: StatusCodes.BAD_REQUEST, message: "Bad Request" };
        }
        return result;
    }
    async updateShipperService(ShipperId: number, UserId: number, FullName: string, UserName: string, NumberPhone: string, Email: string) {
        const result = await this.userRepo.updateShipper(ShipperId, UserId, FullName, UserName, NumberPhone, Email);
        if (!result) {
            return { status: StatusCodes.BAD_REQUEST, message: "Bad Request" };
        }
        return result;
    }
    async deleteShipperService(ShipperId: number) {
        const result = await this.userRepo.deleteShipper(ShipperId);
        if (!result) {
            return { status: StatusCodes.BAD_REQUEST, message: "Bad Request" };
        }
        return result;
    }
}