import { CartUserRepo } from "../../../repositories/users/cartUser/cartUser.repo";

export class CartUserService{
    private cartUserRepo : CartUserRepo;
    constructor(){
        this.cartUserRepo = new CartUserRepo();
    }
    async addItemsToCart(UserId : string, RestaurantId : string, MenuItemId : string, Quantity : number){
        return this.cartUserRepo.addItemsToCart(UserId, RestaurantId, MenuItemId, Quantity)
    }
    async fetchItemsToCart(UserId : string , RestaurantId : number){
        return this.cartUserRepo.fetchItemsToCart(UserId, RestaurantId)
    }
    async deleteItemsFromCart(UserId : string , RestaurantId : string , MenuItemId : string){
        return this.cartUserRepo.deleteItemsFromCart(UserId, RestaurantId, MenuItemId)
    }
    async createOrderAndBill(UserId : string , RestaurantId : string , UserAddressId : string | null , DeliveryAddress : string , PaymentMethod : string , CodeSaleId :string | null , DeliveryFee : string){
        return this.cartUserRepo.createOrderAndBill(UserId, RestaurantId, UserAddressId, DeliveryAddress, PaymentMethod, CodeSaleId, DeliveryFee)
    }
    async getAddressUser(UserId : string){
        return this.cartUserRepo.getAddressUser(UserId)
    }
}