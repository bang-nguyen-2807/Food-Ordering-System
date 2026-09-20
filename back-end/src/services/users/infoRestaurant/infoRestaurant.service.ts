import { InfoRestaurantRepo } from "../../../repositories/users/infoRestaurant/infoRestaurant.repo";

export class InfoRestaurantService{
    private infoRestaurantRepo : InfoRestaurantRepo
    constructor() {
        this.infoRestaurantRepo = new InfoRestaurantRepo();
    }
    async getInfoRestaurant(RestaurantId : string , CategoriesRestaurantId ?: string) {
        return this.infoRestaurantRepo.getInfoRestaurant(RestaurantId , CategoriesRestaurantId);
    }
    async getListCategoriesRestaurant(RestaurantId : string) {
        return this.infoRestaurantRepo.getListCategoriesRestaurant(RestaurantId);
    }
}