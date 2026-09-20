import { HomeRepo } from "../../../repositories/users/home/home.repo";

export class HomeService {
    private homeRepo: HomeRepo;
    constructor() {
        this.homeRepo = new HomeRepo();
    }
    async getListRestaurant(lat : string , lng : string) {
        const result = await this.homeRepo.getListRestaurant(lat , lng);
        return result;
    }   
    async getListCatagories() {
        const result = await this.homeRepo.getListCatagories();
        return result;
    }
}