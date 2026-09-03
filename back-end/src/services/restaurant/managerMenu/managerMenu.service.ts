import { ManagerMenuRepo } from "../../../repositories/restaurant/managerMenu/managerMenu.repo";
import {Request} from "express";
export class ManagerMenuService {
    private managerMenuRepo : ManagerMenuRepo;
    constructor(){
        this.managerMenuRepo = new ManagerMenuRepo();
    }
    async getManagerMenuService(UserId : string , CategoriesRestaurantId : string){
        const result = await this.managerMenuRepo.getManagerMenu(UserId , CategoriesRestaurantId);
        return result;
    }
    async getCategoriesRestaurantService(UserId : string){
        const result = await this.managerMenuRepo.getCategoriesRestaurant(UserId);
        return result;
    }
    async addMenuItemService(req : Request){
        const result = await this.managerMenuRepo.addMenuItem(req);
        return result;
    }
    async addCategoriesRestaurantService(req : Request){
        const result = await this.managerMenuRepo.addCategoriesRestaurant(req);
        return result;
    }
    async deleteMenuItemService(req : Request){
        const result = await this.managerMenuRepo.deleteMenuItem(req);
        return result;
    }
    async deleteCategoriesRestaurantService(req : Request){
        const result = await this.managerMenuRepo.deleteCategoriesRestaurant(req);
        return result;
    }
    async updateMenuItemService(req : Request){
        const result = await this.managerMenuRepo.updateMenuItem(req);
        return result;
    }
}